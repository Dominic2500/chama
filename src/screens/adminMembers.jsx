import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue, remove, set, push } from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import DB from './config';

const AdminMemberScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const usersRef = ref(DB, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const usersList = Object.values(usersData).filter(user => user.memberId !== 'CS9322');
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

  const deleteMember = async (memberId) => {
    try {
      const userRef = ref(DB, `users/${memberId}`);
      await remove(userRef); // Delete user data
      const financeRef = ref(DB, `finance/${memberId}`);
      await remove(financeRef); // Delete finance data
      Alert.alert("Success", "Member deleted successfully");
      const updatedUsers = users.filter(user => user.memberId !== memberId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting member:", error);
      Alert.alert("Error", "Failed to delete member");
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        const fileUri = result.uri;
        const fileName = result.name;

        const storage = getStorage();
        const storageRef = ref(storage, `files/${fileName}`);

        const fileToUpload = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

        if (fileToUpload.length > 0) {
          setUploading(true);

          const uploadTask = uploadBytesResumable(storageRef, new Uint8Array(Buffer.from(fileToUpload, 'base64')));

          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, (error) => {
            console.error('Error uploading file:', error);
            setUploading(false);
            Alert.alert('Error', 'Failed to upload file');
          }, async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const currentDate = new Date();
            const dateString = currentDate.toISOString();

            const meetingsRef = ref(DB, 'meetings');
            await set(push(meetingsRef), {
              url: downloadURL,
              date: dateString,
            });

            setUploading(false);
            setUploadProgress(0);
            Alert.alert('Success', 'File uploaded successfully');
          });
        } else {
          Alert.alert('No file selected for upload');
        }
      }
    } catch (error) {
      Alert.alert('Error handling file upload', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fullName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMember(item.memberId)}>
        <Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.uploadButtonText}>Upload Minutes</Text>
        </TouchableOpacity>
      </View>
      {uploading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {uploadProgress.toFixed(2)}%</Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
      {filteredUsers.length === 0 ? (
        <Text style={styles.noRecordsText}>No members found</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              <Text style={[styles.cell, styles.headerCell]}>Name</Text>
              <Text style={[styles.cell, styles.headerCell]}>Phone Number</Text>
              <Text style={[styles.cell, styles.headerCell]}></Text>
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
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  uploadButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressText: {
    marginRight: 10,
    fontSize: 16,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  noRecordsText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 30,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: "#ff6347",
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default AdminMemberScreen;