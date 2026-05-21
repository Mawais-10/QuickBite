import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { OrderCard, Order } from '../../components/OrderCard';
import { EmptyState } from '../../components/EmptyState';
import { db } from '../../config/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { COLORS, SPACING } from '../../theme';

export const OrdersScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener filtered by userId
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersList.push({
          id: doc.id,
          userId: data.userId,
          foodName: data.foodName,
          quantity: data.quantity,
          price: data.price,
          totalPrice: data.totalPrice,
          orderTime: data.orderTime,
          status: data.status,
          image: data.image,
          cuisine: data.cuisine
        });
      });

      // Sort in-memory to prevent requiring Firestore Composite Indexes
      ordersList.sort((a, b) => {
        const timeA = a.orderTime?.seconds || 0;
        const timeB = b.orderTime?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot subscription error: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No, Keep It', style: 'cancel' },
        { text: 'Yes, Cancel Order', style: 'destructive', onPress: async () => {
            try {
              const orderDocRef = doc(db, 'orders', orderId);
              await deleteDoc(orderDocRef);
              Alert.alert('Order Cancelled', 'Your order was successfully cancelled.');
            } catch (err) {
              console.error('Failed to delete order:', err);
              Alert.alert('Error', 'Failed to cancel the order. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCtaPress = () => {
    // Navigate back to home dashboard or food search list
    (navigation as any).navigate('HomeTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No Orders Yet"
          subtitle="Start browsing delicious foods from local menus and place your first order!"
          ctaLabel="Browse Restaurants"
          onCtaPress={handleCtaPress}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onDelete={handleDeleteOrder}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
});
