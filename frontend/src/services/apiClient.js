import axios from 'axios';

export const AUTH_TOKEN_KEY = 'authToken';
export const AUTH_USER_KEY = 'authUser';
export const LEGACY_AUTH_KEY = 'vestro-auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const getStoredAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || '';

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vestro:auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  },
);

export const normalizeBackendError = (error) => {
  if (error.response?.data) {
    const { data, status } = error.response;

    if (typeof data === 'string') {
      return new Error(data);
    }

    if (data.detail) {
      return new Error(Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail);
    }

    if (data.message) {
      return new Error(data.message);
    }

    if (data.error) {
      return new Error(data.error);
    }

    return new Error(`Request failed with status ${status}.`);
  }

  if (error.request) {
    return new Error('Unable to reach the server. Please check your connection.');
  }

  return new Error(error.message || 'Something went wrong.');
};

export const request = async (config) => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw normalizeBackendError(error);
  }
};
