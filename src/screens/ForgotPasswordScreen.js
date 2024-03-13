import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';
import { ref, query, orderByChild, equalTo, once, get } from 'firebase/database';
import DB from './config';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRetrievePassword = async () => {
    setLoading(true);

    try {
      const userQuery = query(ref(DB, 'users'), orderByChild('email'), equalTo(email));
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const userData = Object.values(snapshot.val())[0];
        const password = userData.password;

        Alert.alert('Password Retrieved', `Your Password is: ${password}`, [
          { text: 'Copy', onPress: () => copyToClipboard(password) },
          { text: 'OK', onPress: () => navigation.navigate("LoginScreen") },
        ]);
      } else {
        Alert.alert('Error', 'No user found with the provided email address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve password');
      console.error('Error retrieving password:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setString(text);
      Alert.alert(
        'Success',
        'Password copied to clipboard',
        [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy password to clipboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleRetrievePassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Retrieving...' : 'Retrieve Password'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '80%',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;