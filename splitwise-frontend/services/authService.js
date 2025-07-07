import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  async signup(name, email, password) {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint if available
      try {
        await api.post(ENDPOINTS.LOGOUT);
      } catch (error) {
        // If logout endpoint fails, continue with local cleanup
        console.warn('Logout endpoint failed, continuing with local cleanup');
      }

      // Remove token from storage
      await tokenService.removeToken();

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', {
        token,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      return await tokenService.isAuthenticated();
    } catch (error) {
      return false;
    }
  },

  // Get stored token
  getToken: async () => {
    try {
      return await tokenService.getToken();
    } catch (error) {
      return null;
    }
  },

  // Refresh token (if implemented)
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      
      if (response.token) {
        await tokenService.setToken(response.token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService; 