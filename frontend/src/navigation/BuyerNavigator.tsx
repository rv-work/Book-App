import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/buyer/HomeScreen';
import CartScreen from '../screens/buyer/CartScreen';
import MyOrdersScreen from '../screens/buyer/MyOrdersScreen';

export type BuyerTabParamList = {
  Home: undefined;
  Cart: undefined;
  MyOrders: undefined;
};

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const HomeTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="book-outline" size={size} color={color} />
);

const CartTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="cart-outline" size={size} color={color} />
);

const MyOrdersTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="cube-outline" size={size} color={color} />
);

const BuyerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeTabBarIcon,
          title: 'All Books',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: CartTabBarIcon,
          title: 'My Cart',
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          tabBarIcon: MyOrdersTabBarIcon,
          title: 'My Orders',
        }}
      />
    </Tab.Navigator>
  );
};

export default BuyerNavigator;
