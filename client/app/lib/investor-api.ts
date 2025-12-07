import { Investor, CreateInvestorDto, UpdateInvestorDto } from '../types/investor';

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
export async function getInvestors(searchQuery?: string): Promise<Investor[]> {
  const url = new URL(`${API_BASE_URL}/investors`);
  if (searchQuery) {
    url.searchParams.append('search', searchQuery);
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    next: { tags: ['investors'] },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to fetch investors');
  }

  return response.json();
}

// Create a new investor
export async function createInvestor(data: CreateInvestorDto): Promise<Investor> {
  const response = await fetch(`${API_BASE_URL}/investors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
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

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to update investor');
  }

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
}
