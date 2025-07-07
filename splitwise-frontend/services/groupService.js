import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const groupService = {
  // Get all groups for current user
  async getGroups() {
    try {
      const response = await api.get('/groups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch groups');
    }
  },

  // Get single group by ID
  async getGroup(groupId) {
    try {
      const response = await api.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group');
    }
  },

  // Create new group
  async createGroup(groupData) {
    try {
      const response = await api.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create group');
    }
  },

  // Update group
  async updateGroup(groupId, groupData) {
    try {
      const response = await api.put(`/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update group');
    }
  },

  // Delete group
  async deleteGroup(groupId) {
    try {
      await api.delete(`/groups/${groupId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  },

  // Get group members
  async getGroupMembers(groupId) {
    try {
      const url = ENDPOINTS.GROUP_MEMBERS.replace(':id', groupId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add member to group
  async addGroupMember(groupId, memberData) {
    try {
      const url = ENDPOINTS.ADD_GROUP_MEMBER.replace(':id', groupId);
      const response = await api.post(url, memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove member from group
  async removeGroupMember(groupId, memberId) {
    try {
      const response = await api.delete(`/groups/${groupId}/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove member');
    }
  },

  // Update member role in group
  async updateMemberRole(groupId, memberId, role) {
    try {
      const response = await api.patch(`/groups/${groupId}/members/${memberId}`, {
        role,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Leave group
  async leaveGroup(groupId) {
    try {
      const response = await api.post(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get group expenses
  async getGroupExpenses(groupId, filters = {}) {
    try {
      const url = ENDPOINTS.GROUP_EXPENSES.replace(':id', groupId);
      const response = await api.get(url, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get group balance summary
  async getGroupBalance(groupId) {
    try {
      const response = await api.get(`/groups/${groupId}/balance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get group statistics
  async getGroupStats(groupId) {
    try {
      const response = await api.get(`/groups/${groupId}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search groups
  async searchGroups(query) {
    try {
      const response = await api.get(`/groups/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search groups');
    }
  },

  // Get group activity feed
  async getGroupActivity(groupId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/groups/${groupId}/activity`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Invite user to group via email
  async inviteToGroup(groupId, email) {
    try {
      const response = await api.post(`/groups/${groupId}/invite`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accept group invitation
  async acceptInvitation(invitationToken) {
    try {
      const response = await api.post('/groups/invitations/accept', {
        token: invitationToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Decline group invitation
  async declineInvitation(invitationToken) {
    try {
      const response = await api.post('/groups/invitations/decline', {
        token: invitationToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending invitations
  async getPendingInvitations() {
    try {
      const response = await api.get('/groups/invitations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Archive group
  async archiveGroup(groupId) {
    try {
      const response = await api.post(`/groups/${groupId}/archive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unarchive group
  async unarchiveGroup(groupId) {
    try {
      const response = await api.post(`/groups/${groupId}/unarchive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get friends
  async getFriends() {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch friends');
    }
  },

  // Add friend
  async addFriend(friendData) {
    try {
      const response = await api.post('/friends', friendData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add friend');
    }
  },

  // Remove friend
  async removeFriend(friendId) {
    try {
      await api.delete(`/friends/${friendId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove friend');
    }
  },

  // Search users
  async searchUsers(query) {
    try {
      const response = await api.get(`/users/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },
};

export default groupService; 