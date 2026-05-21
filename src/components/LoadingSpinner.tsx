import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  message: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
    color: COLORS.secondary,
    fontWeight: '500',
  },
});
