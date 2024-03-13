// DropdownMenu.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <FontAwesomeIcon icon={icon} size={20} color="#333" />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const DropdownMenu = ({ isVisible, onToggle }) => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.navigate('LoginScreen'); // replace 'Login' with the name of your login screen
  };

  const handleDeleteAccount = () => {
    // Add your delete account logic here
  }

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.dropdownContainer}>
      <MenuItem icon={faSignOutAlt} label="Logout" onPress={handleLogout} />
      <MenuItem icon={faDownload} label="Download Minutes" onPress={handleDeleteAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 60, // Adjust the position as needed
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default DropdownMenu;
