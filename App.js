import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/splashscreen';
import LoginScreen from './src/screens/login';
import RegistrationScreen from './src/screens/registration';
import Menu from './src/screens/menu';
import AdminMenu from './src/screens/adminMenu';
import ForgotMemberIDScreen from './src/screens/ForgotMemberIDScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { AuthProvider } from './src/screens/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          <Stack.Screen name="menu" component={Menu} />
          <Stack.Screen name="AdminMenu" component={AdminMenu} />
          <Stack.Screen name="ForgotMemberID" component={ForgotMemberIDScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}