import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  subscription: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCredits: (credits: number) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(response.data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateCredits = (credits: number) => {
    setUser((prev) => (prev ? { ...prev, credits } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateCredits, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
