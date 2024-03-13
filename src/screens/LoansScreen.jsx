import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ref, onValue, get } from 'firebase/database';
import DB from './config';
import { AuthContext } from './AuthContext';

const LoanScreen = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate] = useState(0.05); // 5% interest rate per month
  const repaymentPeriod = 1; // Fixed repayment period to 12 months
  const [calculatedInterest, setCalculatedInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [memberLoans, setMemberLoans] = useState([]);
  const [myLoan, setMyLoan] = useState(null);
  const [showMemberLoans, setShowMemberLoans] = useState(true);
  const { loggedInMemberId } = useContext(AuthContext);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const financeDataRef = ref(DB, 'finance');

    const fetchUserNames = async () => {
      try {
        const usersRef = ref(DB, 'users');
        const snapshot = await get(usersRef);
        const usersData = snapshot.val() || {};
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

    const unsubscribeFinanceData = onValue(financeDataRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const members = await Promise.all(
        Object.entries(data).map(async ([memberId, member]) => {
          const userName = userNames[memberId] || 'Unknown';
          return {
            id: memberId,
            name: userName,
            loanBorrowed: member.loanBorrowed,
            loanPaid: member.loanPaid,
            remainingBalance: member.remainingLoanBalance,
            totalRepayable: member.loanBorrowed + (member.loanBorrowed * interestRate * repaymentPeriod),
          };
        })
      );

      const myLoanData = members.find((member) => member.id === loggedInMemberId) || null;
      setMyLoan(myLoanData);
      setMemberLoans(members.filter((member) => member.id !== loggedInMemberId));
    });

    fetchUserNames();

    return unsubscribeFinanceData;
  }, [loggedInMemberId]);

  const calculateShareValue = () => {
    const totalLoans = memberLoans.reduce((sum, loan) => sum + loan.loanBorrowed, 0);
    const totalInterest = memberLoans.reduce((sum, loan) => sum + (loan.loanBorrowed * interestRate * repaymentPeriod), 0);
    const totalShareValue = totalLoans + totalInterest;
    const totalShares = memberLoans.length * 100; // Assuming each member has 100 shares
    return totalShareValue / totalShares;
  };

  const shareValue = calculateShareValue();

  const calculateLoanDetails = () => {
    const interest = parseFloat(loanAmount) * interestRate * repaymentPeriod;
    const total = parseFloat(loanAmount) + interest;
    setCalculatedInterest(interest);
    setTotalPayable(total);
  };

  const renderLoanItem = ({ item }) => (
    <View style={styles.loanItem}>
      <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.cell, styles.numericCell]}>{item.loanBorrowed}</Text>
      <Text style={[styles.cell, styles.numericCell]}>{item.loanPaid}</Text>
      <Text style={[styles.cell, styles.numericCell]}>{item.remainingBalance}</Text>
      <Text style={[styles.cell, styles.numericCell]}>{item.totalRepayable}</Text>
    </View>
  );

  const renderLoans = () => {
    const loansData = showMemberLoans ? memberLoans : [myLoan].filter(Boolean);
    return (
      <FlatList
        data={loansData}
        renderItem={renderLoanItem}
        keyExtractor={(item) => item.id}
        style={styles.table}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell, styles.nameCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell, styles.numericCell]}>Loan Borrowed</Text>
            <Text style={[styles.cell, styles.headerCell, styles.numericCell]}>Loans Paid</Text>
            <Text style={[styles.cell, styles.headerCell, styles.numericCell]}>Remaining Balance</Text>
            <Text style={[styles.cell, styles.headerCell, styles.numericCell]}>Total Repayable</Text>
          </View>
        }
      />
    );
  };
 return (
   <View style={styles.container}>
     <Text style={styles.title}>Loan Calculator</Text>
     <View style={styles.inputContainer}>
       <View style={styles.inputLabelContainer}>
         <Text style={styles.inputLabel}>Loan Request (KSh)---- Repayment period is 12 months</Text>
         <TextInput
           style={styles.input}
           keyboardType="numeric"
           value={loanAmount}
           onChangeText={(value) => setLoanAmount(value.replace(/[^0-9]/g, ''))}
         />
       </View>
       {/* <View style={styles.inputLabelContainer}>
         <Text style={styles.inputLabel}>Repayment Period (months)</Text>
         <TextInput
           style={[styles.input, styles.fixedInput]}
           keyboardType="numeric"
           value={repaymentPeriod.toString()}
           editable={false}
         />
       </View> */}
     </View>
     <TouchableOpacity style={styles.button} onPress={calculateLoanDetails}>
       <Text style={styles.buttonText}>Calculate</Text>
     </TouchableOpacity>
     {calculatedInterest !== 0 && (
       <View style={styles.resultContainer}>
         <Text style={styles.resultText}>Interest (5% per month): {calculatedInterest.toFixed(2)} KSh</Text>
         <Text style={styles.resultText}>Total Payable: {totalPayable.toFixed(2)} KSh</Text>
       </View>
     )}
     <View style={styles.infoRow}>
       <Text style={styles.infoText}>Share Value: {shareValue.toFixed(2)} KSh</Text>
       
     </View>
     <View style={styles.tabContainer}>
       <TouchableOpacity
         style={[styles.tabButton, showMemberLoans && styles.activeTabButton]}
         onPress={() => setShowMemberLoans(true)}
       >
         <Text style={[styles.tabText, showMemberLoans && styles.activeTabText]}>Member Loans</Text>
       </TouchableOpacity>
       <TouchableOpacity
         style={[styles.tabButton, !showMemberLoans && styles.activeTabButton]}
         onPress={() => setShowMemberLoans(false)}
       >
         <Text style={[styles.tabText, !showMemberLoans && styles.activeTabText]}>My Loans</Text>
       </TouchableOpacity>
     </View>
     {renderLoans()}
   </View>
 );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputLabelContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  table: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loanItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    textAlign: 'left',
  },
  numericCell: {
    textAlign: 'right',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});


export default LoanScreen;
