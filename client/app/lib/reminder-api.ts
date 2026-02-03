import { Reminder } from '../types/reminder';

const API_BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        throw new Error('No authentication token found. Please login.');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };
};

export async function fetchReminders(workspaceId?: string): Promise<Reminder[]> {
    const url = new URL(`${API_BASE_URL}/reminders`);
    if (workspaceId) {
        url.searchParams.append('workspaceId', workspaceId)
    };

    const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to fetch reminders');
    }

    return response.json();
}

export async function deleteReminder(reminderId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to delete reminder');
    }
    return;
}

export async function markReminderCompleted(reminderId: string) {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to mark reminder as completed');
    }

    return response.json();
}