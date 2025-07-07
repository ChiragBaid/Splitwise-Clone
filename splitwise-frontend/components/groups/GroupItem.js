import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GroupItem = ({ group }) => {
  if (!group) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{group.name}</Text>
      <Text style={styles.memberCount}>{group.members.length} members</Text>
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
  memberCount: {
    color: '#888',
    fontSize: 14,
  },
});

export default GroupItem; 