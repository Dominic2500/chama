import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBillWave, faHandsHelping, faUniversity, faPercent } from '@fortawesome/free-solid-svg-icons';
import MemberScreen from './ContributionTable';
import { ref, set,child,get } from "firebase/database";
import DB from "./config";


const handleTopUp = () => {
  // Dummy borrow limit for demonstration
  const borrowLimit = 20000; // Replace with actual borrow limit retrieval logic if needed

  // Calculate top-up amount (25% of borrow limit)
  const topUpAmount = borrowLimit * 0.25;

  // Display alert with top-up amount
  Alert.alert(
    'Top-up Request',
    `You can top up ${topUpAmount.toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
    })} based on your borrow limit.`,
    [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ]
  );
};


const HomeScreen = ({ navigation }) => {
  const [totalContributions, setTotalContributions] = useState(25000);
  const [totalWelfare, setTotalWelfare] = useState(8000);
  const [borrowLimit, setBorrowLimit] = useState(20000);
  const [totalShares, setTotalShares] = useState(114);
  const [shareValue, setShareValue] = useState(0);

  useEffect(() => {
    const calculateShareValue = () => {
      const totalLoansAndInterest = totalContributions + totalWelfare;
      setShareValue(totalLoansAndInterest / totalShares);
    };

    calculateShareValue();
  }, [totalContributions, totalWelfare, totalShares]);

  const handleDeposit = () => {
    const formattedContributions = totalContributions.toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
    });
    const formattedWelfare = totalWelfare.toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
    });
    Alert.alert(
      'Your Contributions',
      `Your total contributions is ${formattedContributions}\nWelfare: ${formattedWelfare}`,
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]
    );
  };



  return (
    <View style={styles.container}>
      {/* Chama's Financials Area */}
      <View style={styles.financials}>
        <Text style={styles.title}>Chama's Financials</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoContainer}>
            <FontAwesomeIcon icon={faMoneyBillWave} size={24} color="#fff" />
            <Text style={styles.info}>Total Contributions: {totalContributions.toLocaleString('en-KE', {
              style: 'currency',
              currency: 'KES',
            })}</Text>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesomeIcon icon={faHandsHelping} size={24} color="#fff" />
            <Text style={styles.info}>Total Welfare: {totalWelfare.toLocaleString('en-KE', {
              style: 'currency',
              currency: 'KES',
            })}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoContainer}>
            <FontAwesomeIcon icon={faUniversity} size={24} color="#fff" />
            <Text style={styles.info}>Your Borrow Limit: {borrowLimit.toLocaleString('en-KE', {
              style: 'currency',
              currency: 'KES',
            })}</Text>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesomeIcon icon={faPercent} size={24} color="#fff" />
            <Text style={styles.info}>Share Value: {shareValue.toLocaleString('en-KE', {
              style: 'currency',
              currency: 'KES',
            })}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.depositButton]} onPress={handleDeposit}>
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.allowanceButton]} onPress={handleTopUp}>
            <Text style={styles.buttonText}>Top up Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contribution Summary Area */}
      <MemberScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  financials: {
    backgroundColor: '#6A63DD',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  info: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    elevation: 4,
  },
  depositButton: {
    backgroundColor: '#2196F3',
  },
  allowanceButton: {
    backgroundColor: '#FFC107',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;