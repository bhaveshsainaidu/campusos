import { apiClient } from './client';
import { AdminDashboardKPI, FacultyDashboardData, StudentDashboardData } from '../types';

export const dashboardApi = {
  getAdminDashboard: async (): Promise<AdminDashboardKPI> => {
    const response = await apiClient.get<AdminDashboardKPI>('/dashboard/admin');
    return response.data;
  },

  getFacultyDashboard: async (): Promise<FacultyDashboardData> => {
    const response = await apiClient.get<FacultyDashboardData>('/dashboard/faculty');
    return response.data;
  },

  getStudentDashboard: async (): Promise<StudentDashboardData> => {
    const response = await apiClient.get<StudentDashboardData>('/dashboard/student');
    return response.data;
  },
};
