import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
    ) {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            throw new Error('STRIPE_SECRET_KEY is missing from .env');
        }

        this.stripe = new Stripe(apiKey);
    }

    async createCheckoutSession(founderId: string) {
        const founder = await this.founderModel.findById(founderId);
        if (!founder) {
            throw new NotFoundException('Founder not found');
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro Tier - Warm Intro Assistant',
                        },
                        unit_amount: 2000, // $20.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',

            metadata: { founderId: founderId },
            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        });

        return { url:session.url };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!endpointSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined in .env');
        }
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                endpointSecret
            );
        } catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const founderId = session.metadata?.founderId;
    
            if (founderId) {
                const updatedFounder = await this.founderModel.findByIdAndUpdate(
                    founderId, 
                    { tier: 'pro' },
                    { new: true }
            );
            console.log(`Success! Founder ${updatedFounder?.name} is now PRO.`);
        } else {
            console.error('No founderId found in session metadata');
        }
    }
    }
}
