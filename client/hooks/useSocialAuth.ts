import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '../app/lib/auth-api';
import { AuthResponse } from '../app/types/auth';

export const useSocialAuth = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSocialAuth = (provider: string, type: 'login' | 'signup') => {
    const BASE_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';
    const providerLower = provider.toLowerCase();
    
    if (providerLower === 'apple') {
      setError('Apple Sign-In coming soon!');
      return;
    }
    
    // Redirect to backend OAuth endpoint
    window.location.href = `${BASE_URL}/auth/${providerLower}`;
  };

  return { handleSocialAuth, error, setError };
};