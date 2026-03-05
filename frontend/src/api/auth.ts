import { apiClient } from './client';

// Tipos que coinciden con TU backend
export interface RegisterData {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  apodo: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    apodo: string;
    avatar: string | null;
    rol: 'PLAYER' | 'ADMIN' | 'MODERATOR';
    emailVerified: boolean;
    createdAt: string;
  };
  token: string; // accessToken
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    apodo: string;
    rol: 'PLAYER' | 'ADMIN' | 'MODERATOR';
  };
  accessToken: string;
}

export const authApi = {
  // POST /api/v1/auth/register
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    
    // Guardar token
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
    }
    
    return response.data;
  },

  // POST /api/v1/auth/login
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Guardar token
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  },

  // Logout (limpiar tokens locales)
  logout: (): void => {
    localStorage.removeItem('accessToken');
    // refreshToken está en cookie httpOnly, el backend lo maneja
  },
};