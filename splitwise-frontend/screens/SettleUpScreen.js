import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/format';
import expenseService from '../services/expenseService';

export default function SettleUpScreen({ navigation }) {
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSettleUpData();
  }, []);

  const fetchSettleUpData = async () => {
    setLoading(true);
    try {
      // Fetch user balances
      const balanceData = await expenseService.getUserBalances();
      setBalances(balanceData.balances || []);

      // Fetch settlements
      const settlementData = await expenseService.getUserSettlements();
      setSettlements(settlementData.settlements || []);
    } catch (error) {
      console.error('Error fetching settle up data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSettleUpData();
    setRefreshing(false);
  };

  const handleSettleUp = (userId, amount) => {
    Alert.alert(
      'Settle Up',
      `Mark $${Math.abs(amount)} as settled with this person?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Settle Up', 
          onPress: async () => {
            try {
              await expenseService.settleUpWithUser(userId, amount);
              Alert.alert('Success', 'Settlement recorded!');
              fetchSettleUpData();
            } catch (error) {
              Alert.alert('Error', 'Failed to record settlement');
            }
          }
        },
      ]
    );
  };

  const BalanceCard = ({ balance }) => (
    <Card style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>
            {balance.user?.firstName?.charAt(0)}{balance.user?.lastName?.charAt(0)}
          </Text>
        </View>
        <View style={styles.balanceInfo}>
          <Text style={styles.userName}>
            {balance.user?.firstName} {balance.user?.lastName}
          </Text>
          <Text style={styles.balanceStatus}>
            {balance.amount > 0 ? 'You owe' : balance.amount < 0 ? 'You are owed' : 'Settled up'}
          </Text>
        </View>
        <View style={styles.balanceAmount}>
          <Text style={[
            styles.amount,
            balance.amount > 0 && styles.positiveAmount,
            balance.amount < 0 && styles.negativeAmount
          ]}>
            {formatCurrency(Math.abs(balance.amount))}
          </Text>
        </View>
      </View>
      
      {balance.amount !== 0 && (
        <Button
          title={balance.amount > 0 ? 'Settle Up' : 'Record Payment'}
          onPress={() => handleSettleUp(balance.userId, balance.amount)}
          variant={balance.amount > 0 ? 'primary' : 'secondary'}
          style={styles.settleButton}
        />
      )}
    </Card>
  );

  const SettlementCard = ({ settlement }) => (
    <Card style={styles.settlementCard}>
      <View style={styles.settlementHeader}>
        <View style={styles.settlementIcon}>
          <Ionicons 
            name={settlement.type === 'paid' ? 'checkmark-circle' : 'arrow-forward'} 
            size={24} 
            color={settlement.type === 'paid' ? COLORS.success : COLORS.primary} 
          />
        </View>
        <View style={styles.settlementInfo}>
          <Text style={styles.settlementTitle}>
            {settlement.type === 'paid' ? 'Paid' : 'Received'} {formatCurrency(settlement.amount)}
          </Text>
          <Text style={styles.settlementSubtitle}>
            {settlement.user?.firstName} {settlement.user?.lastName} • {settlement.date}
          </Text>
        </View>
      </View>
    </Card>
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
          <Text style={styles.title}>Settle Up</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading balances...</Text>
          </View>
        ) : (
          <>
            {/* Balances Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Balances</Text>
              {balances.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={styles.emptyTitle}>All Settled Up!</Text>
                  <Text style={styles.emptySubtitle}>
                    You don't owe anyone and no one owes you
                  </Text>
                </Card>
              ) : (
                <View style={styles.balancesList}>
                  {balances.map((balance) => (
                    <BalanceCard key={balance.userId} balance={balance} />
                  ))}
                </View>
              )}
            </View>

            {/* Recent Settlements */}
            {settlements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Settlements</Text>
                <View style={styles.settlementsList}>
                  {settlements.slice(0, 5).map((settlement) => (
                    <SettlementCard key={settlement.id} settlement={settlement} />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  balancesList: {
    paddingHorizontal: SPACING.lg,
  },
  balanceCard: {
    marginBottom: SPACING.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  balanceStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  positiveAmount: {
    color: COLORS.error,
  },
  negativeAmount: {
    color: COLORS.success,
  },
  settleButton: {
    marginTop: SPACING.sm,
  },
  settlementsList: {
    paddingHorizontal: SPACING.lg,
  },
  settlementCard: {
    marginBottom: SPACING.sm,
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settlementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settlementInfo: {
    flex: 1,
  },
  settlementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  settlementSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
}); 