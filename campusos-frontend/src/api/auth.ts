import { apiClient } from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string; token?: string }> => {
    const response = await apiClient.post('/auth/password-reset/request', { email });
    return response.data;
  },

  confirmPasswordReset: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
    return response.data;
  },
};
