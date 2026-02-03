import { Investor, CreateInvestorDto, UpdateInvestorDto, velocityData } from '../types/investor';

const API_BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

// Dynamically get token from localStorage
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

// Fetch all investors
export async function getInvestors(searchQuery?: string, workspaceId?: string): Promise<Investor[]> {
  const url = new URL(`${API_BASE_URL}/investors`);
  
  if (workspaceId) {
    url.searchParams.append('workspaceId', workspaceId);
  }
  
  if (searchQuery) {
    url.searchParams.append('search', searchQuery);
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to fetch investors');
  }

  return response.json();
}

// Create a new investor
export async function createInvestor(data: CreateInvestorDto, workspaceId?: string): Promise<Investor> {
  const payload = workspaceId? { ...data, workspaceId } : data;
  
  const response = await fetch(`${API_BASE_URL}/investors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to create investor');
  }

  return response.json();
}

// Update an existing investor
export async function updateInvestor(id: string, data: UpdateInvestorDto): Promise<Investor> {
  
  const response = await fetch(`${API_BASE_URL}/investors/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Delete an investor
export async function deleteInvestor(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/investors/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to delete investor');
  }
  
  return;
}

//Get fundraising velocity data
export const fetchFundraisingVelocity = async (workspaceId?: string): Promise<velocityData[]> => {
  const url = workspaceId 
    ? `${API_BASE_URL}/investors/analytics/velocity?workspaceId=${workspaceId}`
    : `${API_BASE_URL}/investors/analytics/velocity`;
    
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch velocity data');
  return response.json(); 
};

// Fetch recommendations based on Workspace or Startup tags
export async function getRecommendations(workspaceId?: string, startupId?: string): Promise<Investor[]> {
  const url = new URL(`${API_BASE_URL}/investors/recommendations`);
  
  if (workspaceId) url.searchParams.append('workspaceId', workspaceId);
  if (startupId) url.searchParams.append('startupId', startupId);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to fetch recommendations');
  }

  return response.json();
}
