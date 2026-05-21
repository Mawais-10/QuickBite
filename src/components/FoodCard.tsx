import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../services/api';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../theme';

interface FoodCardProps {
  item: Recipe;
  onPress: () => void;
  onFavouriteToggle?: () => void;
  isFav?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onPress,
  onFavouriteToggle,
  isFav = false,
}) => {
  const { width } = useWindowDimensions();
  // Grid layout calculations (2 columns on mobile, 3 on tablet)
  const isTablet = width > 768;
  const numColumns = isTablet ? 3 : 2;
  const cardWidth = (width - SPACING.md * 2 - SPACING.sm * (numColumns - 1)) / numColumns;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        
        {/* Heart button on top right */}
        {onFavouriteToggle && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onFavouriteToggle}
            style={styles.favouriteButton}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? COLORS.error : COLORS.secondary}
            />
          </TouchableOpacity>
        )}

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        
        <Text style={styles.cuisine}>{item.cuisine} • {item.difficulty}</Text>
        
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.secondary} />
            <Text style={styles.metaText}>{item.prepTimeMinutes} mins</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={12} color={COLORS.primary} />
            <Text style={styles.metaText}>{item.caloriesPerServing} cal</Text>
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
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  infoContainer: {
    padding: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    marginBottom: 2,
  },
  cuisine: {
    ...TYPOGRAPHY.caption,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: COLORS.border,
    paddingTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginLeft: 3,
  },
});
