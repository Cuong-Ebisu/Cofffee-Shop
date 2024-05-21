import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import SplashScreen from 'react-native-splash-screen';
import { AuthProvider, useAuth } from './src/screens/AuthContext';
import EditUserProfile from './src/screens/EditUserProfile';
import EditAPI from './src/screens/EditAPI';
import UserProfile from './src/screens/UserProfile';
import LocationScreen1 from './src/screens/LocationScreen1';
import EnterLocationManually from './src/screens/EnterLocationManually';
import Introduction1 from './src/screens/Introduction1';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Signup: undefined;
  Verify: { email: string; otp?: string };
  Tab: undefined;
  EditUserProfile: undefined;
  EditAPI: undefined;
  UserProfile: undefined;
  LocationScreen1: undefined;
  EnterLocationManually: undefined;
  Introduction: undefined; 
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction" screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            
            
            
          </>
        ) : (
          <>
            <Stack.Screen name="Tab" component={TabNavigator} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ animation: 'slide_from_right' }} />
          </>
        )}
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
        <Stack.Screen name="EditAPI" component={EditAPI} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="LocationScreen1" component={LocationScreen1} />
        <Stack.Screen name="EnterLocationManually" component={EnterLocationManually} />
        <Stack.Screen name="Introduction" component={Introduction1} /> 
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
