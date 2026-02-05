export interface Invoice {
    _id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    stripeSessionId: string;
}