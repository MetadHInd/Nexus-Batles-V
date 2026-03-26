import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Cliente principal — backend Node.js :3001
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Cliente para chatbot/Python (Fetch :8000)
export const chatbotFetch = (path: string, options?: RequestInit) => {
  const base = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:8000';
  return fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || 'Error en la petición';
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
};
