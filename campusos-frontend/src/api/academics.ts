import { apiClient } from './client';
import { Department, Course, Classroom, TimetableSlot } from '../types';

export const academicsApi = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>('/academics/departments');
    return response.data;
  },

  getCourses: async (params?: { page?: number; size?: number; search?: string; departmentId?: number }): Promise<{ content: Course[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/academics/courses', { params });
    // In Spring Data JPA, paginated response has content, totalElements, etc.
    if (Array.isArray(response.data)) {
      return { content: response.data, totalElements: response.data.length, totalPages: 1 };
    }
    return response.data;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const response = await apiClient.post<Course>('/academics/courses', courseData);
    return response.data;
  },

  getClassrooms: async (): Promise<Classroom[]> => {
    const response = await apiClient.get<Classroom[]>('/academics/classrooms');
    return response.data;
  },

  getSectionTimetable: async (sectionId: number): Promise<TimetableSlot[]> => {
    const response = await apiClient.get<TimetableSlot[]>(`/academics/timetable/section/${sectionId}`);
    return response.data;
  },

  createTimetableSlot: async (slotData: {
    sectionId: number;
    courseId: number;
    facultyId: number;
    classroomId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }): Promise<TimetableSlot> => {
    const response = await apiClient.post<TimetableSlot>('/academics/timetable/slots', slotData);
    return response.data;
  },
};
