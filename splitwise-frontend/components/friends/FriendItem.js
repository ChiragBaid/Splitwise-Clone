import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FriendItem = ({ friend }) => {
  if (!friend) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{friend.name}</Text>
      <Text style={styles.email}>{friend.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    color: '#888',
    fontSize: 14,
  },
});

export default FriendItem; 