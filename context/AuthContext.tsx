'use client'
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
  addPoints: (email: string, pointsToken: number) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
interface User {
  uid: string;
  email: string;
  name: string;
  points: number;
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
        console.log(res);
        
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
    // router.push('/game/dashboard');
    window.location.href = '/game/dashboard';
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post<AuthResponse>('/auth/register', {
        name: name,
        email,
        password
      }); // Hits exports.loginUser

      console.log(res);
      
      router.push('/login?registered=true');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/auth/logout'); // Hits exports.logoutUser
    setUser(null);
    router.push('/login');
  };

  const addPoints = async (email: string, pointsToken: number) => {
    try {
      setLoading(true);
      const res = await api.post('/user/addTokens', {
        email,
        pointsToken,
      });

      if (!res.data.success) {
        alert("Error in adding points please try again later.")
      } else {
        setUser((prev) =>
          prev ? { ...prev, points: res.data.points } : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <AuthContext.Provider value={{ user, loading, addPoints, login, register, logout }}>
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