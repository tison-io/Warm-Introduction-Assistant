import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateSocialUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        GOOGLE_CLIENT_ID: 'client-id',
        GOOGLE_CLIENT_SECRET: 'secret',
        GOOGLE_CALLBACK_URL: 'http://localhost/callback',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should extract profile data and call authService.validateSocialUser', async () => {
      const mockProfile = {
        id: 'google-id-123',
        name: { givenName: 'John', familyName: 'Doe' },
        emails: [{ value: 'john@example.com' }],
      };
      
      const mockFounder = { _id: 'db-id', email: 'john@example.com' };
      mockAuthService.validateSocialUser.mockResolvedValue(mockFounder);
      
      const done = jest.fn();

      await strategy.validate('access-token', 'refresh-token', mockProfile, done);

      expect(authService.validateSocialUser).toHaveBeenCalledWith({
        googleId: 'google-id-123',
        email: 'john@example.com',
        name: 'John Doe',
      });

      expect(done).toHaveBeenCalledWith(null, mockFounder);
    });
  });
});