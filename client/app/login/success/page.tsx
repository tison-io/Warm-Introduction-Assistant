"use client";

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginSuccessLogic from './LoginSuccessLogic';

function LoadingFallback() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen auth-page-container">
            {/* Background Style consistent with Login/Signup */}
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
                    completing authentication...
                </p>
            </div>
        </div>
    );
}

export default function LoginSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginSuccessLogic />
        </Suspense>
    );
}