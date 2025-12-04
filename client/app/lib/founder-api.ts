import { FounderResponse, FounderSignupInput } from "../types/founder";

const BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';

export async function signupFounder(data: FounderSignupInput): Promise<FounderResponse> {
    const res = await fetch(`${BASE_URL}/founder/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Signup failed"); 
    }

    return res.json();

}
