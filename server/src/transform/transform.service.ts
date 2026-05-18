import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { MailService } from '../mail/mail.service';
import { Investor, InvestorDocument } from '../schemas/investor.schema';
import { WorkspacesService } from '../workspace/workspace.service';
import { IntroOutcomeLogDocument } from './entities/intro-logs.schema';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';
import { StartupsService } from 'src/startups/startups.service';


@Injectable()
export class TransformService {
  constructor(
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>,
    @InjectModel('IntroOutcomeLog') private auditLogModel: Model<IntroOutcomeLogDocument>,
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
    @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
    private readonly reminderService: ReminderService,
    private readonly workspaceService: WorkspacesService,
    private readonly mailService: MailService,
    private readonly startupsService: StartupsService,
  ) {}

  async transformIntro(dto: TransformIntroDto, userId: string) {
    const founder = await this.founderModel.findById(userId);
    if (!founder) throw new NotFoundException('Founder not found');

    if (founder.tier === 'free') {
      const transformationCount = await this.introQueueModel.countDocuments({
        founderId: new Types.ObjectId(userId)
      });

      if (transformationCount >= 5) {
        throw new ForbiddenException(
          'You have reached the limit of 5 transformation for the free tier. Please upgrade to continue using this service.'
        );
      }
    }

    console.log("Received Transform Intro Payload:", dto);

    if (!dto.blurb) {
      throw new BadRequestException("Missing required field: blurb");
    }
    if (!dto.investor_preference) {
      throw new BadRequestException("Missing required field: investor_preference");
    }

    try {
      const aiUrl = process.env.GENAI_URL || "https://warm-introduction-assistant.onrender.com/transform";
      const response = await fetch(aiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blurb: dto.blurb,
          investor_preference: dto.investor_preference
        })
      });

      if (!response.ok) {
        throw new Error(`GenAI service returned status ${response.status}`);
      }

      const transformed = await response.text();

      return {
        success: true,
        message: "Intro transformed successfully.",
        original: {
          blurb: dto.blurb,
          investor_preference: dto.investor_preference
        },
        transformed_intro: transformed,
        usage: founder.tier === 'free' ? 'limited' : 'unlimited'
      };

    } catch (error) {
      console.error("Error transforming intro:", error);

      throw new BadRequestException({
        success: false,
        message: "Failed to transform intro.",
        details: error.message
      });
    }
  }

  async getIntros(userId: string, workspaceId?: string, search?: string, page: number = 1) {
    const limit = 5;
    const skip = (page -1) * limit;
    let query:any = {};

    if(workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
      query = { workspaceId: new Types.ObjectId(workspaceId) };
    } else {
      query = { founderId:new Types.ObjectId(userId), workspaceId: null };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { startupName: searchRegex },
        { investorName: searchRegex },
        { founderName: searchRegex },
      ];
    }

    const [data, total] = await Promise.all([
      this.introQueueModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.introQueueModel.countDocuments(query),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async queueIntro(data: any, userId: string) {
    const workspaceId = data.workspaceId ? new Types.ObjectId(data.workspaceId) : null;

    if (workspaceId) {
      await this.workspaceService.getMembers(data.workspaceId, userId);
    }

    const createData = {
      ...data,
      founderId: new Types.ObjectId(userId),
      workspaceId,
      status: 'queued' as const,
    };

    return await this.introQueueModel.create(createData);
  }

  private async validateAccess(introId: string, userId: string, action: 'view' | 'modify') {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) throw new NotFoundException('Intro not found');

    if (intro.workspaceId) {
      await this.workspaceService.getMembers(intro.workspaceId.toString(), userId);
      if (action === 'modify' && intro.founderId.toString() !== userId) {
        throw new ForbiddenException('Only the person who generated this intro can send or delete it.');
      }
    } else {
      if (intro.founderId.toString() !== userId) {
        throw new ForbiddenException('Access denied to this personal intro.');
      }
    }
    return intro;
  }

  async remove(introId:string, userId:string) {
    const intro = await this.validateAccess(introId, userId, 'modify');
    return await this.introQueueModel.findByIdAndDelete(introId);
  }

  async requestInvestorConsent(introId: string) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) throw new NotFoundException('Intro not found');

    if (intro.status !== 'queued') {
      throw new BadRequestException('Intro must be queued to request consent.');
    }

    const matchingTags = intro.startupTags.filter(tag => 
      intro.investorTags.some(iTag => iTag.toLowerCase() === tag.toLowerCase())
    );

    const recipients = [
      { email: intro.investorEmail, name: intro.investorName },
      { email: intro.founderEmail, name: intro.founderName }
    ];

    const approvalUrl = `${process.env.FRONTEND_URL}/approve-intro?introId=${intro._id}`;

    await this.mailService.sendConsentEmail({
      recipients,
      otherPersonName: intro.investorName,
      startupName: intro.startupName,
      startupBlurb: intro.startupBlurb,
      matchingTags: matchingTags,
      approvalUrl: approvalUrl,
    });

    intro.status = 'approvals_requested';
    await intro.save();

    return {
      success: true,
      message: 'Consent mails sent to both parties successfully.',
      intro,
    };
  }

  async processApproval(introId: string, email: string) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) throw new NotFoundException('Intro not found');

    const normalizedEmail = email.toLowerCase().trim();
    const isInvestor = normalizedEmail === intro.investorEmail.toLowerCase();
    const isFounder = normalizedEmail === intro.founderEmail.toLowerCase();

    if (!isInvestor && !isFounder) {
      throw new ForbiddenException('Email does not match any party in this intro.');
    }

    if (isInvestor) {
      if (intro.status === 'sent' || intro.status === 'investor_approved') {
        return { success: true, message: 'You had already approved this intro.', intro };
      }

      if (intro.status === 'founder_approved') {
        return await this.finalizeAndSendIntro(intro);
      }

      intro.status = 'investor_approved';
      await this.captureLog(intro, 'investor_approved_consent', `Investor ${intro.investorName} approved to ${intro.startupName}.`);
    }

    if (isFounder) {
      if (intro.status === 'sent' || intro.status === 'founder_approved') {
        return { success: true, message: 'Already approved by you.', intro };
      }

      if (intro.status === 'investor_approved') {
        return await this.finalizeAndSendIntro(intro);
      }

      intro.status = 'founder_approved';
      await this.captureLog(intro, 'founder_approved_consent', `Founder ${intro.founderName} to ${intro.startupName} approved.`);
    }

    await intro.save();
    return {
      success: true,
      message: 'Approval recorded. Waiting for the other party to confirm.',
      intro,
    };
  }

  private async finalizeAndSendIntro(intro: any) {
    await this.sendGeneratedIntroEmail({
      investorEmail: intro.investorEmail,
      investorName: intro.investorName,
      founderEmail: intro.founderEmail,
      founderName: intro.founderName,
      startupName: intro.startupName,
      generatedIntro: intro.generatedIntro,
    });

    intro.status = 'sent';
    intro.sentDate = new Date();
    await intro.save();

    if (intro.startupId) {
      try {
        await this.startupsService.markAsDone(intro.startupId.toString());
      } catch (error) {
        console.error(`Failed to update startup ${intro.startupId} to done:`, error);
      }
    }

    await this.captureLog(intro, 'intro_mail_delivered', `Final intro of ${intro.startupName} sent to ${intro.investorEmail} and ${intro.founderEmail}.`);

    return {
      success: true,
      message: 'Double opt-in complete! Intro email sent and request marked done.',
      intro,
    };
  }

  async sendGeneratedIntroEmail(options: {
    investorEmail: string;
    investorName: string;
    founderEmail: string;
    founderName: string;
    startupName: string;
    generatedIntro: string;
  }) {
    const normalizeIntro = (raw: string): string => {
      let clean = raw.trim();
      if (clean.startsWith('"') && clean.endsWith('"')) clean = clean.slice(1, -1);
      return clean.replace(/\\n/g, '<br />').replace(/\n/g, '<br />');
    };

    const formattedIntro = normalizeIntro(options.generatedIntro);

    try {
      const result = await this.mailService.sendGeneratedIntroEmail({
        ...options,
        generatedIntro: formattedIntro,
      });

      return {
        success: true,
        message: "Intro email sent successfully to both parties.",
        result,
      };
    } catch (error) {
      console.error("Final intro delivery failed:", error);
      throw new BadRequestException("Failed to deliver final introduction.");
    }
  }

  async updateIntroStatus(
    introId: string,
    userId: string, 
    status?: 'queued' | 'sent' | 'completed', 
    followUpDueDate?: Date
  ) {
    const intro = await this.validateAccess(introId, userId, 'modify');

    const effectiveStatus = status || (intro.status as 'queued' | 'sent' | 'completed');

    if (effectiveStatus === 'sent' && !followUpDueDate && status) { 
      throw new BadRequestException('A follow-up date is required when status is "sent".');
    }

    if (followUpDueDate && effectiveStatus !== 'sent') {
      throw new BadRequestException('Follow-up date can only be set when status is "sent".');
    }
    
    if (status) {
      intro.status = status;
    }

    if (effectiveStatus === 'sent') {
      if (status === 'sent') {
        intro.sentDate = new Date();
      }
    
      if (followUpDueDate) {
        intro.followUpDueDate = followUpDueDate;

        await this.reminderService.createReminder(
          intro.founderId.toString(), 
          intro._id.toString(),
          followUpDueDate,
          intro.startupName,
          intro.investorName,
          intro.workspaceId?.toString()
        );
      }
    } else if (status === 'completed') {
      intro.followUpDueDate = null;
    }
    
    await intro.save();
    return intro;
  }

  async updateIntro( introId: string, userId: string, updateData: {investorEmail?: string; investorName?: string; generatedIntro?: string }) {
    const intro = await this.validateAccess(introId, userId, 'modify');
    if(updateData.investorEmail || updateData.investorName) {
      const investorUpdate: any = {};
    
      if (updateData.investorEmail) {
        const cleanEmail = updateData.investorEmail.toLowerCase().trim();
        investorUpdate.email = cleanEmail;
        intro.investorEmail = cleanEmail;
      }
      
      if (updateData.investorName) {
        const cleanName = updateData.investorName.trim();
        investorUpdate.name = cleanName;
        intro.investorName = cleanName;
      }

      await this.investorModel.findByIdAndUpdate(
        intro.investorId,
        investorUpdate,
        { new: true }
      );
    }

    if (updateData.generatedIntro !== undefined) {
      intro.generatedIntro = updateData.generatedIntro;
    }

    return await intro.save();
  }

  async getOutcomeLogs(userId: string, workspaceId?: string) {
    let query: any;

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
      query = { workspaceId: new Types.ObjectId(workspaceId) };
    } else {
      query = {userId: new Types.ObjectId(userId), workspaceId: null };
    }

    return this.auditLogModel.find(query).sort({ createdAt:-1 }).exec();
  }

  private async captureLog(intro: any, outcome: string, notes?: string) {
    return await this.auditLogModel.create({
      introId: intro._id,
      userId: intro.founderId,
      workspaceId: intro.workspaceId,
      investorName: intro.investorName,
      outcome: outcome,
      notes: notes || `Event triggered: ${outcome}`,
    });
  }

  async getExecutionRate(userId: string, workspaceId?: string): Promise<number> {
    let matchQuery: any;

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
      matchQuery = { workspaceId: new Types.ObjectId(workspaceId) };
    } else {
      matchQuery = { founderId: new Types.ObjectId(userId), workspaceId: null };
    }

    const stats = await this.introQueueModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sent: {
            $sum: { 
              $cond: [{ $in: ['$status', ['sent', 'completed', 'investor_approved']] }, 1, 0] 
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          rate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$sent', '$total'] }, 100] }, 0] }
            ]
          }
        }
      }
    ]);

    return stats.length > 0 ? stats[0].rate : 0;
  }
}