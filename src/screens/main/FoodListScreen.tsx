import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  SafeAreaView, 
  useWindowDimensions 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { SearchBar } from '../../components/SearchBar';
import { CategoryChip } from '../../components/CategoryChip';
import { FoodCard } from '../../components/FoodCard';
import { EmptyState } from '../../components/EmptyState';
import { CustomButton } from '../../components/CustomButton';
import { getRecipes, searchRecipes, getRecipesByMealType, Recipe } from '../../services/api';
import { toggleFavourite, isFavourite } from '../../services/storage';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';

type FoodListScreenRouteProp = RouteProp<HomeStackParamList, 'FoodList'>;
type FoodListScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'FoodList'>;

interface Props {
  route: FoodListScreenRouteProp;
  navigation: FoodListScreenNavigationProp;
}

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const FoodListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const initialCategory = route.params?.category || 'All';
  const initialQuery = route.params?.query || '';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [favouritesMap, setFavouritesMap] = useState<Record<number, boolean>>({});

  // Debouncing Search Ref
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync route params changes
  useEffect(() => {
    if (route.params?.category) {
      setActiveCategory(route.params.category);
    }
    if (route.params?.query) {
      setSearchQuery(route.params.query);
    }
  }, [route.params]);

  // Load recipes based on category & search query
  const loadRecipes = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      let data: Recipe[] = [];
      
      if (searchQuery.trim().length > 0) {
        // Search takes priority
        data = await searchRecipes(searchQuery.trim());
      } else if (activeCategory !== 'All') {
        // Filter by meal type
        data = await getRecipesByMealType(activeCategory);
      } else {
        // Get all
        data = await getRecipes();
      }

      setRecipes(data);

      // Fetch favourites status mapping
      const favMap: Record<number, boolean> = {};
      for (const recipe of data) {
        favMap[recipe.id] = await isFavourite(recipe.id);
      }
      setFavouritesMap(favMap);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, searchQuery]);

  // Debounced search logic (400ms)
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear category selection when searching
    if (text.trim().length > 0 && activeCategory !== 'All') {
      setActiveCategory('All');
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      loadRecipes();
    }, 400);
  };

  useEffect(() => {
    loadRecipes();
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [activeCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadRecipes(true);
  };

  const handleCategoryPress = (category: string) => {
    setSearchQuery(''); // Clear search when category changes
    setActiveCategory(category);
  };

  const handleFavToggle = async (recipe: Recipe) => {
    const isAdded = await toggleFavourite(recipe);
    setFavouritesMap(prev => ({
      ...prev,
      [recipe.id]: isAdded
    }));
  };

  const isTablet = width > 768;
  const numColumns = isTablet ? 3 : 2;

  // Sync favourites status every time screen comes to focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const favMap: Record<number, boolean> = {};
      for (const recipe of recipes) {
        favMap[recipe.id] = await isFavourite(recipe.id);
      }
      setFavouritesMap(favMap);
    });
    return unsubscribe;
  }, [navigation, recipes]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search foods or cuisines..."
          onClear={loadRecipes}
        />
      </View>

      {/* Categories Filter Strip */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              active={activeCategory === item}
              onPress={() => handleCategoryPress(item)}
            />
          )}
        />
      </View>

      {/* Content Render */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Looking up kitchen recipes...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton
            title="Retry Connection"
            onPress={() => loadRecipes()}
            variant="primary"
            style={styles.retryBtn}
          />
        </View>
      ) : recipes.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Recipes Found"
          subtitle={`We couldn't find any dishes matching "${searchQuery || activeCategory}". Try searching something else.`}
          ctaLabel="Clear Filters"
          onCtaPress={() => {
            setSearchQuery('');
            setActiveCategory('All');
          }}
        />
      ) : (
        <FlatList
          key={numColumns} // Force re-render when changing layout columns
          data={recipes}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              onPress={() => navigation.navigate('FoodDetail', { recipeId: item.id })}
              onFavouriteToggle={() => handleFavToggle(item)}
              isFav={!!favouritesMap[item.id]}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    paddingBottom: 2,
  },
  categoriesWrapper: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  categoriesScroll: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingBottom: 4,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  retryBtn: {
    width: 160,
  },
});
