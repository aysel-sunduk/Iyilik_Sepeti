import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}