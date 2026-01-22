import { ExecutionRateResponse, IntroQueue, OutcomeLog, StatusUpdatePayload } from '../types/intro';

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


export async function fetchIntrosByFounder(workspaceId?: string): Promise<IntroQueue[]> {
    const url = workspaceId
        ? `${API_BASE_URL}/intros/my-queue?workspaceId=${workspaceId}`
        : `${API_BASE_URL}/intros/my-queue`;
    

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

export async function updateIntroContent(
    introId: string,
    payload: { investorEmail?: string; generatedIntro?: string }
): Promise<IntroQueue> {
    const response = await fetch(`${INTRO_ENDPOINT}/${introId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to update intro content.');
    }

    return response.json();
}

export async function deleteIntro(introId: string): Promise<void> {
    const response = await fetch(`${INTRO_ENDPOINT}/${introId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to delete introduction.');
    }
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

export async function fetchExecutionRate(workspaceId?: string): Promise<number> {
    const headers = getAuthHeaders();

    const url = new URL(`${API_BASE_URL}/intros/metrics/execution-rate`);
    if (workspaceId) url.searchParams.append('workspaceId', workspaceId);

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch execution rate');
    }

    const data: ExecutionRateResponse = await response.json();
    return data.executionRate;
}

export async function fetchOutcomeLogs(workspaceId?: string): Promise<OutcomeLog[]> {
    const url = workspaceId
        ? `${API_BASE_URL}/intros/outcomes/history?workspaceId=${workspaceId}`
        : `${API_BASE_URL}/intros/outcomes/history`;

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch activity logs');
    return response.json();
}