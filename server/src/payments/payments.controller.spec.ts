import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    createCheckoutSession: jest.fn(),
    handleWebhook: jest.fn(),
    getInvoices: jest.fn(),
  };

  const mockJwtGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckout', () => {
    it('should call service.createCheckoutSession with correct ID', async () => {
      const founderId = 'founder_123';
      mockPaymentsService.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com' });

      const result = await controller.createCheckout(founderId);

      expect(service.createCheckoutSession).toHaveBeenCalledWith(founderId);
      expect(result).toEqual({ url: 'http://stripe.com' });
    });
  });

  describe('webhook', () => {
    it('should call handleWebhook with signature and rawBody', async () => {
      const signature = 't=123,v1=abc';
      const mockRawBody = Buffer.from('{"id": "evt_123"}');
      const mockRequest = { rawBody: mockRawBody };

      await controller.webhook(signature, mockRequest);

      expect(service.handleWebhook).toHaveBeenCalledWith(signature, mockRawBody);
    });

    it('should throw BadRequestException if rawBody is missing', async () => {
      const signature = 't=123';
      const mockRequest = { rawBody: undefined };

      await expect(controller.webhook(signature, mockRequest))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getInvoices', () => {
    it('should call getInvoices using the userId from request', async () => {
      const mockUserRequest = {
        user: { userId: 'user_999' },
      };
      mockPaymentsService.getInvoices.mockResolvedValue([{ id: 'inv_1' }]);

      const result = await controller.getInvoices(mockUserRequest);

      expect(service.getInvoices).toHaveBeenCalledWith('user_999');
      expect(result).toEqual([{ id: 'inv_1' }]);
    });
  });
});