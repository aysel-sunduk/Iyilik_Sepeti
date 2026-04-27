import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
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

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="DonationTracking" component={DonationTrackingScreen} />
      <Stack.Screen name="DonationFlow" component={DonationFlowScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);
  return <NavigationContainer>{user ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}