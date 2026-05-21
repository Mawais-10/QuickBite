import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '../services/storage';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../theme';

interface FavouriteCardProps {
  item: FoodItem;
  onPress: () => void;
  onRemove: () => void;
}

export const FavouriteCard: React.FC<FavouriteCardProps> = ({ item, onPress, onRemove }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          
          {/* Heart/Remove Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              // Prevent click propagation to card onPress
              e.stopPropagation();
              onRemove();
            }}
            style={styles.removeButton}
          >
            <Ionicons name="heart" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cuisine}>{item.cuisine}</Text>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.metaText}>{item.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.secondary} />
            <Text style={styles.metaText}>{item.prepTime} mins</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 100,
    ...SHADOWS.light,
  },
  image: {
    width: 100,
    height: '100%',
    backgroundColor: '#EAEAEA',
  },
  infoContainer: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    flex: 1,
    marginRight: SPACING.xs,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuisine: {
    ...TYPOGRAPHY.caption,
    marginTop: -4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 3,
    fontWeight: '500',
    color: COLORS.dark,
  },
});
