import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Investor } from '../schemas/investor.schema';
import { WorkspacesService } from 'src/workspace/workspace.service';
import { Startup } from 'src/startups/entities/startup.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    @InjectModel(Startup.name) private startupModel: Model<Startup>,
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
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

    const userObjectId = new Types.ObjectId(userId);

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
      query = { 
        workspaceId: new Types.ObjectId(workspaceId) 
      };
    } else {
      // Personal Pipeline
      query = { 
        userId: userObjectId,
        workspaceId: { $in: [null, undefined] } 
      };
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

    const updatedData = { ...updateInvestorDto };
    if (updatedData.workspaceId) {
      updatedData.workspaceId = new Types.ObjectId(updatedData.workspaceId) as any;
    }
    
    return await this.investorModel.findByIdAndUpdate(
      id, 
      updatedData, 
      { new: true }
    );
  }

  async remove(id: string, userId: string) {
    const investor = await this.investorModel.findById(id);
    if(!investor) throw new NotFoundException('Investor not found.');

    //Only creator can delete
    if(investor.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this investor.');
    }

    return await this.investorModel.findByIdAndDelete(id);
  }

  async getFundraisingVelocity(userId: string, workspaceId?: string) {
    // 1. Cast string IDs to ObjectIds for the Aggregation Pipeline
    const userObjectId = new Types.ObjectId(userId);
    const workspaceObjectId = workspaceId ? new Types.ObjectId(workspaceId) : null;

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
    }

    const matchQuery: any = {
      status: 'contacted',
    };

    if (workspaceObjectId) {
      // Workspace velocity
      matchQuery.workspaceId = workspaceObjectId;
    } else {
      // Personal velocity
      matchQuery.userId = userObjectId;
      matchQuery.workspaceId = { $in: [null, undefined] };
    }

    return this.investorModel.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
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

  async getRecommendations(userId: string, workspaceId?: string, startupId?: string) {
    let targetTags: string[] = [];

    if (workspaceId) {
      const workspace = await this.workspaceModel.findById(workspaceId).select('tags').exec();
      targetTags = workspace?.tags || [];
    } else if (startupId) {
      const startup = await this.startupModel.findOne({ _id: startupId, founderId: userId }).select('tags').exec();
      targetTags = startup?.tags || [];
    }

    if (targetTags.length === 0) return [];

    const tagRegexes = targetTags.map(tag => new RegExp(`^${tag}$`, 'i'));

    const exclusionCriteria: any = {};
    if (workspaceId) exclusionCriteria.workspaceId = new Types.ObjectId(workspaceId);
    if (startupId) exclusionCriteria.startupId = new Types.ObjectId(startupId);

    const existingInPipeline = await this.investorModel
      .find(exclusionCriteria)
      .distinct('name');

    return this.investorModel.find({
      name: { $nin: existingInPipeline },
      tags: { $in: tagRegexes},          
      $or: [
        { userId: new Types.ObjectId(userId) }, // My personal investors 
        { visibility: 'public' }               // Global public investors
      ]
    })
    .limit(20)
    .exec();
  }
}