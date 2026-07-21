import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '../types';
import { loginRequest, logoutRequest } from '../api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser());

  async function login(email: string, password: string): Promise<void> {
    const response = await loginRequest(email, password);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest();
    } finally {
      // Clear local state regardless of whether the network call succeeded,
      // since the whole point is that the user ends up logged out.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
