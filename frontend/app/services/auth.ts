import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const authApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    username: string;
    role: string;
  };
  message?: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await authApi.post<LoginResponse>('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      const user = {
        username: response.data.data.username,
        role: response.data.data.role,
        token: response.data.data.token,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      return user;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// Add token to all requests
authApi.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
