import { QueueIntroDto, TransformIntroDto, TransformIntroResponse } from '../types/transform';

const API_BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token'); // JWT from login
  if (!authToken) {
    throw new Error('No authentication token found. Please login.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };
};

export async function transformIntroApi(dto: TransformIntroDto): Promise<TransformIntroResponse> {
    
    const headers = getAuthHeaders();

    const { blurb, investor_preference } = dto;
    const requestBody = { blurb, investor_preference };

    const response = await fetch(`${API_BASE_URL}/intros/transform`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody), 
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));    
        console.error('Transform API Error:', errorBody);
        throw new Error(errorBody.message || errorBody.details || 'Failed to transform intro. Please try again.');
    }

    return response.json() as Promise<TransformIntroResponse>;
}

export async function queueIntroApi(data: QueueIntroDto): Promise<any> {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/intros/queue`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error('Queue Intro API Error:', errorBody);
        throw new Error(errorBody.message || 'Failed to queue introduction.');
    }

    return response.json();
}