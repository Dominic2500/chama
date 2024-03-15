import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import DB from "./config";
import { ref, child, get } from "firebase/database";
import { AuthContext } from './AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);


// Function to handle login
const handleLogin = async () => {
  setLoading(true);

  // Sanitize inputs
  const sanitizedMemberId = memberId.trim();
  const sanitizedPassword = password.trim();

  if (!sanitizedMemberId || !sanitizedPassword) {
    ToastAndroid.show("Please enter Member ID and Password", ToastAndroid.SHORT);
    setLoading(false);
    return;
  }

  try {
    const usersRef = ref(DB, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const userData = Object.values(snapshot.val()).find(
        (user) => user.memberId === sanitizedMemberId
      );
      if (userData) {
        if (userData.memberId === 'CS9322' && sanitizedPassword === '12345') {
          // Admin login
          ToastAndroid.show('Admin login successful', ToastAndroid.SHORT);
          navigation.navigate('AdminMenu');
        } else if (userData.password === sanitizedPassword) {
          // Regular user login
          ToastAndroid.show('Login successful', ToastAndroid.SHORT);
          login(sanitizedMemberId); // Call the login function from AuthContext
          navigation.navigate('menu');
        } else {
          // Invalid password
          ToastAndroid.show('Invalid password', ToastAndroid.SHORT);
        }
      } else {
        // Member ID not found
        ToastAndroid.show("Member ID not found", ToastAndroid.SHORT);
      }
    } else {
      // No users found
      ToastAndroid.show("No users found", ToastAndroid.SHORT);
    }
  } catch (error) {
    // Catch Firebase errors
    ToastAndroid.show(error.message, ToastAndroid.LONG);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.loginContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <FontAwesomeIcon icon={faIdCard} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Member ID"
            value={memberId}
            onChangeText={setMemberId}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <FontAwesomeIcon icon={faLock} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.forgotLinkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotMemberID")}>
          <Text style={styles.forgotLinkText}>Forgot your Member ID?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotLinkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate("RegistrationScreen")}
          >
            <Text style={styles.signupLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
    color: "#007AFF",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  link: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupPrompt: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#555",
  },
  signupLinkText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  forgotLinkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  forgotLinkText: {
    color: "#007AFF",
    fontWeight: "500",
    marginRight: 10,
  },
});

export default LoginScreen;
