import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { sellerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard';
import { StackNavigationProp } from '@react-navigation/stack';


type MyBooksScreenNavigationProp = StackNavigationProp<any, 'MyBooks'>;

interface Props {
  navigation: MyBooksScreenNavigationProp;
}

interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  coverImage?: string;
}

const MyBooksScreen: React.FC<Props> = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { logout } = useAuth();

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await sellerApi.getMyBooks();
      setBooks(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch your books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyBooks();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyBooks();
    setRefreshing(false);
  };

  const calculateInventoryStats = () => {
    const totalBooks = books.length;
    const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
    const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0);
    const lowStockBooks = books.filter(book => book.stock <= 5).length;
    const outOfStockBooks = books.filter(book => book.stock === 0).length;

    return {
      totalBooks,
      totalStock,
      totalValue,
      lowStockBooks,
      outOfStockBooks,
      averagePrice: totalBooks > 0 ? totalValue / totalStock : 0
    };
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard book={item} showAddToCart={false} />
  );

  const renderHeader = () => {
    const stats = calculateInventoryStats();

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📚 My Inventory</Text>
        <Text style={styles.headerSubtitle}>
          {books.length > 0
            ? `Managing ${books.length} books in your store`
            : 'Build your book collection'
          }
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalBooks}</Text>
            <Text style={styles.statLabel}>Total Books</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalStock}</Text>
            <Text style={styles.statLabel}>Total Stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹{stats.totalValue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Inventory Value</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[
              styles.statNumber,
              stats.lowStockBooks > 0 ? styles.warningText : styles.successText
            ]}>
              {stats.lowStockBooks}
            </Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>

        {stats.outOfStockBooks > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              ⚠️ {stats.outOfStockBooks} book{stats.outOfStockBooks > 1 ? 's' : ''} out of stock
            </Text>
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.addBookButton}
            onPress={() => navigation.navigate('AddBook')}
            activeOpacity={0.8}
          >
            <Text style={styles.addBookButtonText}>➕ Add New Book</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyticsButton}
            onPress={() => { }}
            activeOpacity={0.8}
          >
            <Text style={styles.analyticsButtonText}>📊 Analytics</Text>
          </TouchableOpacity>
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
          <Text style={styles.loadingText}>Loading your inventory...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandSection}>
              <Text style={styles.brandTitle}>BookStore</Text>
              <Text style={styles.brandSubtitle}>Seller Dashboard</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>🏪 Your Store Dashboard</Text>
            <Text style={styles.welcomeSubtext}>Manage your book inventory and sales</Text>
          </View>
        </View>

        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
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
              <Text style={styles.emptyIcon}>📖</Text>
              <Text style={styles.emptyTitle}>Start Your Bookstore</Text>
              <Text style={styles.emptyText}>
                Add your first book to start selling on BookStore marketplace
              </Text>
              <View style={styles.emptyBenefits}>
                <Text style={styles.benefitText}>✓ Reach thousands of book lovers</Text>
                <Text style={styles.benefitText}>✓ Easy inventory management</Text>
                <Text style={styles.benefitText}>✓ Secure payments & analytics</Text>
              </View>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => navigation.navigate('AddBook')}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedButtonText}>Get Started - Add Your First Book</Text>
              </TouchableOpacity>
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
    paddingBottom: 24,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  brandSection: {
    flexDirection: 'column',
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
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeSection: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#C7D2FE',
    opacity: 0.9,
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
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  warningText: {
    color: '#F59E0B',
  },
  successText: {
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addBookButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addBookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analyticsButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  analyticsButtonText: {
    color: '#6366F1',
    fontSize: 16,
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
    marginBottom: 24,
  },
  emptyBenefits: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  benefitText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginBottom: 8,
  },
  getStartedButton: {
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
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default MyBooksScreen;
