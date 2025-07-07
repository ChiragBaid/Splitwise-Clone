import { apiService } from './api';
import { ENDPOINTS } from '../utils/constants';

export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.USER_PROFILE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiService.put(ENDPOINTS.USER_PROFILE, profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUser: async (userId) => {
    try {
      const response = await apiService.get(`${ENDPOINTS.USERS}/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await apiService.get(`${ENDPOINTS.USERS}/search`, {
        params: { q: query },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's friends
  getFriends: async () => {
    try {
      const response = await apiService.get('/users/friends');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add friend
  addFriend: async (friendData) => {
    try {
      const response = await apiService.post('/users/friends', friendData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      const response = await apiService.delete(`/users/friends/${friendId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get friend requests
  getFriendRequests: async () => {
    try {
      const response = await apiService.get('/users/friend-requests');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await apiService.post(`/users/friend-requests/${requestId}/accept`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Decline friend request
  declineFriendRequest: async (requestId) => {
    try {
      const response = await apiService.post(`/users/friend-requests/${requestId}/decline`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send friend request
  sendFriendRequest: async (email) => {
    try {
      const response = await apiService.post('/users/friend-requests', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's activity
  getUserActivity: async (page = 1, limit = 20) => {
    try {
      const response = await apiService.get('/users/activity', {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's statistics
  getUserStats: async () => {
    try {
      const response = await apiService.get('/users/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiService.put('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update email
  updateEmail: async (newEmail, password) => {
    try {
      const response = await apiService.put('/users/change-email', {
        newEmail,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await apiService.delete('/users/account', {
        data: { password },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's groups
  getUserGroups: async () => {
    try {
      const response = await apiService.get('/users/groups');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's expenses
  getUserExpenses: async (filters = {}) => {
    try {
      const response = await apiService.get('/users/expenses', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's balances
  getUserBalances: async () => {
    try {
      const response = await apiService.get('/users/balances');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's settlements
  getUserSettlements: async () => {
    try {
      const response = await apiService.get('/users/settlements');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await apiService.put('/users/preferences', preferences);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await apiService.get('/users/preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', imageData);
      
      const response = await apiService.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove profile picture
  removeProfilePicture: async () => {
    try {
      const response = await apiService.delete('/users/profile-picture');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await apiService.get('/users/notifications', {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiService.put(`/users/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    try {
      const response = await apiService.put('/users/notifications/read-all');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiService.delete(`/users/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's currency preferences
  getCurrencyPreferences: async () => {
    try {
      const response = await apiService.get('/users/currency-preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update currency preferences
  updateCurrencyPreferences: async (currencyPreferences) => {
    try {
      const response = await apiService.put('/users/currency-preferences', currencyPreferences);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's timezone
  getTimezone: async () => {
    try {
      const response = await apiService.get('/users/timezone');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update timezone
  updateTimezone: async (timezone) => {
    try {
      const response = await apiService.put('/users/timezone', { timezone });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's language preferences
  getLanguagePreferences: async () => {
    try {
      const response = await apiService.get('/users/language-preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update language preferences
  updateLanguagePreferences: async (languagePreferences) => {
    try {
      const response = await apiService.put('/users/language-preferences', languagePreferences);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userService; 