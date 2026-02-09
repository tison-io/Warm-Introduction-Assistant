import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let configService: ConfigService;

  const mockAuthService = {
    generateJwt: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  const createMockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should set a cookie and redirect to the frontend with the token', async () => {
      const mockFounder = { _id: '123', email: 'test@test.com', name: 'John' };
      const mockTokenPayload = { 
        token: 'fake-jwt-token', 
        user: { id: '123', name: 'John', email: 'test@test.com' } 
      };
      
      const req = { user: mockFounder, query: { state: '/profile' } } as any;
      const res = createMockResponse();

      mockAuthService.generateJwt.mockReturnValue(mockTokenPayload);

      await controller.googleAuthRedirect(req, res);

      expect(authService.generateJwt).toHaveBeenCalledWith(mockFounder);

      expect(res.cookie).toHaveBeenCalledWith('jwt', 'fake-jwt-token', expect.objectContaining({
        httpOnly: true,
        maxAge: 86400000,
      }));

      const expectedRedirectUrl = `http://localhost:3000/login/success?token=fake-jwt-token&callbackUrl=${encodeURIComponent('/profile')}`;
      expect(res.redirect).toHaveBeenCalledWith(expectedRedirectUrl);
    });

    it('should use default dashboard callback if no state is provided', async () => {
        const req = { user: {}, query: {} } as any; 
        const res = createMockResponse();
        mockAuthService.generateJwt.mockReturnValue({ token: 'abc' });

        await controller.googleAuthRedirect(req, res);

        expect(res.redirect).toHaveBeenCalledWith(
            expect.stringContaining('callbackUrl=%2Fdashboard')
        );
    });
  });
});