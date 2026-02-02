/**
 * Authentication Service
 * Mock authentication for development
 */

import { db } from '@/lib/mongodb/db';
import type { IUser } from '@/lib/mongodb/schemas';

export interface AuthSession {
  user: IUser;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'trainer' | 'volunteer' | 'participant';
}

// Simple in-memory token storage for mock auth
const tokenStore = new Map<string, AuthSession>();

export const authService = {
  /**
   * Mock login - validates against predefined test users
   */
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const user = await db.users.findByEmail(credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    // Mock password validation (in real app, use bcrypt)
    if (credentials.password !== 'password123') {
      throw new Error('Invalid password');
    }

    const token = generateMockToken();
    const session: AuthSession = {
      user,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    tokenStore.set(token, session);
    return session;
  },

  /**
   * Mock signup - creates new user
   */
  signup: async (data: SignupData): Promise<AuthSession> => {
    const existingUser = await db.users.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = await db.users.create({
      email: data.email,
      name: data.name,
      password: data.password, // Mock - not hashed
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      happinessScore: 7.0,
      certificatesCount: 0,
      workshopsAttended: 0,
      workshopsBooked: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = generateMockToken();
    const session: AuthSession = {
      user: newUser,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    tokenStore.set(token, session);
    return session;
  },

  /**
   * Verify token and get session
   */
  verifyToken: async (token: string): Promise<AuthSession | null> => {
    const session = tokenStore.get(token);

    if (!session) {
      return null;
    }

    if (session.expiresAt < Date.now()) {
      tokenStore.delete(token);
      return null;
    }

    return session;
  },

  /**
   * Logout - remove token
   */
  logout: async (token: string): Promise<void> => {
    tokenStore.delete(token);
  },

  /**
   * Get current user from token
   */
  getCurrentUser: async (token: string): Promise<IUser | null> => {
    const session = await authService.verifyToken(token);
    return session?.user || null;
  },
};

/**
 * Generate mock JWT-like token
 */
function generateMockToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const signature = btoa('mock_signature_' + Math.random().toString(36).substring(7));
  return `${header}.${payload}.${signature}`;
}
