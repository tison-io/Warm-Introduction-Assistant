import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { Startup, StartupDocument } from './entities/startup.entity';

@Injectable()
export class StartupsService {
  constructor(
    @InjectModel(Startup.name)
    private startupModel: Model<StartupDocument>,
  ) {}

  //Public
  async create(dto: CreateStartupDto) {

    const startup = new this.startupModel({
      ...dto,
    });

    return startup.save();
  }

  async findMyRequests(founderId: string) {
    const startups = await this.startupModel.find({ founderId }).sort({ createdAt: -1 });
    return startups;
  }

  async findOne(id: string, founderId:string) {
    const startup = await this.startupModel.findOne({ _id: id, founderId});

    if(!startup) {
      throw new NotFoundException('Startup not found');
    }

    return startup;
  }

  async update(id: string, dto: UpdateStartupDto, founderId: string) {
    const updated = await this.startupModel.findOneAndUpdate(
      {_id: id, founderId },
      dto,
      { new: true },
    );

    if(!updated) {
      throw new NotFoundException('Startup not found.');
    }

    return updated;
  }

  async remove(id:string, founderId:string) {
    const deleted = await this.startupModel.findOneAndDelete({
      _id: id,
      founderId,
    });

    if(!deleted) {
      throw new NotFoundException('Startup not found.');
    }

    return { message: 'Startup deleted successfully' };
  }
}
