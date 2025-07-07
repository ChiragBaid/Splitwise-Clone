import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatCurrency } from '../utils/format';
import userService from '../services/userService';

export default function FriendScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await userService.getFriends();
      setFriends(response.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };

  const handleAddFriend = async () => {
    if (!newFriendEmail.trim()) {
      setFormErrors({ email: 'Email is required' });
      return;
    }

    try {
      await userService.sendFriendRequest(newFriendEmail);
      setShowAddModal(false);
      setNewFriendEmail('');
      setFormErrors({});
      Alert.alert('Success', 'Friend request sent!');
      fetchFriends();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send friend request');
    }
  };

  const FriendCard = ({ friend }) => (
    <TouchableOpacity style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <View style={styles.friendAvatar}>
          <Text style={styles.friendInitials}>
            {friend.firstName?.charAt(0)}{friend.lastName?.charAt(0)}
          </Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>
            {friend.firstName} {friend.lastName}
          </Text>
          <Text style={styles.friendEmail}>{friend.email}</Text>
        </View>
        <View style={styles.friendBalance}>
          <Text style={[
            styles.balanceAmount,
            friend.balance > 0 && styles.positiveBalance,
            friend.balance < 0 && styles.negativeBalance
          ]}>
            {formatCurrency(Math.abs(friend.balance || 0))}
          </Text>
          <Text style={styles.balanceStatus}>
            {friend.balance > 0 ? 'You owe' : friend.balance < 0 ? 'You are owed' : 'Settled up'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="person-add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading friends...</Text>
          </View>
        ) : friends.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="person-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Friends Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add friends to start splitting expenses together
            </Text>
            <Button
              title="Add Friend"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <View style={styles.friendsList}>
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TouchableOpacity onPress={handleAddFriend}>
              <Text style={styles.saveButton}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Input
              label="Friend's Email"
              placeholder="Enter friend's email address"
              value={newFriendEmail}
              onChangeText={setNewFriendEmail}
              error={formErrors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.modalSubtext}>
              We'll send a friend request to this email address
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    padding: SPACING.lg,
  },
  friendCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
    marginBottom: SPACING.md,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  friendInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  friendEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  friendBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: COLORS.success,
  },
  negativeBalance: {
    color: COLORS.error,
  },
  balanceStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptyButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancelButton: {
    fontSize: 16,
    color: COLORS.primary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  modalSubtext: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
}); 