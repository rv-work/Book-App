import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { buyerApi } from '../../services/api';
import CartItem from '../../components/CartItem';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BuyerTabParamList } from '../../navigation/BuyerNavigator';

type CartScreenNavigationProp = BottomTabNavigationProp<BuyerTabParamList, 'Cart'>;

interface Props {
  navigation: CartScreenNavigationProp;
}

interface Book {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
}

interface Cart {
  id: number;
  book: Book;
  quantity: number;
}

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [placing, setPlacing] = useState<boolean>(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await buyerApi.getCart();
      setCartItems(
        (response.data as any[]).map(item => ({
          id: item.id,
          book: item.book,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCart();
    });
    return unsubscribe;
  }, [navigation]);

  const calculateTotal = (): string => {
    return cartItems
      .reduce((total, item) => total + item.book.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setPlacing(true);
    try {
      await buyerApi.placeOrder();
      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setCartItems([]);
            navigation.navigate('MyOrders');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
      console.error(error);
    } finally {
      setPlacing(false);
    }
  };

  const renderCartItem = ({ item }: { item: Cart }) => (
    <CartItem
      item={{ ...item, book: { ...item.book, id: item.book.id.toString() } }}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ₹{calculateTotal()}</Text>
            </View>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.orderButtonText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  shopButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: { marginBottom: 15 },
  totalText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  orderButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;
