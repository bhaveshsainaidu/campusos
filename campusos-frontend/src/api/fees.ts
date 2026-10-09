import { apiClient } from './client';
import { FeeStructure, StudentFee, RazorpayOrder } from '../types';

export const feesApi = {
  getFeeStructures: async (): Promise<FeeStructure[]> => {
    const response = await apiClient.get<FeeStructure[]>('/fees/structures');
    return response.data;
  },

  createFeeStructure: async (data: Partial<FeeStructure>): Promise<FeeStructure> => {
    const response = await apiClient.post<FeeStructure>('/fees/structures', data);
    return response.data;
  },

  assignFeeStructure: async (data: {
    feeStructureId: number;
    departmentId?: number;
    semester?: number;
  }): Promise<{ message: string; assignedCount: number }> => {
    const response = await apiClient.post('/fees/assign', data);
    return response.data;
  },

  getMyFees: async (): Promise<StudentFee[]> => {
    const response = await apiClient.get<StudentFee[]>('/fees/my');
    return response.data;
  },

  createPaymentOrder: async (studentFeeId: number): Promise<RazorpayOrder> => {
    const response = await apiClient.post<RazorpayOrder>('/fees/orders', { studentFeeId });
    return response.data;
  },

  verifyPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ success: boolean; message: string; receiptUrl?: string }> => {
    const response = await apiClient.post('/fees/verify', data);
    return response.data;
  },
};
