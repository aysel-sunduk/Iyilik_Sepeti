import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from './src/context/ThemeContext';
import { RootState, store } from './src/redux/store';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/main/HomeScreen';
//import DashboardScreen from './src/screens/main/DashboardScreen'; // ← YENİ

const Stack = createNativeStackNavigator();

// Auth Stack (giriş yapmamış kullanıcılar için)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack (giriş yapmış kullanıcılar için)
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator - user'a göre yönlendirme yapar
function RootNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}