import api from './axiosInstance';
import type { ApiResponse, User } from '../types';
import { API_ROUTES } from '../constants/routes.constants'; 


export const loginApi = async (email: string, password: string): Promise<User> => {
  const response = await api.post<ApiResponse<User>>(API_ROUTES.AUTH.LOGIN, { email, password });
  return response.data.data;
};

export const registerApi = async (email: string, password: string): Promise<User> => {
  const response = await api.post<ApiResponse<User>>(API_ROUTES.AUTH.REGISTER, { email, password });
  return response.data.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.post<ApiResponse<null>>(API_ROUTES.AUTH.LOGOUT);
};

export const getMeApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(API_ROUTES.AUTH.ME);
  return response.data.data;
};
