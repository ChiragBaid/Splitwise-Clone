import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';

const storage = {
  async setItem(value) {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(TOKEN_KEY, value);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, value);
    }
  },

  async getItem() {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(TOKEN_KEY);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  },

  async removeItem() {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },
};

export default storage; 