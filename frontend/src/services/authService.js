import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN_KEY = 'authToken';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || '';

const normalizeBackendError = (error) => {
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

const request = async (config) => {
  try {
    const response = await authClient(config);
    return response.data;
  } catch (error) {
    throw normalizeBackendError(error);
  }
};

export const loginUser = (credentials) =>
  request({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  });

export const registerUser = (userData) =>
  request({
    method: 'POST',
    url: '/auth/register',
    data: userData,
  });

export const forgotPassword = (email) =>
  request({
    method: 'POST',
    url: '/auth/forgot-password',
    data: { email },
  });

export const resetPassword = (resetData) =>
  request({
    method: 'POST',
    url: '/auth/reset-password',
    data: resetData,
  });

export const getCurrentUser = () => {
  const token = getAuthToken();

  return request({
    method: 'GET',
    url: '/auth/me',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};