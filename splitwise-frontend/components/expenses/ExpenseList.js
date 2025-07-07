import React from 'react';
import { FlatList } from 'react-native';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses }) => {
  return (
    <FlatList
      data={expenses}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <ExpenseItem expense={item} />}
    />
  );
};

export default ExpenseList; 