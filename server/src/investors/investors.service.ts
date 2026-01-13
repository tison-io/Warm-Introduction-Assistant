import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Investor } from '../schemas/investor.schema';
import { WorkspacesService } from 'src/workspace/workspace.service';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    private readonly workspaceService: WorkspacesService,
  ) {}

  async create(createInvestorDto: CreateInvestorDto, userId: string) {
    const investor = new this.investorModel({ 
      ...createInvestorDto, 
      userId,
      workspaceId: createInvestorDto.workspaceId ? new Types.ObjectId(createInvestorDto.workspaceId) : null 
    });
    return investor.save();
  }

  async findAll(userId: string, workspaceId?: string, search?: string) {
    let query: any;

    if (workspaceId) {
      //Shared Pipeline- check membership first
      await this.workspaceService.getMembers(workspaceId, userId);

      query = { workspaceId: new Types.ObjectId(workspaceId) };
    } else {
      //Personal Pipeline
      query = { userId, workspaceId: null};
    }

    if(search) {
      query.name = {$regex: search, $options: 'i'};
    }

    return this.investorModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const investor = await this.investorModel.findOne({ _id: id, userId }).exec();
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    return investor;
  }

  async update(id: string, updateInvestorDto: UpdateInvestorDto, userId: string) {
    const investor = await this.investorModel.findById(id);
    if(!investor) throw new NotFoundException('Investor not found');

    //If in workspace, check if user is a member
    if(investor.workspaceId) {
      await this.workspaceService.getMembers(investor.workspaceId.toString(), userId);
    } else {
      //Personal pipeline - check owner
      if(investor.userId.toString() !== userId) throw new ForbiddenException('You are not authorized to update this investor.');
    }

    return await this.investorModel.findByIdAndUpdate(id, updateInvestorDto, { new: true });
  }

  async remove(id: string, userId: string) {
    const investor = await this.investorModel.findById(id);
    if(!investor) throw new NotFoundException('Investor not found.');

    //Only creator can delete
    if(investor.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this investor.');
    }
  }

  async getFundraisingVelocity(userId: string, workspaceId?: string) {
    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
    }

    const matchQuery: any = {
      status: 'contacted',
    };

    if (workspaceId) {
      matchQuery.workspaceId = new Types.ObjectId(workspaceId);
    } else {
      matchQuery.$or = [
        { userId: userId }, 
        { userId: new Types.ObjectId(userId) }
      ];
      matchQuery.workspaceId = { $in: [null, undefined] };
    }

    return this.investorModel.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          // Fallback logic for old data
          effectiveDate: { $ifNull: ["$contactedAt", "$updatedAt", new Date()] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$effectiveDate" } },
          dailyCount: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          investorsContacted: "$dailyCount"
        }
      }
    ]);
  }
}