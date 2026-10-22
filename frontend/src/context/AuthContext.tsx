import React, { createContext, useContext, useState, useEffect } from 'react';
import { BackendUserResponse } from '../types/api';
import { loginUser, signupUser } from '../services/api';

interface AuthContextType {
  user: BackendUserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (params: { fullName: string; phoneNumber: string; email?: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'truststay_auth_token';
const USER_KEY = 'truststay_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BackendUserResponse | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = async (identifier: string, password: string) => {
    const authData = await loginUser(identifier, password);
    setToken(authData.token);
    setUser(authData.user);
  };

  const signup = async (params: { fullName: string; phoneNumber: string; email?: string; password: string }) => {
    const authData = await signupUser(params);
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const hasRole = (role: string): boolean => {
    return Boolean(user?.roles?.includes(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        login,
        signup,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
