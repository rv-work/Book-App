import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AlertButton,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { sellerApi, Order } from '../../services/api';
import OrderItem from '../../components/OrderItem';
import { StackNavigationProp } from '@react-navigation/stack';

type OrdersScreenNavigationProp = StackNavigationProp<any, 'Orders'>;

interface Props {
  navigation: OrdersScreenNavigationProp;
}

const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerApi.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const updateOrderStatus = async (
    orderId: number,
    newStatus: Order['status']
  ) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await sellerApi.updateOrderStatus(orderId.toString(), newStatus);
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      await fetchOrders();
      Alert.alert('Error', 'Failed to update order status');
      console.error(error);
    }
  };

  const showStatusOptions = (orderId: number, currentStatus: Order['status']) => {
    const options: Order['status'][] = ['pending', 'shipped', 'delivered'];

    const buttons: AlertButton[] = options
      .filter(status => status !== currentStatus)
      .map(status => ({
        text: status.charAt(0).toUpperCase() + status.slice(1),
        onPress: () => updateOrderStatus(orderId, status),
      }));

    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Update Order Status', 'Choose new status:', buttons);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => showStatusOptions(item.id, item.status)}
    >
      <OrderItem order={item} showBuyer />
      <View style={styles.updateHint}>
        <Text style={styles.updateHintText}>Tap to update status</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders received yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  orderContainer: {
    marginBottom: 5,
  },
  updateHint: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  updateHintText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default OrdersScreen;
