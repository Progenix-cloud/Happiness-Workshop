'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUser } from '@/lib/mongodb/schemas';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (savedToken && savedUser) {
        // Validate that the token is still valid by calling an API
        try {
          const response = await fetch('/api/joycoins/wallet', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // Token is valid, restore session
            setToken(savedToken);
            setUserState(JSON.parse(savedUser));
          } else if (response.status === 401) {
            // Token is invalid (401 Unauthorized)
            // Clear localStorage and start fresh
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // On error, clear localStorage to be safe
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }

      setIsLoading(false);
    };

    loadAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUserState(data.user);

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUserState(data.user);

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear client-side state and storage
    setToken(null);
    setUserState(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const setUser = (user: IUser | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider value={{ user: user, token, isLoading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
