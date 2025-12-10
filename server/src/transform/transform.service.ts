import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';
import { ReminderService } from 'src/scheduler/reminder.service';


@Injectable()
export class TransformService {
  constructor(
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>,
    private readonly reminderService: ReminderService
  ) {}

  //Call GenAI endpoint for transforming intros
  async transformIntro(dto: TransformIntroDto) {
      console.log(" Received Transform Intro Payload:", dto);

      return {
        success: true,
        message: "Transform intro endpoint reached successfully.",
        received: dto,
        dummyTransformedIntro: "This is a dummy transformed intro for testing."
      };
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
