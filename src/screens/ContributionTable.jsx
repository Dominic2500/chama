import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DB from './config';
import { ref, child, get } from 'firebase/database';

const MemberScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financeRef = ref(DB, 'finance');
        const snapshot = await get(financeRef);
        const financialData = snapshot.val();
        const formattedData = Object.entries(financialData).map(([key, value]) => ({
          memberId: key,
          ...value,
        }));
        setData(formattedData);
        setFilteredData(formattedData);
        calculateTotalContributions(formattedData);
        setTotalMembers(formattedData.length);
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    const fetchUserNames = async () => {
      try {
        const usersRef = ref(DB, 'users');
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();
        const userNamesMap = {};
        for (const userId in usersData) {
          const user = usersData[userId];
          userNamesMap[user.memberId] = user.fullName;
        }
        setUserNames(userNamesMap);
      } catch (error) {
        console.error('Error fetching user names from Firebase:', error);
      }
    };

    fetchData();
    fetchUserNames();
  }, []);

  const calculateTotalContributions = (data) => {
    const total = data.reduce((acc, item) => acc + item.contributions, 0);
    setTotalContributions(total);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const selectedDateString = date.toISOString().split('T')[0];
    setSelectedDate(date);
    setFilteredData(data.filter((item) => item.dateOfContribution === selectedDateString));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredData(data.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())));
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{userNames[item.memberId]}</Text>
      <Text style={styles.cell}>{item.paid}</Text>
      <Text style={styles.cell}>{item.balance}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contribution Summary</Text>
        <Text style={styles.subtitle}>Total Contributions KES {totalContributions}</Text>
        <Text style={styles.subtitle}>Total Members {totalMembers}</Text>
      </View>
      <View style={styles.search}>
        <TextInput
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={showDatePicker}>
          <FontAwesomeIcon icon={faCalendar} size={24} style={styles.calendarIcon} />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      {selectedDate && (
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateText}>Contributions for meeting date: {selectedDate.toLocaleDateString()}</Text>
        </View>
      )}
      {filteredData.length === 0 ? (
        <Text style={styles.noRecordsText}>No contributions found for the selected date</Text>
      ) : (
        <FlatList
          data={filteredData}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerCell]}>Name</Text>
              <Text style={[styles.cell, styles.headerCell]}>Paid</Text>
              <Text style={[styles.cell, styles.headerCell]}>Balance</Text>
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
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  calendarIcon: {
    color: '#007BFF',
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
  dateTextContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noRecordsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default MemberScreen;
