import { create } from 'zustand';
import {
  forgotPassword as requestPasswordReset,
  getCurrentUser,
  loginUser,
  registerUser,
  resetPassword as submitPasswordReset,
} from '../services/authService.js';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearStoredAuth,
} from '../services/apiClient.js';

const getErrorMessage = (error) => error?.message || 'Authentication request failed.';

const readStoredValue = (key) => localStorage.getItem(key) || sessionStorage.getItem(key) || '';

const readStoredUser = () => {
  const storedUser = readStoredValue(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const extractToken = (response) =>
  response?.token || response?.accessToken || response?.access_token || response?.data?.token || response?.data?.accessToken || response?.data?.access_token || '';

const extractUser = (response) => response?.user || response?.data?.user || response?.data || response || null;

const createLoginPayload = (payload) => {
  const { remember, ...credentials } = payload;
  return credentials;
};

const createRegistrationPayload = (payload) => {
  const { confirmPassword, terms, agree, remember, fullName, nic, role, ...registrationPayload } = payload;

  return {
    ...registrationPayload,
    full_name: fullName,
    nic_number: nic,
    role: role || 'customer',
  };
};

const setStoredAuth = ({ token, user, remember }) => {
  clearStoredAuth();

  if (!token) {
    return;
  }

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);

  if (user) {
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

const initialToken = readStoredValue(AUTH_TOKEN_KEY);
const initialUser = readStoredUser();

const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  loading: false,
  error: '',
  isAuthenticated: Boolean(initialToken),

  login: async (credentials) => {
    set({ loading: true, error: '' });

    try {
      const response = await loginUser(createLoginPayload(credentials));
      const token = extractToken(response);
      const user = extractUser(response);
      const remember = credentials.remember !== false;

      setStoredAuth({ token, user, remember });
      set({
        user,
        token,
        loading: false,
        error: '',
        isAuthenticated: Boolean(token),
      });

      return response;
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error), isAuthenticated: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: '' });

    try {
      const response = await registerUser(createRegistrationPayload(userData));

      set({
        user: null,
        token: '',
        loading: false,
        error: '',
        isAuthenticated: false,
      });

      return response;
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: '' });

    try {
      const response = await requestPasswordReset(email);
      set({ loading: false, error: '' });
      return response;
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  resetPassword: async (resetData) => {
    set({ loading: true, error: '' });

    try {
      const response = await submitPasswordReset(resetData);
      set({ loading: false, error: '' });
      return response;
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  logout: () => {
    clearStoredAuth();
    set({ user: null, token: '', loading: false, error: '', isAuthenticated: false });
  },

  clearError: () => set({ error: '' }),

  initializeAuth: async () => {
    const token = get().token || readStoredValue(AUTH_TOKEN_KEY);

    if (!token) {
      clearStoredAuth();
      set({ user: null, token: '', loading: false, error: '', isAuthenticated: false });
      return null;
    }

    set({ token, loading: true, error: '', isAuthenticated: true });

    try {
      const response = await getCurrentUser();
      const user = extractUser(response);
      const remember = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

      setStoredAuth({ token, user, remember });
      set({ user, loading: false, error: '', isAuthenticated: true });
      return user;
    } catch (error) {
      clearStoredAuth();
      set({
        user: null,
        token: '',
        loading: false,
        error: getErrorMessage(error),
        isAuthenticated: false,
      });
      return null;
    }
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('vestro:auth:unauthorized', () => {
    useAuthStore.setState({
      user: null,
      token: '',
      loading: false,
      error: 'Your session has expired. Please sign in again.',
      isAuthenticated: false,
    });
  });
}

export default useAuthStore;
