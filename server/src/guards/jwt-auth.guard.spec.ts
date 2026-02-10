import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockRequest: any;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    mockRequest = {
      headers: {
        authorization: authHeader,
      },
      user: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true and set user payload if token is valid', () => {
    const mockPayload = { userId: '123', email: 'test@test.com' };
    const context = createMockContext('Bearer valid-token');
    
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockPayload);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
  });

  it('should throw UnauthorizedException if no token is provided', () => {
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Token not found'),
    );
  });

  it('should throw UnauthorizedException if token format is not Bearer', () => {
    const context = createMockContext('Basic some-token');

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Token not found'),
    );
  });

  it('should throw UnauthorizedException if jwt.verify fails', () => {
    const context = createMockContext('Bearer invalid-token');
    
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid signature');
    });

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should throw UnauthorizedException if JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    const context = createMockContext('Bearer token');

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('JWT configuration error'),
    );
  });
});