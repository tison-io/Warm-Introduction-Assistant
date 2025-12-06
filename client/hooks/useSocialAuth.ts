import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useSocialAuth = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSocialAuth = async (provider: string, type: 'login' | 'signup') => {
    try {
      const response = await fetch(`http://localhost:4000/founder/${type}/${provider.toLowerCase()}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(`${provider} ${type} failed`);
      }
    } catch (err) {
      setError(`${provider} ${type} failed`);
    }
  };

  return { handleSocialAuth, error, setError };
};