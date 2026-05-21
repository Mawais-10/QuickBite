import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const stylesList: ViewStyle[] = [styles.button];

    switch (variant) {
      case 'primary':
        stylesList.push(styles.primaryButton);
        break;
      case 'secondary':
        stylesList.push(styles.secondaryButton);
        break;
      case 'success':
        stylesList.push(styles.successButton);
        break;
      case 'danger':
        stylesList.push(styles.dangerButton);
        break;
      case 'outline':
        stylesList.push(styles.outlineButton);
        break;
    }

    if (disabled || loading) {
      stylesList.push(styles.disabledButton);
    }

    return stylesList;
  };

  const getTextStyle = () => {
    const textStylesList: TextStyle[] = [styles.text];

    if (variant === 'outline') {
      textStylesList.push(styles.outlineText);
    } else if (variant === 'secondary') {
      textStylesList.push(styles.secondaryText);
    }

    return textStylesList;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary : COLORS.white} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 8,
    flexDirection: 'row',
    minWidth: 44, // Touch target minimum
    ...SHADOWS.light,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  successButton: {
    backgroundColor: COLORS.success,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    ...TYPOGRAPHY.buttonText,
  },
  outlineText: {
    color: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.dark,
  },
});
