import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesService } from './workspace.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Workspace } from './entities/workspace.entity';
import { Founder } from '../founder/entities/founder.entity';
import { Invitation } from './entities/invitation.entity';
import { MailService } from '../mail/mail.service';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let workspaceModel: any;
  let founderModel: any;
  let inviteModel: any;
  let mailService: any;

  const mockFounderId = new Types.ObjectId().toString();
  const mockWorkspaceId = new Types.ObjectId().toString();

  const mockSave = jest.fn();

  beforeEach(async () => {
    const mockWorkspaceModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: mockSave.mockResolvedValue({ ...dto, _id: mockWorkspaceId }),
    }));

    Object.assign(mockWorkspaceModel, {
      findById: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      aggregate: jest.fn(),
      find: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        {
          provide: getModelToken(Workspace.name),
          useValue: mockWorkspaceModel,
        },
        {
          provide: getModelToken(Founder.name),
          useValue: {
            findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis() }),
          },
        },
        {
          provide: getModelToken(Invitation.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: { sendWorkspaceInvite: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
    workspaceModel = module.get(getModelToken(Workspace.name));
    founderModel = module.get(getModelToken(Founder.name));
    inviteModel = module.get(getModelToken(Invitation.name));
    mailService = module.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw ForbiddenException if founder tier is not pro', async () => {
      founderModel.findById().select.mockResolvedValue({ tier: 'free' });
      
      await expect(service.create({ name: 'Test', blurb: 'b' }, mockFounderId))
        .rejects.toThrow(ForbiddenException);
    });

    it('should generate a slug and save workspace for pro users', async () => {
      founderModel.findById().select.mockResolvedValue({ 
        name: 'John', email: 'j@j.com', tier: 'pro' 
      });

      const result = await service.create({ name: 'Alpha Team', blurb: 'b' }, mockFounderId);
      
      expect(mockSave).toHaveBeenCalled();
      expect(result.slug).toContain('alpha-team-');
    });
  });

  describe('getMembers (Aggregation)', () => {
    it('should throw ForbiddenException if user is not in the workspace aggregation result', async () => {
      workspaceModel.aggregate.mockResolvedValue([
        { memberId: new Types.ObjectId().toString() } 
      ]);

      await expect(service.getMembers(mockWorkspaceId, mockFounderId))
        .rejects.toThrow(ForbiddenException);
    });

    it('should return member details if user is part of the workspace', async () => {
      const mockDetails = [{ memberId: mockFounderId, name: 'John', isOnline: true }];
      workspaceModel.aggregate.mockResolvedValue(mockDetails);

      const result = await service.getMembers(mockWorkspaceId, mockFounderId);
      expect(result).toEqual(mockDetails);
    });
  });

  describe('inviteMember', () => {
    it('should throw ForbiddenException if requester is not the owner', async () => {
      workspaceModel.findById.mockResolvedValue({ ownerId: 'someone_else' });

      await expect(service.inviteMember('test@test.com', mockWorkspaceId, { userId: mockFounderId }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should create invite and send email if requester is owner', async () => {
      workspaceModel.findById.mockResolvedValue({ 
        _id: mockWorkspaceId, 
        name: 'Team', 
        ownerId: mockFounderId,
        members: []
      });
      founderModel.findById.mockResolvedValue({ name: 'Owner' });

      const result = await service.inviteMember('new@test.com', mockWorkspaceId, { userId: mockFounderId });

      expect(inviteModel.create).toHaveBeenCalled();
      expect(mailService.sendWorkspaceInvite).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('acceptInvitation', () => {
    it('should throw BadRequestException if invitation already accepted', async () => {
      inviteModel.findOne.mockResolvedValue({ isAccepted: true });

      await expect(service.acceptInvitation('token123', { userId: mockFounderId }))
        .rejects.toThrow(BadRequestException);
    });

    it('should join workspace and mark invitation as accepted', async () => {
      const mockInvite = { 
        workspaceId: mockWorkspaceId, 
        isAccepted: false, 
        save: jest.fn() 
      };
      inviteModel.findOne.mockResolvedValue(mockInvite);
      founderModel.findById.mockResolvedValue({ name: 'New Joiner', email: 'n@n.com' });
      workspaceModel.findOneAndUpdate.mockResolvedValue({ _id: mockWorkspaceId, slug: 'team-slug' });

      const result = await service.acceptInvitation('token123', { userId: mockFounderId });

      expect(mockInvite.isAccepted).toBe(true);
      expect(result.message).toContain('Successfully joined');
    });
  });
});