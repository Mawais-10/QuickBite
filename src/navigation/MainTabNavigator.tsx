import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { FoodListScreen } from '../screens/main/FoodListScreen';
import { FoodDetailScreen } from '../screens/main/FoodDetailScreen';
import { OrdersScreen } from '../screens/main/OrdersScreen';
import { FavouritesScreen } from '../screens/main/FavouritesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { COLORS } from '../theme';

export type HomeStackParamList = {
  Dashboard: undefined;
  FoodList: { category?: string; query?: string } | undefined;
  FoodDetail: { recipeId: number };
};

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  FavouritesTab: undefined;
  ProfileTab: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          shadowColor: COLORS.shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        },
        headerTintColor: COLORS.dark,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }} // Custom header will be rendered in Dashboard
      />
      <Stack.Screen 
        name="FoodList" 
        component={FoodListScreen} 
        options={({ route }) => ({ 
          title: route.params?.category || route.params?.query ? `Search: ${route.params?.query}` : 'All Recipes',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name="FoodDetail" 
        component={FoodDetailScreen} 
        options={{ 
          title: 'Recipe Details',
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'OrdersTab') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'FavouritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 2,
          shadowColor: COLORS.shadowColor,
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: COLORS.dark,
        },
        headerTintColor: COLORS.dark,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ 
          title: 'Home',
          headerShown: false 
        }} 
      />
      <Tab.Screen 
        name="OrdersTab" 
        component={OrdersScreen} 
        options={{ title: 'My Orders' }} 
      />
      <Tab.Screen 
        name="FavouritesTab" 
        component={FavouritesScreen} 
        options={{ title: 'Favourites' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }} 
      />
    </Tab.Navigator>
  );
};
