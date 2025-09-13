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

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard book={item} showAddToCart={false} />
  );

  // ---------- Show loading spinner ----------
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Books</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books added yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddBook')}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  logoutButton: { padding: 8 },
  logoutText: { color: '#dc3545', fontSize: 16 },
  listContent: { padding: 15 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // for loader
});

export default MyBooksScreen;
