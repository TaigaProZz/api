import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TicketsBoughtService } from '../tickets_bought/tickets_bought.service';
import { Request } from 'express';

describe('StripeController', () => {
  let controller: StripeController;
  let stripeService: StripeService;
  let ticketsBoughtService: TicketsBoughtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [
        {
          provide: StripeService,
          useValue: {
            createCheckout: jest.fn(),
            webhook: jest.fn(),
          },
        },
        {
          provide: TicketsBoughtService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StripeController>(StripeController);
    stripeService = module.get<StripeService>(StripeService);
    ticketsBoughtService = module.get<TicketsBoughtService>(TicketsBoughtService);
  });

  describe('createSession', () => {
    it('should create a session and return a URL', async () => {
      const mockSession = { url: 'http://stripe.checkout.url' };
      const mockBody = { stripePriceId: 'price_123' };
      const mockUserId = 1;

      jest.spyOn(stripeService, 'createCheckout').mockResolvedValue(mockSession as any);

      const req = { user: { id: mockUserId } } as any;

      const result = await controller.createSession(mockBody, req);
      expect(result).toEqual({ url: mockSession.url });
      expect(stripeService.createCheckout).toHaveBeenCalledWith(mockBody, mockUserId);
    });

    it('should handle errors and throw an error', async () => {
      const mockBody = { stripePriceId: 'price_123' };
      const mockError = new Error('Something went wrong');

      jest.spyOn(stripeService, 'createCheckout').mockRejectedValue(mockError);

      const req = { user: { id: 1 } } as any;

      await expect(controller.createSession(mockBody, req)).rejects.toThrow('Something went wrong');
    });
  });

  describe('webhook', () => {
    it('should process a valid webhook and create a ticket', async () => {
      const mockResponse = { userId: 1, stripePriceId: 'price_123' };
      const req = {
        rawBody: Buffer.from(JSON.stringify({})),
        headers: { 'stripe-signature': 'sig_test' },
      } as any;

      jest.spyOn(stripeService, 'webhook').mockResolvedValue(mockResponse as any);
      jest.spyOn(ticketsBoughtService, 'create').mockResolvedValue(mockResponse as any);

      const result = await controller.webhook(req);
      expect(result).toEqual(mockResponse);
      expect(ticketsBoughtService.create).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle errors in webhook processing', async () => {
      const mockError = new Error('Webhook Error');
      const req = {
        rawBody: Buffer.from(JSON.stringify({})),
        headers: { 'stripe-signature': 'sig_test' },
      } as any;

      jest.spyOn(stripeService, 'webhook').mockRejectedValue(mockError);

      await expect(controller.webhook(req)).rejects.toThrow('Webhook Error');
    });
  });
});
