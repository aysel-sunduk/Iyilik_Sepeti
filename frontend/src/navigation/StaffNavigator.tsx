import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DonationVerifyScreen from '../screens/admin/DonationVerifyScreen';

const Stack = createNativeStackNavigator();

export default function StaffNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DonationVerify" component={DonationVerifyScreen} />
    </Stack.Navigator>
  );
}
