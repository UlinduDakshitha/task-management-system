import { api } from './client';
import { AuthUser } from '../types';

interface LoginResponse {
  success: boolean;
  message: string;
  data: { token: string; user: AuthUser };
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout');
}
