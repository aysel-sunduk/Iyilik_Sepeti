import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DonationVerifyScreen from '../screens/admin/DonationVerifyScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DonationVerify" component={DonationVerifyScreen} />
    </Stack.Navigator>
  );
}