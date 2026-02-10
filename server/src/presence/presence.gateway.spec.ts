import { Test, TestingModule } from '@nestjs/testing';
import { PresenceGateway } from './presence.gateway';
import { getModelToken } from '@nestjs/mongoose';
import { Founder } from '../founder/entities/founder.entity';

describe('PresenceGateway', () => {
  let gateway: PresenceGateway;
  let founderModel: any;

  const mockServer = {
    emit: jest.fn(),
  };

  const mockFounderModel = {
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresenceGateway,
        {
          provide: getModelToken(Founder.name),
          useValue: mockFounderModel,
        },
      ],
    }).compile();

    gateway = module.get<PresenceGateway>(PresenceGateway);
    founderModel = module.get(getModelToken(Founder.name));
    
    gateway.server = mockServer as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should update user status to online and emit event', async () => {
      const mockUserId = 'user_123';
      const mockClient = {
        handshake: { query: { userId: mockUserId } },
      } as any;

      await gateway.handleConnection(mockClient);

      expect(founderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({ isOnline: true }),
      );

      expect(mockServer.emit).toHaveBeenCalledWith(
        'userStatusUpdate',
        expect.objectContaining({ userId: mockUserId, isOnline: true }),
      );
    });

    it('should return early if userId is missing', async () => {
      const mockClient = {
        handshake: { query: { userId: undefined } },
      } as any;

      await gateway.handleConnection(mockClient);

      expect(founderModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockServer.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should update user status to offline and emit event', async () => {
      const mockUserId = 'user_123';
      const mockClient = {
        handshake: { query: { userId: mockUserId } },
      } as any;

      await gateway.handleDisconnect(mockClient);

      expect(founderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({ isOnline: false }),
      );

      expect(mockServer.emit).toHaveBeenCalledWith(
        'userStatusUpdate',
        expect.objectContaining({ userId: mockUserId, isOnline: false }),
      );
    });
  });
});