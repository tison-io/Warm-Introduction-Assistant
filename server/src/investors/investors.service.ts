import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Investor } from '../schemas/investor.schema';

@Injectable()
export class InvestorsService {
  constructor(@InjectModel(Investor.name) private investorModel: Model<Investor>) {}

  async create(createInvestorDto: CreateInvestorDto, userId: string) {
    const investor = new this.investorModel({ ...createInvestorDto, userId });
    return investor.save();
  }

  async findAll(userId: string) {
    return this.investorModel.find({ userId }).exec();
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
}