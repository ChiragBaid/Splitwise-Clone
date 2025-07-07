import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ExpenseContext } from '../context/ExpenseContext';
import { GroupContext } from '../context/GroupContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const AddExpenseScreen = ({ navigation, route }) => {
  const { createExpense, loading } = useContext(ExpenseContext);
  const { groups } = useContext(GroupContext);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    groupId: route.params?.groupId || '',
    paidBy: '',
    splitType: 'equal', // equal, percentage, custom
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.groupId) {
      newErrors.groupId = 'Please select a group';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const result = await createExpense(expenseData);
      if (result.success) {
        Alert.alert('Success', 'Expense added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Expense</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Expense Form */}
          <Card style={styles.formCard}>
            <Input
              label="Description"
              placeholder="What was this expense for?"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              error={errors.description}
              leftIcon="receipt-outline"
              style={styles.input}
            />

            <Input
              label="Amount"
              placeholder="0.00"
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              error={errors.amount}
              keyboardType="decimal-pad"
              leftIcon="cash-outline"
              style={styles.input}
            />

            <View style={styles.input}>
              <Text style={styles.label}>Group</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  // Navigate to group selection
                  navigation.navigate('SelectGroup', {
                    onSelect: (groupId) => handleInputChange('groupId', groupId)
                  });
                }}
              >
                <View style={styles.pickerContent}>
                  <Ionicons name="people-outline" size={20} color="#8E8E93" />
                  <Text style={styles.pickerText}>
                    {formData.groupId 
                      ? groups.find(g => g.id === formData.groupId)?.name || 'Select Group'
                      : 'Select Group'
                    }
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
              </TouchableOpacity>
              {errors.groupId && <Text style={styles.errorText}>{errors.groupId}</Text>}
            </View>

            <Input
              label="Date"
              placeholder="Select date"
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
              leftIcon="calendar-outline"
              style={styles.input}
            />

            <View style={styles.input}>
              <Text style={styles.label}>Split Type</Text>
              <View style={styles.splitTypeContainer}>
                {['equal', 'percentage', 'custom'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.splitTypeButton,
                      formData.splitType === type && styles.splitTypeButtonActive
                    ]}
                    onPress={() => handleInputChange('splitType', type)}
                  >
                    <Text style={[
                      styles.splitTypeText,
                      formData.splitType === type && styles.splitTypeTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          {/* Summary Card */}
          {formData.amount && !isNaN(parseFloat(formData.amount)) && (
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Expense Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(parseFloat(formData.amount))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Split Type:</Text>
                <Text style={styles.summaryValue}>
                  {formData.splitType.charAt(0).toUpperCase() + formData.splitType.slice(1)}
                </Text>
              </View>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            title="Add Expense"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  formCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  splitTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  splitTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  splitTypeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  splitTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  splitTypeTextActive: {
    color: '#007AFF',
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  submitButton: {
    marginBottom: 24,
  },
});

export default AddExpenseScreen; 