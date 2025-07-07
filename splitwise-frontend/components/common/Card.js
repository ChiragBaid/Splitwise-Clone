import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

const Card = ({ 
  children, 
  style, 
  onPress, 
  disabled = false,
  variant = 'default', // default, elevated, outlined
  padding = 'medium' // none, small, medium, large
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[variant], styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]];
    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: 8,
    ...SHADOWS.medium,
  },
  
  // Variants
  default: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 20,
  },
});

export default Card; 