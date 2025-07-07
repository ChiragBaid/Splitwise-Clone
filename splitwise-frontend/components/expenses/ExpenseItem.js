import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpenseItem = ({ expense }) => {
  if (!expense) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.description}>{expense.description}</Text>
      <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
      <Text style={styles.date}>{new Date(expense.date).toLocaleDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  description: {
    flex: 2,
    fontSize: 16,
  },
  amount: {
    flex: 1,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'right',
  },
  date: {
    flex: 1,
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
});

export default ExpenseItem; 