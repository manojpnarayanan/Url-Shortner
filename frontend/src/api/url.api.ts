import api from './axiosInstance';
import type { ApiResponse, CreateUrlPayload, UrlItem } from '../types';
import { API_ROUTES } from '../constants/routes.constants';

export const createUrlApi = async (payload: CreateUrlPayload): Promise<UrlItem> => {
  const response = await api.post<ApiResponse<UrlItem>>(API_ROUTES.URLS.BASE, payload);
  return response.data.data;
};

export const getUrlsApi = async (): Promise<UrlItem[]> => {
  const response = await api.get<ApiResponse<UrlItem[]>>(API_ROUTES.URLS.BASE);
  return response.data.data;
};

export const deleteUrlApi = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(API_ROUTES.URLS.BY_ID(id));
};
