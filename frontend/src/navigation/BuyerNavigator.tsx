import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Store, ShoppingBag, Receipt } from 'lucide-react-native';
import HomeScreen from '../screens/buyer/HomeScreen';
import CartScreen from '../screens/buyer/CartScreen';
import MyOrdersScreen from '../screens/buyer/MyOrdersScreen';

export type BuyerTabParamList = {
  Home: undefined;
  Cart: undefined;
  MyOrders: undefined;
};

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const iconSize = 28;

const HomeTabBarIcon = ({ color }: { color: string }) => (
  <Store size={iconSize} color={color} />
);

const CartTabBarIcon = ({ color }: { color: string }) => (
  <ShoppingBag size={iconSize} color={color} />
);

const MyOrdersTabBarIcon = ({ color }: { color: string }) => (
  <Receipt size={iconSize} color={color} />
);

const BuyerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: '#FFFFFF',
          borderRadius: 25,
          paddingBottom: 0,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.15,
          shadowOffset: {
            width: 0,
            height: 8
          },
          shadowRadius: 12,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: CartTabBarIcon,
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          tabBarIcon: MyOrdersTabBarIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BuyerNavigator;
