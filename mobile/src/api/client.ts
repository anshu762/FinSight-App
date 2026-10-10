import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth';
import { type ApiResponse, type AppError } from './types';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
const baseURL = rawBaseUrl.replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Bearer JWT
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Unwrap envelope & normalize errors
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && data.success && data.data !== undefined) {
      return data.data as never;
    }
    return response.data;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    // 1. Network / No Internet error
    if (!error.response && (error.message === 'Network Error' || !error.status)) {
      const appErr: AppError = {
        code: 'NETWORK_ERROR',
        message: 'No internet connection. Please check your network and try again.',
        isNetwork: true,
      };
      return Promise.reject(appErr);
    }

    // 2. Request Timeout (Cold starts on Neon / Render)
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      const appErr: AppError = {
        code: 'TIMEOUT',
        message: 'Server is waking up, please try again.',
        isNetwork: false,
        status: 408,
      };
      return Promise.reject(appErr);
    }

    const status = error.response?.status;
    const responseData = error.response?.data;

    // 3. Unauthorized 401: clear session
    if (status === 401) {
      await useAuthStore.getState().logout();
      const appErr: AppError = {
        code: responseData?.error?.code || 'UNAUTHORIZED',
        message: responseData?.error?.message || 'Your session has expired. Please log in again.',
        isNetwork: false,
        status: 401,
      };
      return Promise.reject(appErr);
    }

    // 4. Validation error 422
    if (status === 422) {
      const appErr: AppError = {
        code: responseData?.error?.code || 'VALIDATION_ERROR',
        message: responseData?.error?.message || 'Please check your inputs and try again.',
        fields: responseData?.error?.fields,
        isNetwork: false,
        status: 422,
      };
      return Promise.reject(appErr);
    }

    // 5. Conflict 409
    if (status === 409) {
      const appErr: AppError = {
        code: responseData?.error?.code || 'CONFLICT',
        message: responseData?.error?.message || 'Record already exists.',
        fields: responseData?.error?.fields,
        isNetwork: false,
        status: 409,
      };
      return Promise.reject(appErr);
    }

    // 6. Generic or server error (500)
    const appErr: AppError = {
      code: responseData?.error?.code || 'SERVER_ERROR',
      message: responseData?.error?.message || 'An unexpected error occurred. Please try again later.',
      isNetwork: false,
      status: status || 500,
    };
    return Promise.reject(appErr);
  }
);
