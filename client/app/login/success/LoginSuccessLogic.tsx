'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AUTH_EVENT } from '../../lib/auth-events';

export default function LoginSuccessLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [statusMessage, setStatusMessage] = useState("Finalizing secure login...");

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        if (error) {
            setStatusMessage(`Login failed: ${error}`);
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
            setStatusMessage("Login successful! Redirecting to dashboard..."); 
            window.dispatchEvent(new Event(AUTH_EVENT));
            router.push('/dashboard');
        } else {
            setStatusMessage("Login failed. No authentication data received.");
            
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
        }
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-700 font-medium">{statusMessage}</p>
        </div>
    );
}