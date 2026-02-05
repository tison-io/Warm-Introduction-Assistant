import { Invoice } from "../types/invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

export const createCheckoutSession = async (founderId: string): Promise<string> => {
    const token = localStorage.getItem('token');

    if (!founderId) {
        throw new Error('Auhentication error: No founder ID provided');
    }
    
    const response = await fetch(`${API_BASE_URL}/payments/create-checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ founderId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment initialization failed'); 
    }

    const data = await response.json();
    return data.url;
}

export const getInvoices = async (): Promise<Invoice[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/payments/invoices`, {
       method: 'GET',
       headers: {
        'Authorization': `Bearer ${token}`,
       }, 
    });

    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
}