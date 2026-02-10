import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return an object with userId and email from payload', async () => {
      const payload = { sub: 'user_123', email: 'test@example.com' };
      const expectedResult = { userId: 'user_123', email: 'test@example.com' };

      const result = await strategy.validate(payload);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('constructor error', () => {
    it('should throw an error if JWT_SECRET is missing', () => {
      mockConfigService.get.mockReturnValueOnce(null);

      expect(() => {
        new JwtStrategy(mockConfigService as any);
      }).toThrow('JWT_SECRET is not defined!');
    });
  });
});