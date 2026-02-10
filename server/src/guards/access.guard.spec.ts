import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AccessGuard } from './access.guard';
import { Founder } from '../founder/entities/founder.entity';

describe('AccessGuard', () => {
  let guard: AccessGuard;
  let mockFounderModel: any;

  const createMockContext = (user: any): Partial<ExecutionContext> => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as any);

  beforeEach(async () => {
    mockFounderModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessGuard,
        {
          provide: getModelToken(Founder.name),
          useValue: mockFounderModel,
        },
      ],
    }).compile();

    guard = module.get<AccessGuard>(AccessGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access for lifetime tier', async () => {
    const context = createMockContext({ userId: 'user123' });
    mockFounderModel.findById.mockResolvedValue({
      tier: 'lifetime',
    });

    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should allow access if trial is still active', async () => {
    const context = createMockContext({ userId: 'user123' });
    
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 2);

    mockFounderModel.findById.mockResolvedValue({
      tier: 'trial',
      trialStartDate: recentDate,
    });

    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if trial has expired', async () => {
    const context = createMockContext({ userId: 'user123' });
    
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);

    mockFounderModel.findById.mockResolvedValue({
      tier: 'trial',
      trialStartDate: oldDate,
    });

    await expect(guard.canActivate(context as ExecutionContext))
      .rejects.toThrow(ForbiddenException);
  });

  it('should return false if no user is in request', async () => {
    const context = createMockContext(null);
    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(false);
  });
});