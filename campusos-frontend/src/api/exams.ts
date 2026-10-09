import { apiClient } from './client';
import { Exam, MarkRecord, Marksheet } from '../types';

export const examsApi = {
  getExams: async (): Promise<Exam[]> => {
    const response = await apiClient.get<Exam[]>('/exams');
    return response.data;
  },

  createExam: async (examData: Partial<Exam>): Promise<Exam> => {
    const response = await apiClient.post<Exam>('/exams', examData);
    return response.data;
  },

  submitMarks: async (data: {
    examId: number;
    courseId: number;
    marks: { studentId: number; marksObtained: number; maxMarks: number }[];
  }): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post('/exams/marks', data);
    return response.data;
  },

  generateMarksheet: async (data: { studentId: number; semester: number; academicYear: string }): Promise<Marksheet> => {
    const response = await apiClient.post<Marksheet>('/exams/marksheets/generate', data);
    return response.data;
  },

  getStudentMarksheet: async (studentId: number): Promise<Marksheet> => {
    const response = await apiClient.get<Marksheet>(`/exams/marksheets/student/${studentId}`);
    return response.data;
  },

  downloadMarksheetPdf: async (studentId: number): Promise<Blob> => {
    const response = await apiClient.get(`/exams/marksheets/student/${studentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
