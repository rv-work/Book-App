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

const getTabBarIcon = (routeName: keyof SellerTabParamList) => ({ color, size }: { color: string; size: number }) => {
  let iconName = '';

  if (routeName === 'MyBooks') iconName = 'book';
  else if (routeName === 'AddBook') iconName = 'add-circle';
  else if (routeName === 'Orders') iconName = 'clipboard';

  return <Ionicons name={iconName} size={size} color={color} />;
};

const SellerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarIcon: getTabBarIcon(route.name as keyof SellerTabParamList),
      })}
    >
      <Tab.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ title: 'My Books' }}
      />
      <Tab.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{ title: 'Add Book' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
    </Tab.Navigator>
  );
};

export default SellerNavigator;
