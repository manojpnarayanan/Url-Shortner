export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UrlItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface CreateUrlPayload {
  originalUrl: string;
  customAlias?: string;
}
