import React from 'react';
import { useSocialAuth } from '../hooks/useSocialAuth';

const providers = [
  { name: 'Google', icon: '/google.svg' },
  { name: 'Apple', icon: '/apple.svg' },
  { name: 'Facebook', icon: '/facebook.svg' },
];

interface SocialAuthButtonsProps {
  type: 'login' | 'signup';
  onError?: (error: string) => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ type, onError }) => {
  const { handleSocialAuth, error } = useSocialAuth();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', gap: 16 }}>
      {providers.map((p) => (
        <button
          key={p.name}
          onClick={() => handleSocialAuth(p.name, type)}
          style={{
            background: '#F3F4F6',
            border: 'none',
            borderRadius: '50%',
            padding: 8,
            width: 38,
            height: 38,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={p.name}
        >
          <img src={p.icon} alt={p.name} style={{ width: 22, height: 22 }} />
        </button>
      ))}
    </div>
  );
};