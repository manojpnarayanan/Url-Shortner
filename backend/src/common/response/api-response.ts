export class ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  timestamp: string;

  constructor(success: boolean, message: string, data: T | null, statusCode: number) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(data: T, message: string, statusCode = 200): ApiResponse<T> {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message: string, statusCode = 400): ApiResponse<null> {
    return new ApiResponse(false, message, null, statusCode);
  }
}
