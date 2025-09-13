import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { buyerApi, Order } from '../../services/api';
import OrderItem from '../../components/OrderItem';
import { StackNavigationProp } from '@react-navigation/stack';


interface Props {
  navigation: StackNavigationProp<any, 'MyOrders'>;
}

const MyOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await buyerApi.getMyOrders();
      setOrders(response.data);
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

  const getFilteredOrders = () => {
    if (filterStatus === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filterStatus);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status.toLowerCase() === 'pending').length;
    const delivered = orders.filter(order => order.status.toLowerCase() === 'delivered').length;
    const cancelled = orders.filter(order => order.status.toLowerCase() === 'cancelled').length;

    return { total, pending, delivered, cancelled };
  };

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <OrderItem order={item} showBuyer={false} />
  );

  const renderHeader = () => {
    const stats = getOrderStats();
    const filteredOrders = getFilteredOrders();

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📦 My Orders</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOrders.length > 0
            ? `Showing ${filteredOrders.length} ${filterStatus === 'all' ? 'orders' : filterStatus + ' orders'}`
            : 'No orders found'
          }
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by Status:</Text>
          <View style={styles.filterButtons}>
            {(['all', 'pending', 'delivered', 'cancelled'] as const).map((status) => (
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
          <Text style={styles.loadingText}>Loading your orders...</Text>
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
            <Text style={styles.brandSubtitle}>Marketplace</Text>
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => String(item.id)}
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
                    filterStatus === 'delivered' ? '✅' : '❌'}
              </Text>
              <Text style={styles.emptyTitle}>
                {filterStatus === 'all' ? 'No orders yet' :
                  `No ${filterStatus} orders`}
              </Text>
              <Text style={styles.emptyText}>
                {filterStatus === 'all'
                  ? 'Start shopping to see your orders here'
                  : `You don't have any ${filterStatus} orders at the moment`
                }
              </Text>
              {filterStatus === 'all' ? (
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => navigation.navigate('Home')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
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
    paddingHorizontal: 16,
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
    fontSize: 14,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
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

export default MyOrdersScreen;
