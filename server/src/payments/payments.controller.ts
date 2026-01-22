import { Controller, Post, Body, Headers, Req, BadRequestException, UseGuards } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Body('founderId') founderId: string) {
    return this.paymentsService.createCheckoutSession(founderId);
  }

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing rawBody. Check main.ts configuration.');
    }

    return this.paymentsService.handleWebhook(signature, req.rawBody);
  }
}