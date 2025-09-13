import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: 'buyer' | 'seller'
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);

        const response = await axios.get(
          'https://book-app-aldw.onrender.com/api/user/check',
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user as User);
        } else {
          await AsyncStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error: ', error);
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/user/login', { email, password });

      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        setToken(userToken);
        setUser(userData as User);

        await AsyncStorage.setItem('token', userToken);

        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.msg || 'Login failed',
      };
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'buyer' | 'seller') => {
    try {

      const response = await api.post('/api/user/signup', {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        setToken(userToken);
        setUser(userData as User);

        await AsyncStorage.setItem('token', userToken);

        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common.Authorization;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
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
