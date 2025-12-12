import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';


@Injectable()
export class TransformService {
  constructor(
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>,
    private readonly reminderService: ReminderService
  ) {}

  //Call GenAI endpoint for transforming intros
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
        headers: {
          "Content-Type": "application/json"
        },
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

  async getIntrosByFounder(founderId: string) {
    const intros = await this.introQueueModel
      .find({ founderId })
      .sort({ createdAt: -1 }) 
      .exec();

    return intros;
  }

  async queueIntro(data: {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string;
    followUpDueDate?: Date;
  }) {
    // Prevent followUpDueDate input since status will be first queued
    if (data.followUpDueDate) {
      throw new Error(
        "Cannot set follow-up date when creating a queued intro. Set it only when marking as sent."
      );
    }

    const introRecord = await this.introQueueModel.create({
      ...data,
      status: 'queued',    
      reminderSent: false,     
      followUpCount: 0,      
    });

    return introRecord;
  }

  async updateIntroStatus(
    introId: string, 
    status: 'queued' | 'sent' | 'completed', 
    followUpDueDate?: Date
  ) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) {
      throw new NotFoundException('Intro not found');
    } 

    // Only allow setting follow-up date if status = 'sent'
    if (followUpDueDate && status !== 'sent') {
      throw new BadRequestException('Follow-up date can only be set when status is "sent".');
    }

    intro.status = status;

    if (status === 'sent') {
      intro.sentDate = new Date();
    

      if(followUpDueDate) {
        intro.followUpDueDate = followUpDueDate;

        //Integrating reminder scheduler
        await this.reminderService.createReminder(
          intro.founderId,
          intro._id.toString(),
          followUpDueDate
        )
      }
    }
    
    await intro.save();
    return intro;
  }

}
