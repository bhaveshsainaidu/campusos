import { apiClient } from './client';
import { Notice } from '../types';

export const noticesApi = {
  getNotices: async (audience?: 'ALL' | 'STUDENT' | 'FACULTY'): Promise<Notice[]> => {
    const response = await apiClient.get<Notice[]>('/notices', {
      params: audience ? { audience } : undefined,
    });
    return response.data;
  },

  createNotice: async (data: {
    title: string;
    content: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    targetAudience: 'ALL' | 'STUDENT' | 'FACULTY';
  }): Promise<Notice> => {
    const response = await apiClient.post<Notice>('/notices', data);
    return response.data;
  },
};
