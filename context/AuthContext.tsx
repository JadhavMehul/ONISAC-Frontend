'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import api from '@lib/axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean
  message?: string;
  user: User;
}

interface RefreshResponse {
  success: boolean;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get<AuthResponse>('/auth/me'); // Hits exports.getMe
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    }); // Hits exports.loginUser
    console.log(res);
    
    setUser(res.data.user);
    router.push('/game/home');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', {
      name: name,
      email,
      password
    }); // Hits exports.loginUser

    console.log(res);
    
    router.push('/login');
  };

  const logout = async () => {
    await api.post('/auth/logout'); // Hits exports.logoutUser
    setUser(null);
    router.push('/login');
  };

  

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('useAuth must be used within AuthProvider');
  return context;
};