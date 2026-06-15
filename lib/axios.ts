import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is missing.');
}

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

// This is the helper function managing your queued up network requests
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(api(promise.config));
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 🛡️ BREAK INFINITE LOOP: If we get a 401 on core auth endpoints, 
      // do not loop trying to refresh tokens. Stop immediately and show login.
      if (
        originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/me') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to request a brand new access token via HTTP-only cookie refresh
        await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });
        
        // Success! Process any original requests that were waiting
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // Fail! Reject everything waiting in line
        processQueue(refreshError as AxiosError);
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session_expired=true';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;