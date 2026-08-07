import api from './axiosInstance';
import type { ApiResponse, User } from '../types';

export const loginApi = async (email: string, password: string): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/auth/login', { email, password });
  return response.data.data;
};

export const registerApi = async (email: string, password: string): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/auth/register', { email, password });
  return response.data.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.post<ApiResponse<null>>('/auth/logout');
};

export const getMeApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};
