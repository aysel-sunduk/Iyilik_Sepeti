import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ProductManagementScreen from '../screens/admin/ProductManagementScreen';
import ProductEditScreen from '../screens/admin/ProductEditScreen';
import CampaignManagementScreen from '../screens/admin/CampaignManagementScreen';
import CampaignEditScreen from '../screens/admin/CampaignEditScreen';
import DonationVerifyScreen from '../screens/admin/DonationVerifyScreen';
import CategoryManagementScreen from '../screens/admin/CategoryManagementScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
      <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
      <Stack.Screen name="CampaignManagement" component={CampaignManagementScreen} />
      <Stack.Screen name="CampaignEdit" component={CampaignEditScreen} />
      <Stack.Screen name="DonationVerify" component={DonationVerifyScreen} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
    </Stack.Navigator>
  );
}