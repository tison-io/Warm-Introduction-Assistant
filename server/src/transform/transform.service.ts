import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { IntroQueue, IntroQueueDocument } from './entities/intro-queue.schema';


@Injectable()
export class TransformService {
  constructor(@InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueueDocument>) {}

  //Call GenAI endpoint for transforming intros
  async transformIntro(dto: TransformIntroDto) {
    const url = process.env.GENAI_URL;

    if (!url) {
      throw new Error("GENAI_URL variable not set properly.")
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if(!response.ok) {
      throw new Error("GenAI service failed.")
    }

    const generatedIntro = await response.json();

    return generatedIntro;
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

  async updateIntroStatus(introId: string, status: 'queued' | 'sent' | 'completed', followUpDueDate?: Date) {
    const intro = await this.introQueueModel.findById(introId);
    if (!intro) {
      throw new NotFoundException('Intro not found');
    } 

    // Only allow setting follow-up date if status = 'sent'
    if (followUpDueDate && status !== 'sent') {
      throw new BadRequestException('Follow-up date can only be set when status is "sent".');
    }

    intro.status = status;
    if (status === 'sent' && followUpDueDate) {
      intro.followUpDueDate = followUpDueDate;
      intro.sentDate = new Date();
    }

    await intro.save();
    return intro;
  }

}
