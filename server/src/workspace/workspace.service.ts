import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';
import { Invitation } from './entities/invitation.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
    @InjectModel(Invitation.name) private inviteModel: Model<Invitation>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateWorkspaceDto, founderId:string) {
    const founder = await this.founderModel.findById(founderId).select('name email');
    if (!founder) throw new NotFoundException('Founder not found');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${dto.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${randomSuffix}`;

    const newWorkspace = new this.workspaceModel({
      ...dto,
      slug,
      ownerId: founderId,
      members: [{
        memberId: founderId,
        name: founder.name,
        email: founder.email,
        role: 'owner',
      }],
    });
    return await newWorkspace.save();
  }

  async update(id: string, dto: UpdateWorkspaceDto, founderId:string) {
    const workspace = await this.workspaceModel.findById(id);
    if (!workspace) throw new NotFoundException('Workspace not found');

    if(workspace.ownerId.toString() !== founderId) {
      throw new ForbiddenException('Only the owner can edit the workspace');
    }

    Object.assign(workspace, dto);
    return await workspace.save();
  }

  async getMembers(id: string, founderId: string) {
    const workspace = await this.workspaceModel.findById(id).select('members');
    if (!workspace) throw new NotFoundException('Workspace not found');

    // 2. Check if the current user is a member of this workspace
    const isMember = workspace.members.some(
      (member) => member.memberId.toString() === founderId
    );

    if (!isMember) {
      throw new ForbiddenException('You do not have access to view members of this workspace');
    }

    return workspace.members;
  }

  async delete(id: string, founderId: string) {
    const workspace = await this.workspaceModel.findById(id);
    if (!workspace) throw new NotFoundException('Workspace not found');

    if (workspace.ownerId.toString() !== founderId) {
      throw new ForbiddenException('Only the owner can delete this workspace');
    }

    await this.workspaceModel.deleteOne({ _id: id });
    return { message: 'Workspace deleted successfully' };
  }

  async inviteMember(email: string, workspaceId: string, inviter: any) {
    const workspace = await this.workspaceModel.findById(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');

    const inviterId = inviter.userId;

    // 2. Security Check
    if (workspace.ownerId.toString() !== inviterId) {
      throw new ForbiddenException('Only the workspace owner can invite new members');
    }

    const isAlreadyMember = workspace.members.some(m => m.email === email);
    if (isAlreadyMember) throw new BadRequestException('User is already a member of this workspace');

    // 3. Get the inviter's name from DB (since it's not in the JWT)
    const inviterRecord = await this.founderModel.findById(inviterId);
    const inviterName = inviterRecord?.name || inviter.email;

    // 4. Generate secure token and save invitation
    const token = crypto.randomBytes(32).toString('hex');
    await this.inviteModel.create({
      email,
      token,
      workspaceId: new Types.ObjectId(workspaceId),
      invitedBy: new Types.ObjectId(inviterId),
    });

    await this.mailService.sendWorkspaceInvite(
      email,
      workspace.name,
      inviterName,
      token
    );

    return { success: true, message: `Invitation sent successfully to ${email}` };
  }

  async acceptInvitation(token: string, currentFounder: any) {
    if (!token) throw new BadRequestException('No token provided');

    const invitation = await this.inviteModel.findOne({ token });
    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation token.');
    }

    if (invitation.isAccepted) {
        throw new BadRequestException('This invitation has already been used.');
    }

    const workspace = await this.workspaceModel.findById(invitation.workspaceId);
    if (!workspace) throw new NotFoundException('Workspace no longer exists.');

    const founderId = currentFounder.userId;
    const founderRecord = await this.founderModel.findById(founderId);
    if (!founderRecord) throw new NotFoundException('Founder not found');

    

    // Check if already in workspace
    const exists = workspace.members.some(m => m.memberId.toString() === currentFounder._id);
    
    if (!exists) {
      workspace.members.push({
        memberId: new Types.ObjectId(founderId),
        name: founderRecord.name,
        email: founderRecord.email,
        role: 'member',
        joinedAt: new Date(),
      });
      await workspace.save();
    }

    invitation.isAccepted = true;
    await invitation.save();

    return { 
      message: 'Successfully joined the workspace!', 
      workspaceId: workspace._id,
      slug: workspace.slug 
    };
  }

  async removeMember(workspaceId: string, memberIdToRemove: string, requesterId: string) {
    const workspace = await this.workspaceModel.findById(workspaceId);
    if(!workspace) throw new NotFoundException('Workspace not found');

    //Only owner can remove
    if(workspace.ownerId.toString() !== requesterId) {
      throw new ForbiddenException('Only the owner can remove members');
    }

    if(memberIdToRemove === requesterId) {
      throw new BadRequestException('Owner cannot be removed from workspace');
    }

    const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(
      workspaceId,
      { $pull: { members: { memberId: new Types.ObjectId(memberIdToRemove)}}},
      { new: true }
    );

    return { message: 'Member removed successfully' };
  }

  async getUserWorkspaces(founderId: string) {
    const workspaces = await this.workspaceModel.find({
      'members.memberId': new Types.ObjectId(founderId)
    })
    .select('name slug ownerId members')
    .sort({ createdAt: -1 });

    return workspaces;
  }
}