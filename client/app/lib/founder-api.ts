import { FounderLoginResponse, FounderResponse, FounderSignupInput, FounderUpdateInput } from "../types/founder";

const BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

export async function signupFounder(data: FounderSignupInput): Promise<FounderResponse> {
    try {
        const res = await fetch(`${BASE_URL}/founder/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let errorMessage = "Signup failed";
            try {
                const error = await res.json();
                errorMessage = error.message || error.error || `Server error: ${res.status}`;
            } catch {
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (error: any) {
        if (error.message) {
            throw error;
        }
        throw new Error("Network error. Please check your internet connection.");
    }
}


export async function loginFounder(email: string, password: string): Promise<FounderLoginResponse> {
    try {
        const res = await fetch(`${BASE_URL}/founder/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            let errorMessage = "Login failed";
            try {
                const error = await res.json();
                errorMessage = error.message || error.error || `Server error: ${res.status}`;
            } catch {
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (error: any) {
        if (error.message) {
            throw error;
        }
        throw new Error("Network error. Please check your internet connection.");
    }
}

export async function getFounderProfile(): Promise<FounderResponse> {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found. Please login.");

        const res = await fetch(`${BASE_URL}/founder/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            let errorMessage = "Failed to fetch profile";
            try {
                const error = await res.json();
                errorMessage = error.message || error.error || `Server error: ${res.status}`;
            } catch {
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (error: any) {
        throw new Error(error.message || "Network error. Please check your internet connection.");
    }
}

export async function updateFounderProfile(data: FounderUpdateInput): Promise<FounderResponse> {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found. Please login.");

        const res = await fetch(`${BASE_URL}/founder/profile`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let errorMessage = "Failed to update profile";
            try {
                const error = await res.json();
                errorMessage = error.message || error.error || `Server error: ${res.status}`;
            } catch {
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (error: any) {
        throw new Error(error.message || "Network error. Please check your internet connection.");
    }
}
