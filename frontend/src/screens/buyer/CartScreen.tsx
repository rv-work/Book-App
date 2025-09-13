import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
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

  const calculateItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const calculateSubtotal = (): string => {
    return calculateTotal();
  };

  const getShippingCost = (): string => {
    const total = parseFloat(calculateTotal());
    return total >= 500 ? '0.00' : '50.00';
  };

  const getFinalTotal = (): string => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = parseFloat(getShippingCost());
    return (subtotal + shipping).toFixed(2);
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>🛒 Shopping Cart</Text>
      <Text style={styles.headerSubtitle}>
        {cartItems.length > 0
          ? `${calculateItemCount()} items in your cart`
          : 'Your cart is empty'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>BookStore</Text>
            <Text style={styles.brandSubtitle}>Marketplace</Text>
          </View>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Discover amazing books and start building your collection
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
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
              ListHeaderComponent={renderHeader}
            />

            <View style={styles.footer}>
              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal ({calculateItemCount()} items)</Text>
                  <Text style={styles.summaryValue}>₹{calculateSubtotal()}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={[
                    styles.summaryValue,
                    getShippingCost() === '0.00' && styles.freeShipping
                  ]}>
                    {getShippingCost() === '0.00' ? 'FREE' : `₹${getShippingCost()}`}
                  </Text>
                </View>

                {parseFloat(calculateTotal()) < 500 && (
                  <View style={styles.shippingBanner}>
                    <Text style={styles.shippingBannerText}>
                      Add ₹{(500 - parseFloat(calculateTotal())).toFixed(2)} more for FREE shipping!
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₹{getFinalTotal()}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.orderButton, placing && styles.orderButtonLoading]}
                onPress={handlePlaceOrder}
                disabled={placing}
                activeOpacity={0.8}
              >
                {placing ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.orderButtonText}>Place Order • ₹{getFinalTotal()}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.trustBadges}>
                <Text style={styles.trustText}>🔒 Secure Checkout • 💳 Multiple Payment Options</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  brandSection: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#C7D2FE',
    fontWeight: '500',
    marginTop: -2,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  orderSummary: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#10B981',
  },
  shippingBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  shippingBannerText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  orderButton: {
    backgroundColor: '#10B981',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  orderButtonLoading: {
    opacity: 0.7,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  trustBadges: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default CartScreen;
