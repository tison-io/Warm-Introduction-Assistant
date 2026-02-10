import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesController } from './workspace.controller';
import { WorkspacesService } from './workspace.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;
  let service: WorkspacesService;

  const mockWorkspacesService = {
    create: jest.fn(),
    acceptInvitation: jest.fn(),
    getUserWorkspaces: jest.fn(),
    update: jest.fn(),
    getMembers: jest.fn(),
    delete: jest.fn(),
    inviteMember: jest.fn(),
    removeMember: jest.fn(),
  };

  const mockUserRequest = {
    user: { userId: 'founder_123', email: 'owner@test.com' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [
        {
          provide: WorkspacesService,
          useValue: mockWorkspacesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkspacesController>(WorkspacesController);
    service = module.get<WorkspacesService>(WorkspacesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Workspace CRUD', () => {
    it('create() should pass DTO and userId to service', async () => {
      const dto = { name: 'New Workspace', blurb: 'A test workspace' };
      await controller.create(dto as any, mockUserRequest);
      expect(service.create).toHaveBeenCalledWith(dto, 'founder_123');
    });

    it('update() should pass id, DTO and userId', async () => {
      const dto = { name: 'Updated Name' };
      await controller.update('ws_1', dto as any, mockUserRequest);
      expect(service.update).toHaveBeenCalledWith('ws_1', dto, 'founder_123');
    });

    it('delete() should call service with id and userId', async () => {
      await controller.delete('ws_1', mockUserRequest);
      expect(service.delete).toHaveBeenCalledWith('ws_1', 'founder_123');
    });
  });

  describe('Membership & Invites', () => {
    it('invite() should pass email, workspaceId and the full user object', async () => {
      const email = 'invitee@test.com';
      await controller.invite('ws_1', email, mockUserRequest);
      expect(service.inviteMember).toHaveBeenCalledWith(email, 'ws_1', mockUserRequest.user);
    });

    it('acceptInvite() should pass token and user object', async () => {
      const token = 'secure_token_abc';
      await controller.acceptInvite(token, mockUserRequest);
      expect(service.acceptInvitation).toHaveBeenCalledWith(token, mockUserRequest.user);
    });

    it('removeMember() should pass workspaceId, memberId, and requesterId', async () => {
      await controller.removeMember('ws_1', 'member_99', mockUserRequest);
      expect(service.removeMember).toHaveBeenCalledWith('ws_1', 'member_99', 'founder_123');
    });
  });

  describe('Queries', () => {
    it('getMyWorkspaces() should call service with userId', async () => {
      await controller.getMyWorkspaces(mockUserRequest);
      expect(service.getUserWorkspaces).toHaveBeenCalledWith('founder_123');
    });

    it('getMembers() should call service with workspaceId and userId', async () => {
      await controller.getMembers('ws_1', mockUserRequest);
      expect(service.getMembers).toHaveBeenCalledWith('ws_1', 'founder_123');
    });
  });
});