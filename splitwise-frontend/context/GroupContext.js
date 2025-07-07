import React, { createContext, useState, useEffect, useContext } from 'react';
import { groupService } from '../services/groupService';
import { AuthContext } from './AuthContext';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      loadGroups();
      loadFriends();
    }
  }, [isAuthenticated]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await groupService.getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const friendsData = await groupService.getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const createGroup = async (groupData) => {
    try {
      setLoading(true);
      const newGroup = await groupService.createGroup(groupData);
      setGroups(prev => [...prev, newGroup]);
      return { success: true, group: newGroup };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (groupId, groupData) => {
    try {
      setLoading(true);
      const updatedGroup = await groupService.updateGroup(groupId, groupData);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return { success: true, group: updatedGroup };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      setLoading(true);
      await groupService.deleteGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addMemberToGroup = async (groupId, memberId) => {
    try {
      setLoading(true);
      const updatedGroup = await groupService.addMember(groupId, memberId);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return { success: true, group: updatedGroup };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromGroup = async (groupId, memberId) => {
    try {
      setLoading(true);
      const updatedGroup = await groupService.removeMember(groupId, memberId);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return { success: true, group: updatedGroup };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friendData) => {
    try {
      setLoading(true);
      const newFriend = await groupService.addFriend(friendData);
      setFriends(prev => [...prev, newFriend]);
      return { success: true, friend: newFriend };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        friends,
        loading,
        selectedGroup,
        setSelectedGroup,
        loadGroups,
        loadFriends,
        createGroup,
        updateGroup,
        deleteGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        addFriend,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}; 