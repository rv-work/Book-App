export const API_BASE_URL: string = 'https://your-backend-url.com';

export type ColorKeys =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export const COLORS: Record<ColorKeys, string> = {
  primary: '#007bff',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
} as const;

export const SCREEN_NAMES = {
  LOGIN: 'Login',
  SIGNUP: 'Signup',

  HOME: 'Home',
  CART: 'Cart',
  MY_ORDERS: 'MyOrders',

  MY_BOOKS: 'MyBooks',
  ADD_BOOK: 'AddBook',
  ORDERS: 'Orders',
} as const;

export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
