import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface Book {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

export interface CartItemType {
  book: Book;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { book, quantity } = item;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.imageUrl || 'https://via.placeholder.com/80x100' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>

        <Text style={styles.price}>₹{book.price}</Text>
        <Text style={styles.quantity}>Quantity: {quantity}</Text>
        <Text style={styles.total}>
          Total: ₹{(book.price * quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default CartItem;
