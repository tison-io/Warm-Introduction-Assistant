export interface CheckoutSessionResponse {
    url: string;
}

export interface PaymentError {
    message: string;
    errorCode?: 'PAYMENT_REQUIRED' | 'TRIAL_EXPIRED';
}

