import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from './api';

export interface FoodItem {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  prepTime: number;
  savedAt: string;
}

const FAVOURITES_KEY = '@quickbite_favourites';

export const getFavourites = async (): Promise<FoodItem[]> => {
  try {
    const value = await AsyncStorage.getItem(FAVOURITES_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to get favourites from storage:', error);
    return [];
  }
};

export const saveFavourites = async (favourites: FoodItem[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    return true;
  } catch (error) {
    console.error('Failed to save favourites to storage:', error);
    return false;
  }
};

export const toggleFavourite = async (recipe: Recipe): Promise<boolean> => {
  try {
    const favourites = await getFavourites();
    const index = favourites.findIndex(item => item.id === recipe.id);
    
    let updated: FoodItem[];
    if (index >= 0) {
      // Remove
      updated = favourites.filter(item => item.id !== recipe.id);
    } else {
      // Add
      const newItem: FoodItem = {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        cuisine: recipe.cuisine,
        rating: recipe.rating,
        prepTime: recipe.prepTimeMinutes,
        savedAt: new Date().toISOString(),
      };
      updated = [newItem, ...favourites];
    }
    
    await saveFavourites(updated);
    return index < 0; // returns true if added, false if removed
  } catch (error) {
    console.error('Failed to toggle favourite:', error);
    return false;
  }
};

export const isFavourite = async (id: number): Promise<boolean> => {
  try {
    const favourites = await getFavourites();
    return favourites.some(item => item.id === id);
  } catch (error) {
    console.error('Failed to check favourite status:', error);
    return false;
  }
};

export const clearFavourites = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(FAVOURITES_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear favourites:', error);
    return false;
  }
};
