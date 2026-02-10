import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Founder } from '../founder/entities/founder.entity';

describe('AuthService', () => {
    let service: AuthService;
    let model: any;
    let jwtService: JwtService;

    const mockFounder = {
        _id: 'sample_id',
        googleId: 'google_123',
        email: 'test@example.com',
        name: 'John Doe',
        save: jest.fn().mockResolvedValue(this),
    };

    const mockFounderModel = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock_token'),
    };

    beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthService,
            {
                provide: getModelToken(Founder.name),
                useValue: mockFounderModel,
            },
            {
                provide: JwtService,
                useValue: mockJwtService,
            },
        ],
       }).compile();

       service = module.get<AuthService>(AuthService);
       model = module.get(getModelToken(Founder.name));
       jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateSocialUser', () => {
    it('should return a user if they already exist by googleId', async () => {
      model.findOne.mockReturnValue(mockFounder);

      const result = await service.validateSocialUser({
        googleId: 'google_123',
        email: 'test@example.com',
        name: 'John Doe',
      });

      expect(model.findOne).toHaveBeenCalledWith({ googleId: 'google_123' });
      expect(result).toEqual(mockFounder);
    });

    it('should link googleId to an existing email account if found', async () => {
        const userWithoutGoogle = {
            ...mockFounder,
            googleId: null,
            save: jest.fn().mockResolvedValue(true),
        };

        model.findOne
            .mockReturnValueOnce(null)            
            .mockReturnValueOnce(userWithoutGoogle);

        const profile = { googleId: 'new_google_id', email: 'test@example.com', name: 'John Doe' };
        await service.validateSocialUser(profile);

        // Now this will pass!
        expect(userWithoutGoogle.save).toHaveBeenCalled();
        expect(userWithoutGoogle.googleId).toBe('new_google_id');
        });

    it('should create a new user if not found by googleId or email', async () => {
      model.findOne.mockReturnValue(null);
      model.create.mockResolvedValue(mockFounder);

      const profile = { googleId: 'new_user', email: 'new@example.com', name: 'New User' };
      const result = await service.validateSocialUser(profile);

      expect(model.create).toHaveBeenCalled();
      expect(result).toEqual(mockFounder);
    });
  });

  describe('generateJwt', () => {
    it('should return a signed token and user data', () => {
      const result = service.generateJwt(mockFounder as any);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'mock_token');
      expect(result.user.email).toBe(mockFounder.email);
    });
  });
})