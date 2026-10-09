import { apiClient } from './client';
import { AttendanceSession, StudentAttendanceSummary, ShortageStudent } from '../types';

export const attendanceApi = {
  createAttendanceSession: async (data: {
    courseId: number;
    facultyId?: number;
    classDate: string;
    sessionType: 'LECTURE' | 'LAB' | 'TUTORIAL';
    records: { studentId: number; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; remarks?: string }[];
  }): Promise<AttendanceSession> => {
    const response = await apiClient.post<AttendanceSession>('/attendance/sessions', data);
    return response.data;
  },

  getMyAttendance: async (): Promise<StudentAttendanceSummary> => {
    const response = await apiClient.get<StudentAttendanceSummary>('/attendance/me');
    return response.data;
  },

  getShortageStudents: async (threshold: number = 75.0): Promise<ShortageStudent[]> => {
    const response = await apiClient.get<ShortageStudent[]>('/attendance/shortage', {
      params: { threshold },
    });
    return response.data;
  },

  getAttendanceSessions: async (params?: { courseId?: number; date?: string }): Promise<AttendanceSession[]> => {
    const response = await apiClient.get<AttendanceSession[]>('/attendance/sessions', { params });
    return response.data;
  },
};
