const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/founder/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  socialLogin: async (provider: string) => {
    const response = await fetch(`${API_BASE_URL}/founder/login/${provider.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  socialSignup: async (provider: string) => {
    const response = await fetch(`${API_BASE_URL}/founder/signup/${provider.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
};