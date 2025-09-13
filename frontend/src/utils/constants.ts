//  hello so maine initialise kiya hai ek normal react native project usme mereko ab chahiye kuch pages and navigation
// >>
// >> to mujhe vo sara chahie
// >>
// >> 1 page : when someone visit first time or loged out so show login login singup screen first
// >> 2 if logged in or after login go to
// >> if buyer ...
// >> home page where all books will be there
// >> if click on add to cart then to add to cart
// >> cart page
// >>
// >> where all the books will be there jo add ki hui hai
// >>
// >> then place order krne pr order ho jaye
// >>
// >> my orders page jha meri order ki hui sari books ho unka status ke sath
// >>
// >> if seller
// >>
// >> my-books page jha meri add ki gyi sari books ho
// >> orders page jha meri books ko ki gyi sari orders ho vha unak status update krne ka option ho
// >> and add book page jha mai book add kr pau
// >>
// >>
// >> all this needs to done for  this assignment
// >>
// >>
// >> not this is the assignment
// >>
// >>
// >> and these are the backend files
// >>
// >>
// >>
// >>
// >>
// >> provide full structure and all the files with code
// >>
// >>
// >> react native ok
// >>
// >>
// >> lets go

// src/config/constants.ts

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

// Use a readonly object for screen names and derive a type from it
export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  SIGNUP: 'Signup',

  // Buyer
  HOME: 'Home',
  CART: 'Cart',
  MY_ORDERS: 'MyOrders',

  // Seller
  MY_BOOKS: 'MyBooks',
  ADD_BOOK: 'AddBook',
  ORDERS: 'Orders',
} as const;

export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
