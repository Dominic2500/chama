import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// Import your screen components
import HomeScreen from './HomeScreen';
import AdminMemberScreen from './adminMembers';
import AdminLoanScreen from './adminLoanScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const AdminMenu = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Members"
        component={AdminMemberScreen}
        options={{
          tabBarLabel: 'Members',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Loans"
        component={AdminLoanScreen}
        options={{
          tabBarLabel: 'Loans',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="money" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminMenu;
