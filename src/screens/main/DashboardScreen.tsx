import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, MainTabParamList } from '../../navigation/MainTabNavigator';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../../components/SearchBar';
import { CategoryChip } from '../../components/CategoryChip';
import { getRecipes, Recipe } from '../../services/api';
import { toggleFavourite, isFavourite } from '../../services/storage';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../../theme';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'Dashboard'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favouritesMap, setFavouritesMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data);
      
      // Feature the top 5 highest rated recipes
      const sorted = [...data].sort((a, b) => b.rating - a.rating);
      setFeaturedRecipes(sorted.slice(0, 5));
      
      // Update favourites status map
      const favMap: Record<number, boolean> = {};
      for (const recipe of data) {
        favMap[recipe.id] = await isFavourite(recipe.id);
      }
      setFavouritesMap(favMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert('Error', 'Logout failed. Please try again.');
          }
        }
      }
    ]);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('FoodList', { query: searchQuery.trim() });
      setSearchQuery('');
    }
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      navigation.navigate('FoodList');
    } else {
      navigation.navigate('FoodList', { category });
    }
  };

  const handleFavToggle = async (recipe: Recipe) => {
    const isAdded = await toggleFavourite(recipe);
    setFavouritesMap(prev => ({
      ...prev,
      [recipe.id]: isAdded
    }));
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const parts = user.email.split('@');
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return 'Foodie';
  };

  if (loading) {
    return <LoadingSpinner message="Fetching delicious items..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      {/* Custom Header Bar */}
      <View style={styles.header}>
        <Text style={styles.appTitleText}>QuickBite 🍔</Text>
        <View style={styles.headerIconsRow}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate('FoodList')} 
            style={styles.headerIconBtn}
          >
            <Ionicons name="search" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => (navigation as any).navigate('ProfileTab')} 
            style={styles.headerIconBtn}
          >
            <Ionicons name="person" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={styles.headerLogoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting Banner */}
      <View style={styles.greetingBanner}>
        <Text style={styles.greetingText}>Hello, {getUserName()}! 👋</Text>
        <Text style={styles.taglineText}>What would you like to eat today?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Premium search bar with submit trigger */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search recipes (e.g. Pizza, Pasta)..."
          />
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchGoBtn}>
              <Text style={styles.searchGoText}>GO</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sliding category filters */}
        <View style={styles.categoriesWrapper}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => handleCategoryPress(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Sliding horizontal Featured Meals */}
        {featuredRecipes.length > 0 && (
          <View style={styles.featuredWrapper}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top Rated Dishes 🌟</Text>
            </View>
            <FlatList
              horizontal
              data={featuredRecipes}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('FoodDetail', { recipeId: item.id })}
                  style={styles.featuredCard}
                >
                  <Image source={{ uri: item.image }} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <View style={styles.featuredRating}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.featuredRatingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                    <Text numberOfLines={1} style={styles.featuredName}>{item.name}</Text>
                    <Text style={styles.featuredMeta}>{item.cuisine} • {item.prepTimeMinutes} mins</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Popular items section */}
        <View style={styles.popularWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Popular Today</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FoodList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Render small cards */}
          {recipes.slice(5, 11).map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('FoodDetail', { recipeId: item.id })}
              style={styles.popularCard}
            >
              <Image source={{ uri: item.image }} style={styles.popularImage} />
              
              <View style={styles.popularInfo}>
                <Text numberOfLines={1} style={styles.popularName}>{item.name}</Text>
                <Text style={styles.popularMeta}>{item.cuisine} • {item.difficulty}</Text>
                
                <View style={styles.popularRatingRow}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.popularRatingText}>{item.rating.toFixed(1)}</Text>
                  <Text style={styles.popularTimeText}>({item.reviewCount} reviews)</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleFavToggle(item)}
                style={styles.popularHeartBtn}
              >
                <Ionicons
                  name={favouritesMap[item.id] ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favouritesMap[item.id] ? COLORS.error : COLORS.secondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  appTitleText: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
  },
  headerLogoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
  },
  greetingBanner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  greetingText: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.dark,
  },
  taglineText: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    marginTop: 2,
  },
  scrollContainer: {
    paddingBottom: SPACING.xl,
  },
  searchWrapper: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchGoBtn: {
    position: 'absolute',
    right: 28,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchGoText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  categoriesWrapper: {
    marginTop: SPACING.md,
  },
  categoriesScroll: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingBottom: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  featuredWrapper: {
    marginTop: SPACING.lg,
  },
  featuredList: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  featuredCard: {
    width: 220,
    height: 140,
    borderRadius: 16,
    marginRight: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 30, 21, 0.8)',
    padding: SPACING.sm,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  featuredRatingText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  featuredName: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  featuredMeta: {
    color: '#D0D0E0',
    fontSize: 10,
    marginTop: 2,
  },
  popularWrapper: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  popularCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  popularImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#EAEAEA',
  },
  popularInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  popularName: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    color: COLORS.dark,
  },
  popularMeta: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  popularRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  popularRatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
    color: COLORS.dark,
  },
  popularTimeText: {
    fontSize: 10,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  popularHeartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
