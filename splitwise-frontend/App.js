import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { ExpenseProvider } from './context/ExpenseContext';
import AppNavigator from './navigation/AppNavigator';

console.log('App.js loaded successfully');

export default function App() {
  console.log('App component rendering');
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GroupProvider>
          <ExpenseProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </ExpenseProvider>
        </GroupProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
