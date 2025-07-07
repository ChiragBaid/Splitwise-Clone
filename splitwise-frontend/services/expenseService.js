import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const expenseService = {
  // Get all expenses for current user
  getExpenses: async (groupId = null) => {
    try {
      const url = groupId ? `/expenses?groupId=${groupId}` : '/expenses';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
    }
  },

  // Get single expense by ID
  getExpense: async (expenseId) => {
    try {
      const response = await api.get(`/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense');
    }
  },

  // Create new expense
  createExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create expense');
    }
  },

  // Update expense
  updateExpense: async (expenseId, expenseData) => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
  },

  // Get group expenses
  getGroupExpenses: async (groupId, filters = {}) => {
    try {
      const url = ENDPOINTS.GROUP_EXPENSES.replace(':id', groupId);
      const response = await api.get(url, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expense splits
  getExpenseSplits: async (expenseId) => {
    try {
      const url = ENDPOINTS.EXPENSE_SPLITS.replace(':id', expenseId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update expense splits
  updateExpenseSplits: async (expenseId, splitsData) => {
    try {
      const url = ENDPOINTS.EXPENSE_SPLITS.replace(':id', expenseId);
      const response = await api.put(url, splitsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add split to expense
  addExpenseSplit: async (expenseId, splitData) => {
    try {
      const url = ENDPOINTS.EXPENSE_SPLITS.replace(':id', expenseId);
      const response = await api.post(url, splitData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove split from expense
  removeExpenseSplit: async (expenseId, splitId) => {
    try {
      const response = await api.delete(`${ENDPOINTS.EXPENSES}/${expenseId}/splits/${splitId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's balance summary
  getUserBalance: async () => {
    try {
      const response = await api.get('/expenses/balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get balances with specific user
  getBalanceWithUser: async (userId) => {
    try {
      const response = await api.get(`/expenses/balance/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get group balance summary
  getGroupBalance: async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}/balance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Settle up with user
  settleUpWithUser: async (userId, amount) => {
    try {
      const response = await api.post('/expenses/settle', {
        userId,
        amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Settle up in group
  settleUpInGroup: async (groupId, settlementData) => {
    try {
      const response = await api.post(`/groups/${groupId}/settle`, settlementData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expense categories
  getExpenseCategories: async () => {
    try {
      const response = await api.get('/expenses/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get expense statistics
  getExpenseStats: async (groupId = null, period = 'month') => {
    try {
      const url = groupId 
        ? `/expenses/stats?groupId=${groupId}&period=${period}`
        : `/expenses/stats?period=${period}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense stats');
    }
  },

  // Get group expense statistics
  getGroupExpenseStats: async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}/expenses/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search expenses
  searchExpenses: async (query, filters = {}) => {
    try {
      const response = await api.get('/expenses/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expense activity feed
  getExpenseActivity: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/expenses/activity', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add expense receipt
  addExpenseReceipt: async (expenseId, receiptData) => {
    try {
      const formData = new FormData();
      formData.append('receipt', receiptData);
      
      const response = await api.post(`${ENDPOINTS.EXPENSES}/${expenseId}/receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove expense receipt
  removeExpenseReceipt: async (expenseId) => {
    try {
      const response = await api.delete(`${ENDPOINTS.EXPENSES}/${expenseId}/receipt`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add expense comment
  addExpenseComment: async (expenseId, comment) => {
    try {
      const response = await api.post(`${ENDPOINTS.EXPENSES}/${expenseId}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  // Get expense comments
  getExpenseComments: async (expenseId) => {
    try {
      const response = await api.get(`${ENDPOINTS.EXPENSES}/${expenseId}/comments`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  // Delete expense comment
  deleteExpenseComment: async (expenseId, commentId) => {
    try {
      const response = await api.delete(`${ENDPOINTS.EXPENSES}/${expenseId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export expenses
  exportExpenses: async (filters = {}, format = 'csv') => {
    try {
      const response = await api.get('/expenses/export', {
        params: { ...filters, format },
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get recurring expenses
  getRecurringExpenses: async () => {
    try {
      const response = await api.get('/expenses/recurring');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create recurring expense
  createRecurringExpense: async (recurringExpenseData) => {
    try {
      const response = await api.post('/expenses/recurring', recurringExpenseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update recurring expense
  updateRecurringExpense: async (recurringExpenseId, recurringExpenseData) => {
    try {
      const response = await api.put(`/expenses/recurring/${recurringExpenseId}`, recurringExpenseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete recurring expense
  deleteRecurringExpense: async (recurringExpenseId) => {
    try {
      const response = await api.delete(`/expenses/recurring/${recurringExpenseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get settlements
  getSettlements: async () => {
    try {
      const response = await api.get('/settlements');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settlements');
    }
  },

  // Settle up
  settleUp: async (settlementData) => {
    try {
      const response = await api.post('/settlements', settlementData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to settle up');
    }
  },

  // Get expense summary
  getExpenseSummary: async (groupId = null) => {
    try {
      const url = groupId ? `/expenses/summary?groupId=${groupId}` : '/expenses/summary';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense summary');
    }
  },

  // Get balances
  getBalances: async (groupId = null) => {
    try {
      const url = groupId ? `/expenses/balances?groupId=${groupId}` : '/expenses/balances';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch balances');
    }
  },

  // Like expense
  likeExpense: async (expenseId) => {
    try {
      const response = await api.post(`/expenses/${expenseId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like expense');
    }
  },

  // Unlike expense
  unlikeExpense: async (expenseId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike expense');
    }
  },
};

export default expenseService; 