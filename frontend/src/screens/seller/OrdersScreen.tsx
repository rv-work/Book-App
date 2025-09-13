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
  StatusBar,
  Platform,
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all');

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

  const getFilteredOrders = () => {
    if (filterStatus === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filterStatus);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status.toLowerCase() === 'pending').length;
    const shipped = orders.filter(order => order.status.toLowerCase() === 'shipped').length;
    const delivered = orders.filter(order => order.status.toLowerCase() === 'delivered').length;
    const cancelled = orders.filter(order => order.status.toLowerCase() === 'cancelled').length;

    return { total, pending, shipped, delivered, cancelled };
  };



  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => showStatusOptions(item.id, item.status)}
      activeOpacity={0.8}
    >
      <OrderItem order={item} showBuyer />
      <View style={styles.updateHint}>
        <Text style={styles.updateHintText}>👆 Tap to update status</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    const stats = getOrderStats();
    const filteredOrders = getFilteredOrders();

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📦 Order Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOrders.length > 0
            ? `Managing ${filteredOrders.length} ${filterStatus === 'all' ? 'orders' : filterStatus + ' orders'}`
            : 'No orders to manage'
          }
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.pendingColor]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.shippedColor]}>{stats.shipped}</Text>
            <Text style={styles.statLabel}>Shipped</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.deliveredColor]}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total Revenue from Delivered Orders</Text>
        </View>

        {stats.pending > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              🚚 {stats.pending} order{stats.pending > 1 ? 's' : ''} awaiting fulfillment
            </Text>
          </View>
        )}

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter Orders:</Text>
          <View style={styles.filterButtons}>
            {(['all', 'pending', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(status)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === status && styles.filterButtonTextActive
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && ` (${stats[status as keyof typeof stats]})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>BookStore</Text>
            <Text style={styles.brandSubtitle}>Seller Dashboard</Text>
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366F1']}
              tintColor="#6366F1"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                {filterStatus === 'all' ? '📦' :
                  filterStatus === 'pending' ? '⏳' :
                    filterStatus === 'shipped' ? '🚚' :
                      filterStatus === 'delivered' ? '✅' : '❌'}
              </Text>
              <Text style={styles.emptyTitle}>
                {filterStatus === 'all' ? 'No Orders Yet' :
                  `No ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Orders`}
              </Text>
              <Text style={styles.emptyText}>
                {filterStatus === 'all'
                  ? 'Orders will appear here when customers purchase your books'
                  : `You don't have any ${filterStatus} orders at the moment`
                }
              </Text>

              {filterStatus === 'all' ? (
                <View style={styles.emptyActions}>
                  <TouchableOpacity
                    style={styles.promoteButton}
                    onPress={() => navigation.navigate('MyBooks')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.promoteButtonText}>📚 Manage Books</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addBookButton}
                    onPress={() => navigation.navigate('AddBook')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addBookButtonText}>➕ Add More Books</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => setFilterStatus('all')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearFilterText}>View All Orders</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  pendingColor: {
    color: '#F59E0B',
  },
  shippedColor: {
    color: '#3B82F6',
  },
  deliveredColor: {
    color: '#10B981',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  alertBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  orderContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  updateHint: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
  },
  updateHintText: {
    fontSize: 12,
    color: '#4F46E5',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  promoteButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  promoteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addBookButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  addBookButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  clearFilterButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  clearFilterText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen;
