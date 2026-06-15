'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import api from '@lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  email: string;
  name: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addPoints: (email: string, pointsToken: number) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface ApiUserResponse {
  success: boolean;
  message?: string;
  user: User;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // ── Bootstrap: fetch current user on mount ──
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<ApiUserResponse>('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // ── Auth actions ──────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<ApiUserResponse>('/auth/login', { email, password });
      setUser(res.data.user);
      router.push('/game/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Login failed. Please try again.';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Please verify your email then sign in.');
      router.push('/login?registered=true');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // best-effort; clear local state regardless
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const addPoints = async (email: string, pointsToken: number) => {
    try {
      const res = await api.post<{ success: boolean; points: number }>('/user/addTokens', {
        email,
        pointsToken,
      });
      if (!res.data.success) throw new Error('Server returned failure');
      setUser((prev) => (prev ? { ...prev, points: res.data.points } : prev));
      toast.success(`${pointsToken} tokens added!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to add tokens.';
      toast.error(msg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, addPoints, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};