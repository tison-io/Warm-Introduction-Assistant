import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
<<<<<<< HEAD
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
=======
import { Investor, InvestorDocument } from '../schemas/investor.schema';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@Injectable()
export class InvestorsService {
  constructor(@InjectModel(Investor.name) private investorModel: Model<InvestorDocument>) {}

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
>>>>>>> feature/investors
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

<<<<<<< HEAD
  async update(id: string, updateInvestorDto: UpdateInvestorDto, userId: string) {
    const investor = await this.investorModel.findOneAndUpdate(
      { _id: id, userId },
=======
  async update(id: string, updateInvestorDto: UpdateInvestorDto, ownerId: string) {
    const investor = await this.investorModel.findOneAndUpdate(           
      { _id: id, ownerId },    
>>>>>>> feature/investors
      updateInvestorDto,
      { new: true }
    ).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

<<<<<<< HEAD
  async remove(id: string, userId: string) {
    const investor = await this.investorModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }
}
=======
  async remove(id: string, ownerId: string) {
    const result = await this.investorModel.deleteOne({ _id: id, ownerId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Investor not found');
    }
    return { message: 'Investor deleted successfully' };
  }
}  
         
>>>>>>> feature/investors
