import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Investor } from '../schemas/investor.schema';
import { WorkspacesService } from '../workspace/workspace.service';
import { Startup } from '../startups/entities/startup.entity';
import { Workspace } from '../workspace/entities/workspace.entity';

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

  async findAll(userId: string, workspaceId?: string, search?: string, page: number = 1, limit: number = 5) {
    let query: any = {};

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
      query.workspaceId = new Types.ObjectId(workspaceId);
    } else {
      query.userId = userId;
      query.workspaceId = { $in: [null, undefined] }; 
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [investors, total] = await Promise.all([
      this.investorModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.investorModel.countDocuments(query).exec(),
    ]);

    return {
      investors,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const investor = await this.investorModel.findById(id).exec();
    
    if (!investor) throw new NotFoundException('Investor not found');

    // Check access
    if (investor.workspaceId) {
      await this.workspaceService.getMembers(investor.workspaceId.toString(), userId);
    } else if (investor.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return investor;
  }

  async update(id: string, updateInvestorDto: UpdateInvestorDto, userId: string) {
    const investor = await this.investorModel.findById(id);
    if(!investor) throw new NotFoundException('Investor not found');

    if(investor.workspaceId) {
      await this.workspaceService.getMembers(investor.workspaceId.toString(), userId);
    } else {
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

    if(investor.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this investor.');
    }

    return await this.investorModel.findByIdAndDelete(id);
  }

  async getFundraisingVelocity(userId: string, workspaceId?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const workspaceObjectId = workspaceId ? new Types.ObjectId(workspaceId) : null;

    if (workspaceId) {
      await this.workspaceService.getMembers(workspaceId, userId);
    }

    const matchQuery: any = {
      status: 'contacted',
    };

    if (workspaceObjectId) {
      matchQuery.workspaceId = workspaceObjectId;
    } else {
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
        { userId: new Types.ObjectId(userId) },
        { visibility: 'public' }             
      ]
    })
    .limit(20)
    .exec();
  }
}