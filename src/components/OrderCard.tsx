import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../theme';

export interface Order {
  id: string;
  userId: string;
  foodName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  orderTime: any; // Firebase Timestamp or string
  status: string;
  image?: string;
  cuisine?: string;
}

interface OrderCardProps {
  order: Order;
  onDelete: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onDelete }) => {
  const formatTime = (time: any) => {
    if (!time) return 'Just now';
    
    let date: Date;
    
    if (time.seconds) {
      // Firebase Timestamp object
      date = new Date(time.seconds * 1000);
    } else if (time.toDate && typeof time.toDate === 'function') {
      // Firebase Timestamp helper
      date = time.toDate();
    } else {
      // ISO String or other format
      date = new Date(time);
    }
    
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'confirmed' || s === 'delivered') return COLORS.success;
    return COLORS.primary; // Pending or standard
  };

  // Safe fallback placeholder food image if missing
  const recipeImage = order.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Left Side: Recipe Thumbnail */}
        <Image source={{ uri: recipeImage }} style={styles.recipeThumbnail} />

        {/* Middle Side: Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.topInfo}>
            <Text numberOfLines={1} style={styles.foodName}>{order.foodName}</Text>
            {order.cuisine ? <Text style={styles.cuisineText}>{order.cuisine} Cuisine</Text> : null}
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.qtyLabel}>
              Qty: <Text style={styles.qtyValue}>{order.quantity}x</Text>
            </Text>
            <View style={styles.separatorCircle} />
            <Text style={styles.timeText}>{formatTime(order.orderTime)}</Text>
          </View>
        </View>

        {/* Right Side: Price, Status & Actions */}
        <View style={styles.rightContainer}>
          {/* Price */}
          <Text style={styles.totalPriceText}>${order.totalPrice.toFixed(2)}</Text>
          
          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status ? order.status.toUpperCase() : 'CONFIRMED'}
            </Text>
          </View>

          {/* Delete Action button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(order.id)}
            style={styles.cancelBtn}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeThumbnail: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
    paddingRight: SPACING.xs,
  },
  topInfo: {
    marginBottom: SPACING.xs,
  },
  foodName: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.dark,
  },
  cuisineText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginTop: 2,
    color: COLORS.secondary,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  qtyValue: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  separatorCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.placeholder,
    marginHorizontal: 8,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    minWidth: 80,
  },
  totalPriceText: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: COLORS.error + '10',
  },
  cancelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.error,
    marginLeft: 2,
  },
});
