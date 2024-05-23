import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary

const MyWalletScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [amount, setAmount] = useState('');
  const [cardNumberExists, setCardNumberExists] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const checkCardNumber = async () => {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0 && data[0].cardNumber) {
          setCardNumberExists(true);
          setCurrentBalance(data[0].amount || 0); // Set current balance if exists
        } else {
          Alert.alert('You do not have a debit card', 'Please enter your debit card information');
          navigation.navigate('CardScreen');
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    checkCardNumber();
  }, [user?.email, navigation]);

  const handleRecharge = async () => {
    if (cardNumberExists) {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();

        if (data.length > 0) {
          const existingEntry = data[0];
          const updatedAmount = existingEntry.amount ? parseFloat(existingEntry.amount) + parseFloat(amount) : parseFloat(amount);

          await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${existingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: updatedAmount,
            }),
          });

          Alert.alert('Top-up Successful', `You have topped up $${amount}`);
          setCurrentBalance(updatedAmount);
        } else {
          await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user?.email,
              amount: parseFloat(amount),
            }),
          });

          Alert.alert('Top-up Successful', `You have topped up $${amount}`);
          setCurrentBalance(parseFloat(amount));
        }

        setAmount('');
      } catch (error) {
        console.error('Error recharging wallet:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Wallet</Text>
      <Text style={styles.subTitle}>Manage your wallet and recharge easily.</Text>
      <Text style={styles.balanceLabel}>Current Balance: ${currentBalance.toFixed(2)}</Text>
      <Text style={styles.label}>Enter Amount ($)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        placeholderTextColor={COLORS.lightGrey}
      />
      <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
        <Text style={styles.buttonText}>Recharge</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CardScreen')}>
        <Text style={styles.linkText}>Enter Debit Card Information</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginBottom: SPACING.space_20,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.space_10,
  },
  subTitle: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginBottom: SPACING.space_30,
  },
  balanceLabel: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.space_20,
  },
  label: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
    marginBottom: SPACING.space_10,
  },
  input: {
    height: 50,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    borderRadius: SPACING.space_10,
    paddingHorizontal: SPACING.space_10,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
    marginBottom: SPACING.space_20,
  },
  rechargeButton: {
    height: 50,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.space_20,
  },
  buttonText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.white,
  },
  linkText: {
    color: COLORS.WoodBrown,
    fontSize: FONTSIZE.size_16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default MyWalletScreen;
