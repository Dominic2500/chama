import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const MembersScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const usersList = usersData ? Object.values(usersData) : [];
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
    marginBottom: 20,
  },
  searchInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
});

export default MembersScreen;