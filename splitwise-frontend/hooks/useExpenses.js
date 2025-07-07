import { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const useExpenses = () => useContext(ExpenseContext);

export default useExpenses; 