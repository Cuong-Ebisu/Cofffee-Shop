import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';
import { AuthProvider, useAuth } from './src/screens/AuthContext';

export type RootStackParamList = {
  Login: undefined;//{ message?: string }; // Thêm tham số message, có thể không có
  Home: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Người dùng đã đăng nhập
          <>
            <Stack.Screen name="Tab" component={TabNavigator} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          // Người dùng chưa đăng nhập
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
