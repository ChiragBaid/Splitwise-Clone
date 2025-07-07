import React from 'react';
import { FlatList } from 'react-native';
import FriendItem from './FriendItem';

const FriendList = ({ friends }) => {
  return (
    <FlatList
      data={friends}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <FriendItem friend={item} />}
    />
  );
};

export default FriendList; 