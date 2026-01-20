'use client';

import { useEffect, useState, useRef } from 'react'; // Added useRef
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { acceptInvite } from '../lib/workspace-api';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteToken = searchParams.get('token');
  
  // 1. Create a ref to track if the processing has started
  const hasCalledApi = useRef(false);

  const [status, setStatus] = useState<'checking' | 'processing' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Checking authentication...');

  useEffect(() => {
    const userToken = localStorage.getItem('token');

    // 2. Redirect if not logged in
    if (!userToken) {
      const returnUrl = window.location.pathname + window.location.search;
      router.replace(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // 3. Check for token and ensure we haven't already processed this mount
    if (inviteToken && !hasCalledApi.current) {
      hasCalledApi.current = true; // Lock the API call
      handleProcess(inviteToken);
    } else if (!inviteToken) {
      router.replace('/dashboard');
    }
  }, [inviteToken, router]);

  const handleProcess = async (token: string) => {
    setStatus('processing');
    setMessage('Adding you to the workspace...');

    try {
      await acceptInvite(token);
      
      setStatus('success');
      setMessage('Invitation accepted! Redirecting to dashboard...');
      
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setStatus('error');
      // If the error is "already a member", you might want to redirect to dashboard anyway
      setMessage(err.message || 'The invitation is invalid or has expired.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        
        {status === 'checking' || status === 'processing' ? (
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        ) : status === 'success' ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-4" />
        ) : (
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        )}

        <h2 className="text-white text-lg font-semibold mb-2">
          {status === 'error' ? 'Invite Error' : 'Workspace Invite'}
        </h2>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          {message}
        </p>

        {status === 'error' && (
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors border border-white/10"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}