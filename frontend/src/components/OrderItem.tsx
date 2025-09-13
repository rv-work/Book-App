import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Order } from '../services/api';

interface OrderItemProps {
  order: Order;
  showBuyer?: boolean;
}
const OrderItem: React.FC<OrderItemProps> = ({ order, showBuyer = false }) => {
  const { book, status, seller } = order;

  if (!book) return null;

  const getStatusColor = (orderStatus: string): string => {
    switch (orderStatus.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'shipped':
        return '#007bff';
      case 'delivered':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.imageUrl || book.coverImage || 'https://via.placeholder.com/80x100' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.price}>₹{book.price}</Text>

        {showBuyer && (
          <Text style={styles.buyer}>Seller: {seller?.name}</Text>
        )}

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

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
  buyer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrderItem;
