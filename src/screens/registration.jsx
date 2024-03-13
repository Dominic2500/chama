import React, { useState } from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 StyleSheet,
 ActivityIndicator, // Import ActivityIndicator for spinner
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faIdCard, faLock } from "@fortawesome/free-solid-svg-icons";
import Toast from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { ref, set } from "firebase/database";
import DB from "./config";

// Function to generate a 4-digit member ID
const generateMemberId = () => {
 const randomNumber = Math.floor(1000 + Math.random() * 9000);
 const CS = "CS";
 return CS+randomNumber.toString();
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

  // Function to clear all input fields
  const clearInputFields = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setMemberId(generateMemberId()); // Generate a new member ID
  };

// Function to handle registration
const handleRegister = async () => {
  // Check if passwords match
  if (password !== confirmPassword) {
    ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
    return; // Exit the function if passwords don't match
  }

  setLoading(true); // Show spinner

  try {
    // Generate a unique user ID using the current timestamp
    const userId = Date.now().toString();

    // Write the user data to the Firebase Realtime Database
    await set(ref(DB, "users/" + userId), {
      fullName,
      memberId,
      email,
      phoneNumber,
      password,
    });

    // Initialize finance data for the new user
    await initializeFinanceDataForUser(memberId);

    ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
    // Clear input fields after successful registration
    clearInputFields();
    // Navigate to the login screen after successful registration
    navigation.navigate("login");
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  } finally {
    setLoading(false); // Hide spinner
  }
};

// Function to initialize finance data for a new user
const initializeFinanceDataForUser = async (memberId) => {
  try {
    console.log(`Initializing finance data for memberId: ${memberId}`);

    // Check if finance data exists for the current user
    const financeDataPath = "finance/" + memberId;
    const financeDataSnapshot = await get(child(ref(DB), financeDataPath));
    const financeDataExists = financeDataSnapshot.exists();

    if (!financeDataExists) {
      console.log(`Finance data doesn't exist for memberId ${memberId}, initializing...`);

      // Initialize finance data for the new user
      const contributions = Math.floor(Math.random() * 9000) + 1000; // Random contribution amount between 1,000 and 10,000 KSH
      const paid = Math.random() < 0.5; // Random paid status (true or false)
      const balance = contributions - Math.floor(Math.random() * (contributions - 1500)); // Random balance between 1,500 and contributions
      const loanBorrowed = Math.floor(Math.random() * 50000); // Random loan amount (up to 50,000 KSH)
      const loanPaid = Math.floor(Math.random() * loanBorrowed); // Random loan paid amount (up to the borrowed amount)
      const remainingLoanBalance = loanBorrowed - loanPaid;
      const totalPayable = loanBorrowed + loanBorrowed * 0.05; // Loan borrowed + 5% interest
      const welfare = 1500; // Constant welfare amount of 1,500 KSH

      const financeData = {
        contributions,
        paid: paid ? "yes" : "no",
        balance,
        dateOfContribution: "14-3-2023", // Static date for this example
        loanBorrowed,
        loanPaid,
        remainingLoanBalance,
        totalPayable,
        welfare,
      };

      console.log(`Finance data for memberId ${memberId}:`, financeData);

      // Write finance data to the Firebase Realtime Database
      await set(ref(DB, financeDataPath), financeData);
      console.log(`Finance data written for memberId ${memberId}`);
    } else {
      console.log(`Finance data already exists for memberId ${memberId}`);
    }
  } catch (error) {
    console.error(`Error initializing finance data for memberId ${memberId}:`, error);
    ToastAndroid.show(`Error initializing finance data: ${error.message}`, ToastAndroid.SHORT);
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
           editable={false} // Disable editing for member ID
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
           keyboardType="email-address" // Use email keyboard type
           autoCapitalize="none" // Disable auto-capitalization
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
           keyboardType="phone-pad" // Use phone keyboard type
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
       {loading ? ( // Show spinner if loading
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
     <Toast />
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