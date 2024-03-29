import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue, remove, set, push } from 'firebase/database'; // Import push function
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import DB from './config';

const MembersScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const usersRef = ref(DB, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const usersList = Object.values(usersData);
      setUsers(usersList);
      setFilteredUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);




  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fullName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members Information</Text>
      </View>
      <View style={styles.search}>
        <TextInput
          placeholder="Search by name"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>
      {filteredUsers.length === 0 ? (
        <Text style={styles.noRecordsText}>No members found</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerCell]}>Name</Text>
              <Text style={[styles.cell, styles.headerCell]}>Phone Number</Text>
            </View>
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.memberId}
          style={styles.table}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  uploadButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: {
    marginRight: 10,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  noRecordsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
});

export default MembersScreen;
