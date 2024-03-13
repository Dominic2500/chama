import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUserCircle,
  faLock,
  faCog,
  faSignOutAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import DropdownMenu from "./DropdownMenu";
import DB from "./config";
import { AuthContext } from "./AuthContext";
import { ref, update, query, orderByChild, equalTo, onValue } from "firebase/database";
export default class ProfileScreen extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isDropdownVisible: false,
      fullName: "",
      email: "",
      phoneNumber: "",
      memberId: "",
      password: "",
      loading: false,
      showSaveButton: false,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    const { loggedInMemberId } = this.context;
    const usersRef = ref(DB, "users");
    const userQuery = query(usersRef, orderByChild("memberId"), equalTo(loggedInMemberId));
  
    // Fetch user data based on the logged-in member ID
    onValue(userQuery, (snapshot) => {
      if (snapshot.exists()) {
        const userData = Object.values(snapshot.val())[0];
        this.setState({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          memberId: userData.memberId,
          password: userData.password,
        });
      } else {
        ToastAndroid.show("Error retrieving user data", ToastAndroid.SHORT);
      }
    }, (error) => {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    });
  };

  toggleDropdown = () => {
    this.setState({ isDropdownVisible: !this.state.isDropdownVisible });
  };

  handleInputChange = (field, value) => {
    this.setState({ [field]: value, showSaveButton: true });
  };

  handleSaveChanges = () => {
    this.setState({ loading: true });

    const { loggedInMemberId } = this.context;
    const { fullName, email, phoneNumber, password } = this.state;
    const updates = {
      fullName,
      email,
      phoneNumber,
      password,
    };

    update(ref(DB, `users/${loggedInMemberId}`), updates)
      .then(() => {
        ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
        this.setState({ loading: false, showSaveButton: false });
      })
      .catch((error) => {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      fullName,
      email,
      phoneNumber,
      memberId,
      password,
      loading,
      showSaveButton,
    } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={require("../myAssets/user.png")}
              style={styles.avatar}
            />
            <TextInput
              placeholder="Enter your full name"
              style={styles.usernameInput}
              value={fullName}
              onChangeText={(text) => this.handleInputChange("fullName", text)}
            />
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <FontAwesomeIcon
                icon={faEnvelope}
                size={16}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                value={email}
                onChangeText={(text) => this.handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <FontAwesomeIcon
                icon={faPhone}
                size={16}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your phone number"
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => this.handleInputChange("phoneNumber", text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Member ID</Text>
            <View style={styles.inputWrapper}>
              <FontAwesomeIcon
                icon={faUserCircle}
                size={16}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                placeholder="Member ID"
                style={styles.input}
                value={memberId}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <FontAwesomeIcon
                icon={faLock}
                size={16}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                placeholder="********"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={(text) => this.handleInputChange("password", text)}
              />
            </View>
          </View>

          {/* Save Button */}
          {showSaveButton && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={this.handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Settings Icon */}
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={this.toggleDropdown}
          >
            <FontAwesomeIcon icon={faCog} size={24} color="#333" />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          <DropdownMenu
            isVisible={this.state.isDropdownVisible}
            onToggle={this.toggleDropdown}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  usernameInput: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    width: "80%",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f7f7f7",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "purple",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});