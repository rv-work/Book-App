import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export interface Seller {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  seller?: Seller;
}

interface BookCardProps {
  book: Book;
  onAddToCart?: (bookId: string) => void;
  showAddToCart?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  showAddToCart = true,
}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: book.imageUrl || 'https://via.placeholder.com/150x200' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{book.description}</Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{book.price}</Text>
            <Text style={styles.seller}>by {book.seller?.name}</Text>
          </View>

          {showAddToCart && onAddToCart && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAddToCart(book.id)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.stock}>Stock: {book.stock}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  content: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  description: { fontSize: 14, color: '#666', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  priceContainer: { flex: 1 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
  seller: { fontSize: 12, color: '#888' },
  addButton: { backgroundColor: '#007bff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  stock: { fontSize: 12, color: '#28a745' },
});

export default BookCard;
