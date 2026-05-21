import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { FavouriteCard } from '../../components/FavouriteCard';
import { EmptyState } from '../../components/EmptyState';
import { getFavourites, clearFavourites, toggleFavourite, FoodItem } from '../../services/storage';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../../theme';
import { getRecipeById } from '../../services/api';

export const FavouritesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const isFocused = useIsFocused();

  const [favourites, setFavourites] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavourites = async () => {
    setLoading(true);
    try {
      const items = await getFavourites();
      setFavourites(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reload every time the screen is focused
  useEffect(() => {
    if (isFocused) {
      loadFavourites();
    }
  }, [isFocused]);

  const handleRemoveFavourite = async (item: FoodItem) => {
    try {
      // Create a mock Recipe representation to feed to toggleFavourite
      const mockRecipe: any = { id: item.id, name: item.name };
      await toggleFavourite(mockRecipe);
      
      // Update local state instantly
      setFavourites(prev => prev.filter(f => f.id !== item.id));
      
      Alert.alert('Removed', `"${item.name}" was removed from Favourites.`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favourites',
      'Are you sure you want to delete all saved recipes from your library? This cannot be undone.',
      [
        { text: 'Keep Favourites', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: async () => {
            try {
              await clearFavourites();
              setFavourites([]);
              Alert.alert('Library Cleared', 'All saved items were removed successfully.');
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleCardPress = (item: FoodItem) => {
    // Navigate nested stack HomeTab -> FoodDetail
    navigation.navigate('HomeTab' as any, {
      screen: 'FoodDetail',
      params: { recipeId: item.id }
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      {/* Top Header Controls */}
      {favourites.length > 0 && (
        <View style={styles.headerStrip}>
          <Text style={styles.countText}>{favourites.length} recipes saved</Text>
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : favourites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No Favourites Saved"
          subtitle="Keep track of recipes you love! Tap the heart icon on any food details card to save them here."
          ctaLabel="Find Good Eats"
          onCtaPress={() => navigation.navigate('HomeTab' as any)}
        />
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavouriteCard
              item={item}
              onPress={() => handleCardPress(item)}
              onRemove={() => handleRemoveFavourite(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  countText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 13,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
