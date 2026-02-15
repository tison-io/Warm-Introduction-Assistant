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

  async create(dto: CreateStartupDto) {

    const startup = new this.startupModel({
      ...dto,
    });

    return startup.save();
  }

  async findMyRequests(founderId: string, page: number = 1, limit: number = 5, search?: string) {
    const skip = (page -1) * limit;
    
    const query: any = { founderId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { founderName: { $regex: search, $options: 'i' } },
      ];
    }

    const [startups, total] = await Promise.all([
      this.startupModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.startupModel.countDocuments(query),
    ]);

    return {
      startups,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
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

  async markAsDone(startupId: string) {
    const updated = await this.startupModel.findByIdAndUpdate(
      startupId,
      { status: 'done' },
      { new: true }
    );
    if (!updated) {
      throw new NotFoundException(`Startup with ID ${startupId} not found`);
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
