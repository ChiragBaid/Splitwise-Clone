import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { GroupContext } from '../context/GroupContext';
import { ExpenseContext } from '../context/ExpenseContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { groups, loading: groupsLoading } = useContext(GroupContext);
  const { expenses, settlements, getExpenseSummary, getBalances, loading: expensesLoading } = useContext(ExpenseContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryResult, balancesResult] = await Promise.all([
        getExpenseSummary(),
        getBalances(),
      ]);
      
      if (summaryResult.success) {
        setSummary(summaryResult.summary);
      }
      
      if (balancesResult.success) {
        setBalances(balancesResult.balances);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceColor = (amount) => {
    if (amount > 0) return '#34C759';
    if (amount < 0) return '#FF3B30';
    return '#8E8E93';
  };

  if (groupsLoading || expensesLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.subtitle}>Here's your expense summary</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Add Expense"
            onPress={() => navigation.navigate('AddExpense')}
            style={styles.actionButton}
          />
          <Button
            title="Create Group"
            onPress={() => navigation.navigate('CreateGroup')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        {/* Summary Cards */}
        {summary && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryCards}>
              <Card style={styles.summaryCard}>
                <View style={styles.summaryCardContent}>
                  <Ionicons name="trending-up" size={24} color="#34C759" />
                  <Text style={styles.summaryLabel}>You owe</Text>
                  <Text style={[styles.summaryAmount, { color: '#FF3B30' }]}>
                    {formatCurrency(summary.youOwe || 0)}
                  </Text>
                </View>
              </Card>

              <Card style={styles.summaryCard}>
                <View style={styles.summaryCardContent}>
                  <Ionicons name="trending-down" size={24} color="#FF3B30" />
                  <Text style={styles.summaryLabel}>You are owed</Text>
                  <Text style={[styles.summaryAmount, { color: '#34C759' }]}>
                    {formatCurrency(summary.youAreOwed || 0)}
                  </Text>
                </View>
              </Card>
            </View>
          </View>
        )}

        {/* Recent Balances */}
        {balances.length > 0 && (
          <View style={styles.balancesSection}>
            <Text style={styles.sectionTitle}>Recent Balances</Text>
            <Card>
              {balances.slice(0, 5).map((balance, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.balanceItem}
                  onPress={() => navigation.navigate('SettleUp', { balance })}
                >
                  <View style={styles.balanceLeft}>
                    <Text style={styles.balanceName}>{balance.name}</Text>
                    <Text style={styles.balanceGroup}>{balance.groupName}</Text>
                  </View>
                  <View style={styles.balanceRight}>
                    <Text style={[styles.balanceAmount, { color: getBalanceColor(balance.amount) }]}>
                      {formatCurrency(balance.amount)}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        )}

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <View style={styles.expensesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <Card>
              {expenses.slice(0, 3).map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseLeft}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseDate}>
                      {new Date(expense.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.expenseRight}>
                    <Text style={styles.expenseAmount}>
                      {formatCurrency(expense.amount)}
                    </Text>
                    <Text style={styles.expensePaidBy}>Paid by {expense.paidBy}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Groups */}
        {groups.length > 0 && (
          <View style={styles.groupsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Groups</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {groups.slice(0, 5).map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => navigation.navigate('GroupDetails', { group })}
                >
                  <View style={styles.groupCardContent}>
                    <Ionicons name="people" size={24} color="#007AFF" />
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupMembers}>
                      {group.members?.length || 0} members
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {groups.length === 0 && expenses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyStateTitle}>Welcome to Splitwise!</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start by creating a group or adding your first expense
            </Text>
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('CreateGroup')}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  summaryCards: {
    flexDirection: 'row',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balancesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  balanceLeft: {
    flex: 1,
  },
  balanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  balanceGroup: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  balanceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  expensesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  expenseLeft: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  expenseDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  expensePaidBy: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  groupsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  groupCard: {
    width: 120,
    marginRight: 12,
  },
  groupCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  groupMembers: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 120,
  },
});

export default DashboardScreen; 