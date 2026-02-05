'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AUTH_EVENT } from '../../lib/auth-events';

export default function LoginSuccessLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [statusMessage, setStatusMessage] = useState("finalizing secure login...");

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const callbackUrl = searchParams.get('callbackUrl');

        if (error) {
            setStatusMessage(`login failed: ${error}`);
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
            setStatusMessage("login successful! redirecting..."); 
            window.dispatchEvent(new Event(AUTH_EVENT));
            router.push(callbackUrl || '/dashboard');
        } else {
            setStatusMessage("login failed. no authentication data received.");
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
        }
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen auth-page-container">
            {/* Keeping the background consistent during the redirect */}
            <style dangerouslySetInnerHTML={{ __html: `
                .auth-page-container {
                    background-color: #070911;
                    background-image: linear-gradient(135deg, 
                        #2A4D8F 0%, 
                        #0F2438 30%, 
                        #070910 70%, 
                        #070911 100%
                    );
                    background-attachment: fixed;
                }
            `}} />
            
            <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-white opacity-40 mb-4" />
                <p className="text-white/60 text-sm font-medium lowercase tracking-widest">
                    {statusMessage}
                </p>
            </div>
        </div>
    );
}