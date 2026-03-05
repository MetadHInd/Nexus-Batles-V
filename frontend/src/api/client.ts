import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Cliente Axios configurado para TU backend
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Importante para cookies httpOnly
});

// Agregar token a cada request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar refresh token automático
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig;

    // Si es 401 y no hemos reintentado
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      
      try {
        // IMPORTANTE: El refreshToken está en cookie httpOnly
        // El backend lo lee automáticamente de la cookie
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          {}, // Body vacío porque el token está en cookie
          { withCredentials: true }
        );
        
        // Guardar nuevo access token
        if (data.accessToken) {
          sessionStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(original);
        }
      } catch (refreshError) {
        // Si falla refresh, limpiar y redirigir
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || 'Error en la petición';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};