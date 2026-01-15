import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Investor } from '../schemas/investor.schema';
import { Startup, StartupDocument } from 'src/startups/entities/startup.entity';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    @InjectModel(Startup.name) private startupModel: Model<StartupDocument>,
  ) {}

  async create(createInvestorDto: CreateInvestorDto, userId: string) {
    const investor = new this.investorModel({ ...createInvestorDto, userId: new Types.ObjectId(userId) });
    return investor.save();
  }

  async findAll(userId: string, search?: string) {
    const query: any = { userId };

    if (search) {
      // Use regex to search by name (case-insensitive)
      query.name = { $regex: search, $options: 'i' };
    }

    return this.investorModel.find(query).exec();
  }

  async createPublic(createInvestorDto: CreateInvestorDto) {
    //Public investors- Sets visibility to public and no userId
    const investor = new this.investorModel({
      ...createInvestorDto,
      visibility: 'public'
    });
    return investor.save();
  }

  async findOne(id: string, userId: string) {
    const investor = await this.investorModel.findOne({ _id: id, userId }).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async update(id: string, updateInvestorDto: UpdateInvestorDto, userId: string) {
    const investor = await this.investorModel.findOneAndUpdate(
      { _id: id, userId },
      updateInvestorDto,
      { new: true }
    ).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async remove(id: string, userId: string) {
    const investor = await this.investorModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async findRecommendations(startupId: string, userId: string) {
    const startup = await this.startupModel.findById(startupId).exec();
    if (!startup || startup.tags.length === 0) {
      return [];
    }

    const userObjectId = new Types.ObjectId(userId);

    return this.investorModel.find({
      // Filter 1: Access Control (Public OR Mine)
      $or: [
        { visibility: 'public' },
        { userId: userObjectId }
      ],
      tags: { $in: startup.tags }
    })
    .sort({ updatedAt: -1 })
    .exec();
  }
}