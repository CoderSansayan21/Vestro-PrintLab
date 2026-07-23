import { request } from './apiClient.js';

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

export const getCurrentUser = () =>
  request({
    method: 'GET',
    url: '/auth/me',
  });
