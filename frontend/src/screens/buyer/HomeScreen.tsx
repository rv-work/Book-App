import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import { buyerApi, Book } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard';

const HomeScreen: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { logout } = useAuth();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await buyerApi.getAllBooks();
      setBooks(response.data as Book[]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleAddToCart = async (bookId: string) => {
    try {
      await buyerApi.addToCart(bookId, 1);
      Alert.alert('Success', 'Book added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add book to cart');
      console.error(error);
    }
  };

  const renderBook: ListRenderItem<Book> = ({ item }) => (
    <BookCard book={item} onAddToCart={handleAddToCart} showAddToCart={true} />
  );

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
        <Text style={styles.headerTitle}>All Books</Text>
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
            <Text style={styles.emptyText}>No books available</Text>
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
  emptyText: { fontSize: 18, color: '#666' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
