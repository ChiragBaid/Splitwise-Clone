// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';
export const STORAGE_KEY = 'splitwise_auth_token';

// Colors
export const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  secondary: '#FF9800',
  accent: '#FF5722',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  border: '#E0E0E0',
  divider: '#BDBDBD',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Shadow
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Groups
  GROUPS: '/groups',
  GROUP_MEMBERS: '/groups/:id/members',
  ADD_GROUP_MEMBER: '/groups/:id/members',
  
  // Expenses
  EXPENSES: '/expenses',
  GROUP_EXPENSES: '/groups/:id/expenses',
  EXPENSE_DETAILS: '/expenses/:id',
  
  // Splits
  SPLITS: '/splits',
  EXPENSE_SPLITS: '/expenses/:id/splits',
};

// Navigation Routes
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  
  // Main
  DASHBOARD: 'Dashboard',
  GROUPS: 'Groups',
  FRIENDS: 'Friends',
  EXPENSES: 'Expenses',
  SETTLE_UP: 'SettleUp',
  
  // Groups
  GROUP_DETAILS: 'GroupDetails',
  ADD_GROUP: 'AddGroup',
  
  // Expenses
  ADD_EXPENSE: 'AddExpense',
  EXPENSE_DETAILS: 'ExpenseDetails',
  
  // Friends
  ADD_FRIEND: 'AddFriend',
  FRIEND_DETAILS: 'FriendDetails',
};

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'utilities', name: 'Utilities', icon: '⚡' },
  { id: 'rent', name: 'Rent', icon: '🏠' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'other', name: 'Other', icon: '📦' },
];

// Split Types
export const SPLIT_TYPES = {
  EQUAL: 'equal',
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  SHARES: 'shares',
};

// Currency
export const CURRENCY = {
  USD: { symbol: '$', code: 'USD' },
  EUR: { symbol: '€', code: 'EUR' },
  GBP: { symbol: '£', code: 'GBP' },
  INR: { symbol: '₹', code: 'INR' },
}; 