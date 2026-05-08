import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import CartScreen from '../screens/main/CartScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import DonationFlowScreen from '../screens/main/DonationFlowScreen';
import DonationTrackingScreen from '../screens/main/DonationTrackingScreen';
import HomeScreen from '../screens/main/HomeScreen';
import OrderTrackingScreen from '../screens/main/OrderTrackingScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AddCardScreen from '../screens/main/AddCardScreen';
import AddAddressScreen from '../screens/main/AddAddressScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import AddressesScreen from '../screens/main/AddressesScreen';
import CardsScreen from '../screens/main/CardsScreen';
import AllProductsScreen from '../screens/main/AllProductsScreen';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text4,
        tabBarIcon: ({ color, size }) => {
          let icon = '🏠';
          if (route.name === 'Ana Sayfa') icon = '🏠';
          else if (route.name === 'Kategoriler') icon = '📂';
          else if (route.name === 'Bağışlarım') icon = '❤️';
          else if (route.name === 'Sepetim') icon = '🛒';
          else if (route.name === 'Profil') icon = '👤';
          else if (route.name === 'Yönetim') icon = '🛡️';
          return <Text style={{ fontSize: size }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Kategoriler" component={CategoriesScreen} />
      <Tab.Screen name="Bağışlarım" component={DonationTrackingScreen} />
      <Tab.Screen 
        name="Sepetim" 
        component={CartScreen} 
        options={{ 
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#EF4444' }
        }} 
      />
      <Tab.Screen name="Profil" component={ProfileScreen} />
      {user?.role === 'ADMIN' && (
        <Tab.Screen 
          name="Yönetim" 
          component={AdminNavigator} 
          options={{
            tabBarLabel: 'Yönetim',
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="DonationTracking" component={DonationTrackingScreen} />
      <Stack.Screen name="DonationFlow" component={DonationFlowScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="Cards" component={CardsScreen} />
      <Stack.Screen name="AllProducts" component={AllProductsScreen} />
      <Stack.Screen name="OrderDetail" component={OrderTrackingScreen} />
      <Stack.Screen name="Admin" component={AdminNavigator} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}