import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MyBooksScreen from '../screens/seller/MyBooksScreen';
import AddBookScreen from '../screens/seller/AddBookScreen';
import OrdersScreen from '../screens/seller/OrdersScreen';

export type SellerTabParamList = {
  MyBooks: undefined;
  AddBook: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<SellerTabParamList>();

const getIconName = (routeName: keyof SellerTabParamList) => {
  switch (routeName) {
    case 'MyBooks':
      return 'library-outline';
    case 'AddBook':
      return 'add-circle';
    case 'Orders':
      return 'receipt-outline';
    default:
      return 'ellipse';
  }
};

const renderTabBarIcon =
  (routeName: keyof SellerTabParamList) =>
    ({ color, size }: { color: string; size: number }) =>
      <Ionicons name={getIconName(routeName)} size={size} color={color} />;

const AddBookIcon = () => (
  <Ionicons name="add-circle" size={50} color="#28a745" />
);

const SellerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#fff',
          borderRadius: 20,
          height: 70,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 5,
          elevation: 5,
        },
      }}
    >
      <Tab.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ tabBarIcon: renderTabBarIcon('MyBooks') }}
      />
      <Tab.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{ tabBarIcon: AddBookIcon }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: renderTabBarIcon('Orders') }}
      />
    </Tab.Navigator>
  );
};

export default SellerNavigator;
