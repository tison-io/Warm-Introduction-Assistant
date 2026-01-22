import { Workspace, WorkspaceMember } from "../types/workspace";

const API_BASE_URL = process.env.PUBLIC_NEXT_FOUNDER_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function fetchWorkspaceDetails(workspaceId: string): Promise<Workspace> {
  const response = await fetch(`${API_BASE_URL}/workspaces/my-workspaces`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workspace');
  }

  const workspace: Workspace[] = await response.json();
  const current = workspace.find(w => w._id === workspaceId);

  if (!current) {
    throw new Error('Workspace not found in your account');
  }

  return current;
}

export async function fetchMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/members`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

export async function sendInvite(workspaceId: string, email: string) {
  const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/invite`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function acceptInvite(token: string) {
  const res = await fetch(`${API_BASE_URL}/workspaces/accept-invite`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to accept invitation');
  }

  return res.json();
}