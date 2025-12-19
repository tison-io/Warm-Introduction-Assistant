// lib/intro-api.ts

import { IntroQueue, StatusUpdatePayload } from '../types/intro';

const API_BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';
const INTRO_ENDPOINT = `${API_BASE_URL}/intros`;


function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

const getAuthHeaders = () => {
    const authToken = getToken();
    
    if (!authToken) {
        throw new Error('No authentication token found. Please login.');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
};


export async function fetchIntrosByFounder(): Promise<IntroQueue[]> {
    const url = `${INTRO_ENDPOINT}/my-queue`;
    
    const response = await fetch(url, {
        headers: getAuthHeaders(),
        cache: 'no-cache' 
    });
    
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to fetch introductions.');
    }
    
    return response.json();
}

export async function updateIntroStatus(introId: string, payload: StatusUpdatePayload): Promise<IntroQueue> {
    const response = await fetch(`${INTRO_ENDPOINT}/${introId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to update intro status.');
    }

    return response.json();
}

export async function sendIntroRequest(introId: string): Promise<any> {
    const response = await fetch(`${INTRO_ENDPOINT}/${introId}/request-consent`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to send intro request.');
    }

    return response.json();
}

export async function approveIntro(introId: string): Promise<any> {
    const response = await fetch(`${INTRO_ENDPOINT}/${introId}/approve`, {
        method: 'POST',
    });

    const data = await response.json().catch(() => ({}));

    // Treat "already approved" as normal response
    if (!response.ok && !data.message?.includes("Intro is not awaiting investor consent")) {
        throw new Error(data.message || 'Failed to approve intro.');
    }

    return data;
}