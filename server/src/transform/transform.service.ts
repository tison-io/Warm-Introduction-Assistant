// src/transform/transform.service.ts (Updated to handle Types.ObjectId and denormalized fields)

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // <-- Import Types here
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { MailService } from 'src/mail/mail.service';
import { Investor, InvestorDocument } from 'src/schemas/investor.schema';


@Injectable()
export class TransformService {
  constructor(
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>,
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
    private readonly reminderService: ReminderService,
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

  // GetIntrosByFounder
  async getIntrosByFounder(founderId: string) {
    const intros = await this.introQueueModel
      .find({ founderId: new Types.ObjectId(founderId) })
      .sort({ createdAt: -1 }) 
      .exec();

    return intros;
  }

  // QueueIntro
  async queueIntro(data: {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string;
    followUpDueDate?: Date;
  }) {
    // Prevent followUpDueDate input since status will be first queued
    if (data.followUpDueDate) {
      throw new BadRequestException(
        "Cannot set follow-up date when creating a queued intro. Set it only when marking as sent."
      );
    }
    
    const createData = {
      startupId: new Types.ObjectId(data.startupId),
      startupName: data.startupName,
      investorId: new Types.ObjectId(data.investorId),
      investorName: data.investorName,
      investorEmail: data.investorEmail,
      founderId: new Types.ObjectId(data.founderId),
      preferredIntroFormat: data.preferredIntroFormat,
      introPreferencesText: data.introPreferencesText,
      generatedIntro: data.generatedIntro,
      status: 'queued' as const,
      reminderSent: false,
      followUpCount: 0,
    };

    const introRecord = await this.introQueueModel.create(createData);

    return introRecord;
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
      status: 'contacted'
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

  // UpdateIntroStatus
  async updateIntroStatus(
    introId: string, 
    status: 'queued' | 'sent' | 'completed', 
    followUpDueDate?: Date
  ) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) {
      throw new NotFoundException('Intro not found');
    } 

    if (status === 'sent' && !followUpDueDate) {
        throw new BadRequestException('A follow-up date is required when status is "sent".');
    }

    if (followUpDueDate && status !== 'sent') {
      throw new BadRequestException('Follow-up date can only be set when status is "sent".');
    }
    
    if (status === 'queued' && intro.status !== 'queued') {
         throw new BadRequestException('Cannot set status back to "queued".');
    }

    intro.status = status;

    if (status === 'sent') {
      intro.sentDate = new Date();
    
      if(followUpDueDate) {
        intro.followUpDueDate = followUpDueDate;

        await this.reminderService.createReminder(
          intro.founderId.toString(), // Convert ObjectId to string for external service call
          intro._id.toString(),
          followUpDueDate
        )
      }
    } else if (status === 'completed') {
        intro.followUpDueDate = null;
    }
    
    await intro.save();
    return intro;
  }
}