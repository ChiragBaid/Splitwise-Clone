import React from 'react';
import { FlatList } from 'react-native';
import GroupItem from './GroupItem';

const GroupList = ({ groups }) => {
  return (
    <FlatList
      data={groups}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <GroupItem group={item} />}
    />
  );
};

export default GroupList; 