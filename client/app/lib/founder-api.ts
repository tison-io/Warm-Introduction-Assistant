import { FounderResponse, FounderSignupInput } from "../types/founder";

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
