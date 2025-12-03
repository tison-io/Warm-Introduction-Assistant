import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from '../schemas/investor.schema';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@Injectable()
export class InvestorsService {
  constructor(@InjectModel(Investor.name) private investorModel: Model<Investor>) {}

  async create(createInvestorDto: CreateInvestorDto, ownerId: string) {
    const investor = new this.investorModel({
      ...createInvestorDto,
      ownerId,
    });
    return investor.save();
  }

  async findAll(ownerId: string) {
    return this.investorModel.find({ ownerId }).exec();
  }

  async findOne(id: string, ownerId: string) {
    const investor = await this.investorModel.findOne({ _id: id, ownerId }).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async update(id: string, updateInvestorDto: UpdateInvestorDto, ownerId: string) {
    const investor = await this.investorModel.findOneAndUpdate(
      { _id: id, ownerId },
      updateInvestorDto,
      { new: true }
    ).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async remove(id: string, ownerId: string) {
    const result = await this.investorModel.deleteOne({ _id: id, ownerId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Investor not found');
    }
    return { message: 'Investor deleted successfully' };
  }
}