import React, { createContext, useState, useEffect, useContext } from 'react';
import { expenseService } from '../services/expenseService';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      loadExpenses();
      loadSettlements();
    }
  }, [isAuthenticated]);

  const loadExpenses = async (groupId = null) => {
    try {
      setLoading(true);
      const expensesData = await expenseService.getExpenses(groupId);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettlements = async () => {
    try {
      const settlementsData = await expenseService.getSettlements();
      setSettlements(settlementsData);
    } catch (error) {
      console.error('Failed to load settlements:', error);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      setLoading(true);
      const newExpense = await expenseService.createExpense(expenseData);
      setExpenses(prev => [...prev, newExpense]);
      return { success: true, expense: newExpense };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      setLoading(true);
      const updatedExpense = await expenseService.updateExpense(expenseId, expenseData);
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId ? updatedExpense : expense
      ));
      return { success: true, expense: updatedExpense };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      setLoading(true);
      await expenseService.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      if (selectedExpense?.id === expenseId) {
        setSelectedExpense(null);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const settleUp = async (settlementData) => {
    try {
      setLoading(true);
      const newSettlement = await expenseService.settleUp(settlementData);
      setSettlements(prev => [...prev, newSettlement]);
      return { success: true, settlement: newSettlement };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getExpenseSummary = async (groupId = null) => {
    try {
      const summary = await expenseService.getExpenseSummary(groupId);
      return { success: true, summary };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getBalances = async (groupId = null) => {
    try {
      const balances = await expenseService.getBalances(groupId);
      return { success: true, balances };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        settlements,
        loading,
        selectedExpense,
        setSelectedExpense,
        loadExpenses,
        loadSettlements,
        createExpense,
        updateExpense,
        deleteExpense,
        settleUp,
        getExpenseSummary,
        getBalances,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}; 