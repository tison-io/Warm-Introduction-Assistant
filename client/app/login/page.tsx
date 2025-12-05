'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const providers = [
  { name: 'Google', icon: '/google.svg' },
  { name: 'Apple', icon: '/apple.svg' },
  { name: 'Facebook', icon: '/facebook.svg' },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/founder/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const response = await fetch(`http://localhost:4000/founder/login/${provider.toLowerCase()}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      }
    } catch (err) {
      setError(`${provider} login failed`);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/backeground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)',
          maxWidth: '370px',
          width: '100%',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, marginBottom: 10, display: 'block', margin: '0 auto 10px auto' }} />
          <h2 style={{ margin: 0, fontWeight: 700 }}>Welcome back</h2>
          <div style={{ color: '#666', fontSize: 15 }}>warm Introduction Assistant</div>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #C8C8C8',
                fontSize: '15px',
                outline: 'none',
                marginTop: 3,
                marginBottom: 12,
              }}
              placeholder="Enter email"
              required
            />
            <label style={{ fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #C8C8C8',
                  fontSize: '15px',
                  outline: 'none',
                  marginTop: 3,
                }}
                placeholder="Enter password"
                required
              />
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: '#888',
                }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div style={{ textAlign: 'left', marginBottom: 10 }}>
              <a href="#" style={{ color: '#254FBD', fontSize: '14px', textDecoration: 'underline' }}>
                Forget password?
              </a>
            </div>
          </div>

          {error && (
            <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#0347D2',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 0',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 10,
              width: '100%',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ width: '100%', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
          <span style={{ background: '#fff', padding: '0 8px' }}>or sign in with email</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', gap: 16 }}>
          {providers.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSocialLogin(p.name)}
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

        <div style={{ textAlign: 'center', fontSize: 14, color: '#666', marginTop: 8 }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#254FBD', textDecoration: 'underline' }}>
          Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}