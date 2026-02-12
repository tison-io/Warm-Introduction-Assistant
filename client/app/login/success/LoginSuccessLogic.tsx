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
        const id = searchParams.get('id');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const tier = searchParams.get('tier');
        const callbackUrl = searchParams.get('callbackUrl');
        const error = searchParams.get('error');

        if (error) {
            setStatusMessage(`login failed: ${error}`);
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
            return;
        }

        if (token && id) {
            const expiryTime = Date.now() + (3 * 60 * 60 * 1000);

            localStorage.setItem('token', token);
            localStorage.setItem('auth_expiry', expiryTime.toString());

            const userData = {
                id,
                name,
                email,
                tier: tier || 'trial'
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setStatusMessage("login successful! redirecting..."); 
            
            window.dispatchEvent(new Event(AUTH_EVENT));
            router.push(callbackUrl || '/dashboard');
        } else {
            setStatusMessage("login failed. incomplete authentication data.");
            setTimeout(() => {
                router.push('/login?error=social_auth_failed');
            }, 3000);
        }
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen auth-page-container">
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