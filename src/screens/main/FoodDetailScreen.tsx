import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/CustomButton';
import { getRecipeById, Recipe } from '../../services/api';
import { toggleFavourite, isFavourite } from '../../services/storage';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../../theme';
import { LoadingSpinner } from '../../components/LoadingSpinner';

// Firebase Firestore Imports
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

type FoodDetailScreenRouteProp = RouteProp<HomeStackParamList, 'FoodDetail'>;
type FoodDetailScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'FoodDetail'>;

interface Props {
  route: FoodDetailScreenRouteProp;
  navigation: FoodDetailScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export const FoodDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  
  // Interactive UI States
  const [ingredientsExpanded, setIngredientsExpanded] = useState(true);
  const [instructionsExpanded, setInstructionsExpanded] = useState(true);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  
  // Ordering States
  const [quantity, setQuantity] = useState(1);
  const [orderPlacing, setOrderPlacing] = useState(false);
  
  // Custom Success States
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [placedOrderSummary, setPlacedOrderSummary] = useState({ quantity: 1, totalPrice: 0 });

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    setLoading(true);
    try {
      const data = await getRecipeById(recipeId);
      setRecipe(data);
      const fav = await isFavourite(recipeId);
      setIsFav(fav);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load recipe details. Please go back.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleFavToggle = async () => {
    if (!recipe) return;
    const added = await toggleFavourite(recipe);
    setIsFav(added);
    Alert.alert(
      added ? 'Added to Favourites' : 'Removed from Favourites',
      added ? `"${recipe.name}" was added to your local library.` : `"${recipe.name}" was removed.`,
      [{ text: 'OK' }]
    );
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handlePlaceOrder = async () => {
    if (!recipe || !user) return;
    
    setOrderPlacing(true);
    
    const pricePerServing = parseFloat((recipe.caloriesPerServing / 30).toFixed(2));
    const totalPrice = quantity * pricePerServing;

    try {
      // Add Order with Image and Cuisine to Firestore
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, {
        userId: user.uid,
        foodName: recipe.name,
        quantity: quantity,
        price: pricePerServing,
        totalPrice: totalPrice,
        orderTime: serverTimestamp(),
        status: 'confirmed',
        image: recipe.image,
        cuisine: recipe.cuisine
      });

      setOrderModalVisible(false);
      setPlacedOrderSummary({ quantity: quantity, totalPrice: totalPrice });
      setQuantity(1); // Reset
      setSuccessModalVisible(true); // Open premium custom success modal
    } catch (error: any) {
      console.error('Failed to write to firestore:', error);
      Alert.alert('Order Failed', 'We couldn\'t place your order. Please check Firestore permissions.');
    } finally {
      setOrderPlacing(false);
    }
  };

  if (loading || !recipe) {
    return <LoadingSpinner message="Cooking up recipe details..." />;
  }

  // Cost mapping
  const itemPrice = parseFloat((recipe.caloriesPerServing / 30).toFixed(2));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Scrollable details */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Full-width Hero image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <View style={styles.heroGradient} />
          
          {/* Custom navigation back arrow wrapper for transparent headers */}
          <TouchableOpacity activeOpacity={0.8} style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Recipe Identity & Tags */}
        <View style={styles.contentBody}>
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.name}>{recipe.name}</Text>
              <Text style={styles.cuisineText}>{recipe.cuisine} Cuisine</Text>
            </View>
            
            {/* Rating Stars Badge */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{recipe.rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Difficulty & Calorie Tags */}
          <View style={styles.tagStrip}>
            <View style={[styles.chipTag, styles.difficultyChip]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
            <View style={[styles.chipTag, styles.cuisineChip]}>
              <Text style={styles.cuisineTagText}>{recipe.tags[0] || 'Popular'}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>${itemPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Core Info Strip */}
          <View style={styles.infoStrip}>
            <View style={styles.infoCol}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.infoVal}>{recipe.prepTimeMinutes} mins</Text>
              <Text style={styles.infoLbl}>Prep Time</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
              <Text style={styles.infoVal}>{recipe.servings}</Text>
              <Text style={styles.infoLbl}>Servings</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Ionicons name="flame" size={20} color={COLORS.primary} />
              <Text style={styles.infoVal}>{recipe.caloriesPerServing}</Text>
              <Text style={styles.infoLbl}>Calories</Text>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.accordionCard}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setIngredientsExpanded(!ingredientsExpanded)}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>Ingredients Checklist ({recipe.ingredients.length})</Text>
              <Ionicons 
                name={ingredientsExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={COLORS.dark} 
              />
            </TouchableOpacity>
            
            {ingredientsExpanded && (
              <View style={styles.accordionContent}>
                {recipe.ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientRow}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.ingredientText}>{ing}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Instructions Section */}
          <View style={[styles.accordionCard, styles.instructionsCard]}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setInstructionsExpanded(!instructionsExpanded)}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>Preparation Steps</Text>
              <Ionicons 
                name={instructionsExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={COLORS.dark} 
              />
            </TouchableOpacity>
            
            {instructionsExpanded && (
              <View style={styles.accordionContent}>
                {recipe.instructions.map((step, idx) => (
                  <View key={idx} style={styles.instructionStep}>
                    <View style={styles.stepNumCircle}>
                      <Text style={styles.stepNumText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* Floating Action footer bar */}
      <View style={styles.footerBar}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleFavToggle}
          style={[styles.footerFavBtn, isFav ? styles.footerFavBtnActive : null]}
        >
          <Ionicons 
            name={isFav ? "heart" : "heart-outline"} 
            size={24} 
            color={isFav ? COLORS.error : COLORS.secondary} 
          />
        </TouchableOpacity>
        
        <CustomButton
          title="🛒 Place Order"
          onPress={() => setOrderModalVisible(true)}
          variant="primary"
          style={styles.footerOrderBtn}
        />
      </View>

      {/* Place Order Quantity Bottom Sheet / Modal */}
      <Modal
        visible={orderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setOrderModalVisible(false)} 
            style={styles.modalBgTap} 
          />
          
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Quantity</Text>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetProduct}>
              <Image source={{ uri: recipe.image }} style={styles.sheetImage} />
              <View style={styles.sheetProductDetails}>
                <Text style={styles.sheetFoodName}>{recipe.name}</Text>
                <Text style={styles.sheetFoodCuisine}>{recipe.cuisine} Cuisine</Text>
                <Text style={styles.sheetFoodPrice}>${itemPrice.toFixed(2)} / serving</Text>
              </View>
            </View>

            {/* Quantity select inputs */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decrementQty} style={styles.qtyBtn}>
                <Ionicons name="remove" size={20} color={COLORS.dark} />
              </TouchableOpacity>
              
              <Text style={styles.qtyText}>{quantity}</Text>
              
              <TouchableOpacity onPress={incrementQty} style={styles.qtyBtn}>
                <Ionicons name="add" size={20} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            {/* Order Pricing details */}
            <View style={styles.priceDetails}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Items Total</Text>
                <Text style={styles.priceVal}>${(quantity * itemPrice).toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Charge</Text>
                <Text style={[styles.priceVal, { color: COLORS.success }]}>FREE</Text>
              </View>
              <View style={[styles.priceRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalVal}>${(quantity * itemPrice).toFixed(2)}</Text>
              </View>
            </View>

            {/* Confirm order CTA */}
            <CustomButton
              title="Confirm & Place Order"
              onPress={handlePlaceOrder}
              loading={orderPlacing}
              variant="success"
              style={styles.sheetSubmitBtn}
            />
          </View>
        </View>
      </Modal>

      {/* Premium Order Success Overlay Modal */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={48} color={COLORS.white} />
            </View>

            <Text style={styles.successTitle}>Order Confirmed! 🎉</Text>
            <Text style={styles.successSubtitle}>Your meal order has been sent to our kitchen.</Text>

            <View style={styles.successBillCard}>
              <Text numberOfLines={1} style={styles.successBillFood}>{recipe.name}</Text>
              <View style={styles.successBillRow}>
                <Text style={styles.successBillLabel}>Quantity Ordered:</Text>
                <Text style={styles.successBillValue}>{placedOrderSummary.quantity}x</Text>
              </View>
              <View style={styles.successBillRow}>
                <Text style={styles.successBillLabel}>Total Amount Paid:</Text>
                <Text style={[styles.successBillValue, styles.successBillTotal]}>
                  ${placedOrderSummary.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.successButtonRow}>
              <CustomButton
                title="View My Orders"
                onPress={() => {
                  setSuccessModalVisible(false);
                  navigation.navigate('OrdersTab' as any);
                }}
                variant="primary"
                style={styles.successBtn}
              />
              <CustomButton
                title="Keep Browsing"
                onPress={() => setSuccessModalVisible(false)}
                variant="outline"
                style={styles.successBtnOutline}
                textStyle={{ color: COLORS.primary }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // Make room for floating footer
  },
  heroContainer: {
    width: width,
    height: 220,
    position: 'relative',
    backgroundColor: '#333',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  headerBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 35,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  contentBody: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SPACING.sm,
  },
  titleCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.h1,
    fontSize: 22,
  },
  cuisineText: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
    color: COLORS.dark,
  },
  tagStrip: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  chipTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  difficultyChip: {
    backgroundColor: COLORS.primary + '15',
  },
  difficultyText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cuisineChip: {
    backgroundColor: COLORS.secondary + '10',
  },
  cuisineTagText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  priceTag: {
    marginLeft: 'auto',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priceTagText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  infoCol: {
    alignItems: 'center',
    flex: 1,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SPACING.xs,
  },
  infoLbl: {
    fontSize: 10,
    color: COLORS.placeholder,
    marginTop: 2,
  },
  infoDivider: {
    height: 30,
    width: 1,
    backgroundColor: COLORS.border,
  },
  accordionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  instructionsCard: {
    marginBottom: SPACING.md,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  accordionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
  },
  accordionContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ingredientText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
    color: COLORS.dark,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  stepNumText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.dark,
    lineHeight: 20,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  footerFavBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  footerFavBtnActive: {
    backgroundColor: COLORS.error + '05',
    borderColor: COLORS.error + '30',
  },
  footerOrderBtn: {
    flex: 1,
    marginVertical: 0,
    height: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBgTap: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    maxHeight: '80%',
    ...SHADOWS.heavy,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    ...TYPOGRAPHY.h2,
  },
  sheetProduct: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sheetImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sheetProductDetails: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
  },
  sheetFoodName: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
  },
  sheetFoodCuisine: {
    ...TYPOGRAPHY.caption,
  },
  sheetFoodPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    minWidth: 30,
    textAlign: 'center',
  },
  priceDetails: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.md,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.secondary,
  },
  priceVal: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  grandTotalLabel: {
    ...TYPOGRAPHY.h3,
  },
  grandTotalVal: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
   sheetSubmitBtn: {
    height: 50,
    borderRadius: 12,
    marginVertical: 0,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 30, 21, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    width: '100%',
    maxWidth: 385,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  successTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 24,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  successSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  successBillCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  successBillFood: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  successBillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  successBillLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  successBillValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  successBillTotal: {
    color: COLORS.primary,
    fontSize: 13,
  },
  successButtonRow: {
    width: '100%',
    gap: SPACING.sm,
  },
  successBtn: {
    width: '100%',
    height: 48,
    marginVertical: 0,
  },
  successBtnOutline: {
    width: '100%',
    height: 48,
    marginVertical: 0,
    borderColor: COLORS.primary,
  },
});
