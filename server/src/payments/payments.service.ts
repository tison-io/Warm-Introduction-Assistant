import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Stripe from 'stripe';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';
import { Invoice, InvoiceDocument } from './entities/invoice.entity';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
        @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    ) {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            throw new Error('STRIPE_SECRET_KEY is missing from .env');
        }

        this.stripe = new Stripe(apiKey);
    }

    //Generate the stripe hosted payment page
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
                            name: 'Lifetime Access - Warm Intro Assistant',
                            description: 'One-time payment for permanent access',
                        },
                        unit_amount: 4900, // $49.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: founder.email,
            metadata: { founderId: founderId },
            success_url: `${process.env.FRONTEND_URL}/payments/success`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
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
            
            //Update tier
            if (founderId) {
                const updatedFounder = await this.founderModel.findByIdAndUpdate(
                    founderId, 
                    { tier: 'lifetime' },
                    { new: true }
            );
            //Extract Payment info for invoice
            const invoiceData = {
                founderId: new Types.ObjectId(founderId),
                stripeSessionId: session.id,
                amount: session.amount_total,
                currency: session.currency,
                status: 'paid',
                receiptUrl: session.payment_intent,
            };
            await this.invoiceModel.create(invoiceData);

            console.log(`Success! Founder ${updatedFounder?.name} has gained Lifetime access.`);
        } else {
            console.error('No founderId found in session metadata');
        }
    }
    }

    async getInvoices(founderId: string) {
        return await this.invoiceModel.find({ 
            founderId: new Types.ObjectId(founderId) 
        }).sort({ createdAt: -1 });
    }
}
