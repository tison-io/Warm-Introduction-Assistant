import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Founder } from '../founder/entities/founder.entity';
import { Invoice } from './entities/invoice.entity';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('PaymentsService', () => {
  let service: PaymentsService;
  let founderModel: any;
  let invoiceModel: any;
  let stripeMock: any;

  const mockFounder = {
    _id: '65cb6f4e1f1e2b0012345678',
    name: 'Jane Doe',
    email: 'jane@test.com',
    tier: 'free',
  };

  beforeEach(async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_123';
    process.env.FRONTEND_URL = 'http://localhost:3000';

    const mockModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      find: jest.fn().mockReturnThis(),
      sort: jest.fn(),                
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getModelToken(Founder.name), useValue: mockModel },
        { provide: getModelToken(Invoice.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    founderModel = module.get(getModelToken(Founder.name));
    invoiceModel = module.get(getModelToken(Invoice.name));
    stripeMock = (service as any).stripe;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should throw NotFoundException if founder does not exist', async () => {
      founderModel.findById.mockResolvedValue(null);
      await expect(service.createCheckoutSession(mockFounder._id)).rejects.toThrow(NotFoundException);
    });

    it('should return a stripe session URL', async () => {
      founderModel.findById.mockResolvedValue(mockFounder);
      stripeMock.checkout.sessions.create.mockResolvedValue({ url: 'http://stripe.com/pay' });

      const result = await service.createCheckoutSession(mockFounder._id);

      expect(result).toEqual({ url: 'http://stripe.com/pay' });
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('should update founder and create invoice on checkout.session.completed', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'sess_123',
            metadata: { founderId: mockFounder._id },
            amount_total: 4900,
            currency: 'usd',
            payment_intent: 'pi_123',
          },
        },
      };

      stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent);
      founderModel.findByIdAndUpdate.mockResolvedValue({ ...mockFounder, tier: 'lifetime' });

      await service.handleWebhook('sig_123', Buffer.from('{}'));

      expect(founderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockFounder._id,
        { tier: 'lifetime' },
        { new: true }
      );
      expect(invoiceModel.create).toHaveBeenCalled();
    });

    it('should throw error if webhook signature verification fails', async () => {
      stripeMock.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(service.handleWebhook('bad_sig', Buffer.from('{}')))
        .rejects.toThrow('Webhook Error: Invalid signature');
    });
  });

  describe('getInvoices', () => {
    it('should return sorted invoices for a founder', async () => {
      const mockInvoices = [{ amount: 4900 }, { amount: 5000 }];
      
      invoiceModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockInvoices),
      });

      const result = await service.getInvoices(mockFounder._id);
      
      expect(result).toEqual(mockInvoices);
      expect(invoiceModel.find).toHaveBeenCalledWith({
        founderId: new Types.ObjectId(mockFounder._id)
      });
    });
  });
});