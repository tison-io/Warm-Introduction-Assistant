import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginSuccessLogic from './LoginSuccessLogic';

function LoadingFallback() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-700 font-medium">Loading...</p>
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