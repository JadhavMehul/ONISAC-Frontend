import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Crucial for HTTP-only cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Backend handles cookie rotation here
        await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;