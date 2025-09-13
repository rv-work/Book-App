import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BookOpen,
  PlusCircle,
  Receipt,
} from 'lucide-react-native';

import MyBooksScreen from '../screens/seller/MyBooksScreen';
import AddBookScreen from '../screens/seller/AddBookScreen';
import OrdersScreen from '../screens/seller/OrdersScreen';

export type SellerTabParamList = {
  MyBooks: undefined;
  AddBook: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<SellerTabParamList>();

const iconSize = 28;

const MyBooksIcon = ({ color }: { color: string }) => (
  <BookOpen size={iconSize} color={color} />
);

const AddBookIcon = () => (
  <PlusCircle size={50} color="#28a745" />
);

const OrdersIcon = ({ color }: { color: string }) => (
  <Receipt size={iconSize} color={color} />
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
        options={{ tabBarIcon: MyBooksIcon }}
      />
      <Tab.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{ tabBarIcon: AddBookIcon }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: OrdersIcon }}
      />
    </Tab.Navigator>
  );
};

export default SellerNavigator;
