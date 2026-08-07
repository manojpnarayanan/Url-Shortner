import api from './axiosInstance';
import type { ApiResponse, CreateUrlPayload, UrlItem } from '../types';

export const createUrlApi = async (payload: CreateUrlPayload): Promise<UrlItem> => {
  const response = await api.post<ApiResponse<UrlItem>>('/urls', payload);
  return response.data.data;
};

export const getUrlsApi = async (): Promise<UrlItem[]> => {
  const response = await api.get<ApiResponse<UrlItem[]>>('/urls');
  return response.data.data;
};

export const deleteUrlApi = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/urls/${id}`);
};
