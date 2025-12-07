import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '../app/lib/auth-api';
import { AuthResponse } from '../app/types/auth';

export const useSocialAuth = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSocialAuth = async (provider: string, type: 'login' | 'signup') => {
    try {
      const response = type === 'login' 
        ? await authApi.socialLogin(provider)
        : await authApi.socialSignup(provider);
      
      const data: AuthResponse = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/startups');
      } else {
        setError((data as any).message || `${provider} ${type} failed`);
      }
    } catch (err) {
      setError(`${provider} ${type} failed`);
    }
  };

  return { handleSocialAuth, error, setError };
};