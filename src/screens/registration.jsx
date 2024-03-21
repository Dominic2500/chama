import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faIdCard, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { ref, set, get } from "firebase/database";
import DB from "./config";

const generateMemberId = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const CS = "CS";
  return CS + randomNumber.toString();
};

const RegistrationScreen = () => {
  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState(generateMemberId());
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const clearInputFields = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setMemberId(generateMemberId());
  };

  const handleRegister = async () => {
    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      phoneNumber.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      Alert.alert("Error", "Full name should only contain letters and spaces");
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Phone number should be 10 digits");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const userId = Date.now().toString();

      await set(ref(DB, "users/" + userId), {
        fullName,
        memberId,
        email,
        phoneNumber,
        password,
      });

      await initializeFinanceDataForUser(memberId);

      Alert.alert("Success", "Registration successful");
      clearInputFields();
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeFinanceDataForUser = async (memberId) => {
    try {
      console.log(`Initializing finance data for memberId: ${memberId}`);

      const financeDataPath = "finance/" + memberId;
      const financeDataSnapshot = await get(ref(DB, financeDataPath));
      const financeDataExists = financeDataSnapshot.exists();

      if (!financeDataExists) {
        console.log(`Finance data doesn't exist for memberId ${memberId}, initializing...`);

        const contributions = Math.floor(Math.random() * 9000) + 1000;
        const paid = Math.random() < 0.5;
        const balance = contributions - Math.floor(Math.random() * (contributions - 1500));
        const loanBorrowed = 0.0;
        const loanPaid = 0.0;
        const remainingLoanBalance = 0.0;
        const totalPayable = 0.0;
        const welfare = 1500;

        const financeData = {
          contributions,
          paid: paid ? "yes" : "no",
          balance,
          dateOfContribution: "14-3-2023",
          loanBorrowed,
          loanPaid,
          remainingLoanBalance,
          totalPayable,
          welfare,
        };

        console.log(`Finance data for memberId ${memberId}:`, financeData);

        await set(ref(DB, financeDataPath), financeData);
        console.log(`Finance data written for memberId ${memberId}`);
      } else {
        console.log(`Finance data already exists for memberId ${memberId}`);
      }
    } catch (error) {
      console.error(`Error initializing finance data for memberId ${memberId}:`, error);
      Alert.alert("Error", `Error initializing finance data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registration</Text>
        <Text style={styles.label}>Member ID</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faIdCard} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            value={memberId}
            editable={false}
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faEnvelope} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faIdCard} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faIdCard} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faLock} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faLock} size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.linkText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  link: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegistrationScreen;
