import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'https://book-app-aldw.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  coverImage?: string;
  imageUrl?: string;
}

export interface Buyer {
  id: string;
  name: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: number;
  buyerId: number;
  sellerId: number;
  status: 'pending' | 'shipped' | 'delivered';
  book: Book;
  seller: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AddBookData {
  title: string;
  description: string;
  price: number;
  stock: number;
  coverImage?: {
    uri: string;
    type: string;
    fileName: string;
  };
}

export const buyerApi = {
  getAllBooks: (): Promise<AxiosResponse<Book[]>> =>
    api.get('/api/buyer/all-books'),

  addToCart: (
    bookId: string,
    quantity: number = 1,
  ): Promise<AxiosResponse<{ success: boolean }>> =>
    api.post('/api/buyer/add-to-cart', { bookId, quantity }),

  getCart: (): Promise<AxiosResponse<CartItem[]>> => api.get('/api/buyer/cart'),

  placeOrder: (): Promise<
    AxiosResponse<{ success: boolean; orderId: string }>
  > => api.post('/api/buyer/place-order'),

  getMyOrders: (): Promise<AxiosResponse<Order[]>> =>
    api.get('/api/buyer/my-order'),
};

export const sellerApi = {
  getMyBooks: (): Promise<AxiosResponse<Book[]>> =>
    api.get('/api/seller/all-books'),

  addBook: (bookData: AddBookData): Promise<AxiosResponse<Book>> => {
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('description', bookData.description);
    formData.append('price', bookData.price.toString());
    formData.append('stock', bookData.stock.toString());

    if (bookData.coverImage) {
      formData.append('coverImage', {
        uri: bookData.coverImage.uri,
        type: bookData.coverImage.type,
        name: bookData.coverImage.fileName,
      } as any);
    }

    return api.post('/api/seller/add-book', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getOrders: (): Promise<AxiosResponse<Order[]>> =>
    api.get('/api/seller/orders'),

  updateOrderStatus: (
    orderId: string,
    status: Order['status'],
  ): Promise<AxiosResponse<{ success: boolean }>> =>
    api.put(`/api/seller/orders/${orderId}/status`, { status }),
};
