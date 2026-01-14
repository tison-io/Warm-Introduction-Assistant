// src/transform/transform.service.ts (Updated to handle Types.ObjectId and denormalized fields)

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // <-- Import Types here
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { MailService } from 'src/mail/mail.service';
import { Investor, InvestorDocument } from 'src/schemas/investor.schema';
import { WorkspacesService } from 'src/workspace/workspace.service';


@Injectable()
export class TransformService {
  constructor(
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>,
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
    private readonly reminderService: ReminderService,
    private readonly workspaceService: WorkspacesService,
    private readonly mailService: MailService,
  ) {}

  // GenAI Transform engine
  async transformIntro(dto: TransformIntroDto) {
    console.log("Received Transform Intro Payload:", dto);

    if (!dto.blurb) {
      throw new BadRequestException("Missing required field: blurb");
    }
    if (!dto.investor_preference) {
      throw new BadRequestException("Missing required field: investor_preference");
    }

    try {
      const response = await fetch("https://warm-introduction-assistant.onrender.com/transform", {
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

      // FRONTEND-SAFE RESPONSE
      return {
        success: true,
        message: "Intro transformed successfully.",
        original: {
          blurb: dto.blurb,
          investor_preference: dto.investor_preference
        },
        transformed_intro: transformed
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

  // GetIntros
  async getIntros(userId: string, workspaceId?: string) {
    let query:any;

    if(workspaceId) {
      //Workspace- check membership first
      await this.workspaceService.getMembers(workspaceId, userId);
      query = { workspaceId: new Types.ObjectId(workspaceId) };
    } else {
      //Personal- check founderId
      query = { founderId:new Types.ObjectId(userId), workspaceId: null };
    }

    return this.introQueueModel
      .find(query)
      .populate('founderId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  //Queue Intro
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

  // 3. Permission Helper
  private async validateAccess(introId: string, userId: string, action: 'view' | 'modify') {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) throw new NotFoundException('Intro not found');

    if (intro.workspaceId) {
      // Check if user is in the workspace
      await this.workspaceService.getMembers(intro.workspaceId.toString(), userId);
      
      //Only creator can modify/send/delete
      if (action === 'modify' && intro.founderId.toString() !== userId) {
        throw new ForbiddenException('Only the person who generated this intro can send or delete it.');
      }
    } else {
      // Personal pipeline check
      if (intro.founderId.toString() !== userId) {
        throw new ForbiddenException('Access denied to this personal intro.');
      }
    }
    return intro;
  }

  //Delete intro
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

    const approvalUrl = `${process.env.FRONTEND_URL}/approve-intro?introId=${intro._id}`;

    const consentMessage = `
      Hi ${intro.investorName},

      The founder of ${intro.startupName} wants to send you a warm introduction.

      Would you like to receive the intro?

      <a href="${approvalUrl}" style="background-color:#0347D2;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
      Yes, send me the intro
      </a>
    `;

    await this.mailService.sendGeneratedIntroEmail({
      investorEmail: intro.investorEmail,
      startupName: intro.startupName,
      generatedIntro: consentMessage,
    });

    intro.status = 'investor_approval_requested';
    await intro.save();

    return {
      success: true,
      message: 'Investor consent email sent successfully.',
      intro,
    };
  }

  async approveInvestorIntro(introId: string) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) throw new NotFoundException('Intro not found');

    if (intro.status !== 'investor_approval_requested') {
      throw new BadRequestException('Intro is not awaiting investor consent.');
    }

    // Update status to approved
    intro.status = 'investor_approved';
    await intro.save();

    // Send actual generated intro
    await this.sendGeneratedIntroEmail({
      investorEmail: intro.investorEmail,
      startupName: intro.startupName,
      generatedIntro: intro.generatedIntro,
    });

    // Mark as sent
    intro.status = 'sent';
    intro.sentDate = new Date();
    await intro.save();

    //Update investor status to 'contacted'
    await this.investorModel.findByIdAndUpdate(intro.investorId, {
      status: 'contacted',
      contactedAt: new Date(),
    });

    return {
      success: true,
      message: 'Investor approved and intro email sent successfully.',
      intro,
    };
  }

  // Send Intro-Mails
  async sendGeneratedIntroEmail(options: {
    investorEmail: string;
    startupName: string;
    generatedIntro: string;
  }) {
    const { investorEmail, startupName, generatedIntro } = options;

    if (!investorEmail) throw new BadRequestException("Investor email is required.");
    if (!startupName) throw new BadRequestException("Startup name is required.");
    if (!generatedIntro) throw new BadRequestException("Generated intro text is required.");

    // --- Normalize intro to be safe for JSON and emails ---
    function normalizeGeneratedIntro(rawIntro: string): string {
      let intro = rawIntro;

      // Remove surrounding quotes if present
      if (intro.startsWith('"') && intro.endsWith('"')) {
        intro = intro.slice(1, -1).trim();
      }

      // Replace escaped sequences with actual characters
      intro = intro.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

      intro = intro.replace(/\n/g, '<br />');

      return intro.trim();
    }

    const formattedIntro = normalizeGeneratedIntro(generatedIntro);
    const subject = `Warm Intro from ${startupName} startup`;

    const htmlFormattedIntro = `
      <div style="white-space: pre-wrap; font-family: sans-serif; line-height: 1.6; color: #333;">
        ${formattedIntro}
      </div>
    `;

    try {
      const result = await this.mailService.sendGeneratedIntroEmail({
        investorEmail,
        startupName,
        generatedIntro: htmlFormattedIntro,
      });

      return {
        success: true,
        message: "Intro email sent successfully to investor.",
        result,
      };
    } catch (error) {
      console.error("Investor intro email failed:", error);
      throw new BadRequestException("Failed to send investor intro email.");
    }
  }

  async updateIntroStatus(
    introId: string,
    userId: string, 
    status: 'queued' | 'sent' | 'completed', 
    followUpDueDate?: Date
  ) {
    //Checks workspace membership and intro ownership
    const intro = await this.validateAccess(introId, userId, 'modify');

    //Validation of status transitions and follow-up date
    if (status === 'sent' && !followUpDueDate) {
      throw new BadRequestException('A follow-up date is required when status is "sent".');
    }

    if (followUpDueDate && status !== 'sent') {
      throw new BadRequestException('Follow-up date can only be set when status is "sent".');
    }
    
    if (status === 'queued' && intro.status !== 'queued') {
      throw new BadRequestException('Cannot set status back to "queued".');
    }

    //State Update
    intro.status = status;

    if (status === 'sent') {
      intro.sentDate = new Date();
    
      if (followUpDueDate) {
        intro.followUpDueDate = followUpDueDate;

        await this.reminderService.createReminder(
          intro.founderId.toString(), 
          intro._id.toString(),
          followUpDueDate
        );
      }
    } else if (status === 'completed') {
      intro.followUpDueDate = null;
    }
    
    await intro.save();
    return intro;
  }

  async updateIntro( introId: string, userId: string, updateData: {investorEmail?: string; generatedIntro?: string }) {
    const intro = await this.validateAccess(introId, userId, 'modify');
    //If email, update both intro and investor record
    if(updateData.investorEmail) {
      await this.investorModel.findByIdAndUpdate(
        intro.investorId,
        { email: updateData.investorEmail.toLowerCase().trim() },
        {new: true}
      );
      intro.investorEmail = updateData.investorEmail.toLowerCase().trim();   
    }

    if (updateData.generatedIntro !== undefined) {
      intro.generatedIntro = updateData.generatedIntro;
    }

    return await intro.save();
  }
}