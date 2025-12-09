'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { authApi } from '../lib/auth-api';
import { AuthResponse } from '../types/auth';

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
      const response = await authApi.login(email, password);
      const data: AuthResponse = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/startups');
      } else {
        setError((data as any).message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
        >
          <ArrowLeft style={{ width: 16, height: 16, marginRight: 4 }} /> Back
        </button>
      </div>
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ 
              height: 48, 
              marginBottom: 10, 
              display: 'block', 
              margin: '0 auto 10px auto',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(-30px)',
              transition: 'opacity 1.2s ease-out 0.3s, transform 1.2s ease-out 0.3s',
            }} 
          />
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
              <a href="/forgot-password" style={{ color: '#254FBD', fontSize: '14px', textDecoration: 'underline' }}>
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
