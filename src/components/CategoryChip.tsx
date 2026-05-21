import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../theme';

interface CategoryChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.activeChip : styles.inactiveChip,
      ]}
    >
      <Text
        style={[
          styles.text,
          active ? styles.activeText : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 38,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  inactiveChip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  text: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.white,
  },
  inactiveText: {
    color: COLORS.secondary,
  },
});
