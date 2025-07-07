import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import GroupNavigator from './GroupNavigator';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function AppNavigator() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <GroupNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
} 