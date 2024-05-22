import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary

const CardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [pin, setPin] = useState('');

  const handleSave = async () => {
    if (cardNumber && cardholderName && expirationDate && cvv && pin) {
      try {
        await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.email,
            cardNumber,
            cardholderName,
            expirationDate,
            cvv,
            pin,
          }),
        });
        Alert.alert('Card has been successfully saved');
        navigation.navigate('MyWallet');
      } catch (error) {
        console.error('Error saving card:', error);
      }
    } else {
      Alert.alert('Error', 'Please fill out all the information');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MyWallet')}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Enter Your Card Information</Text>
      <Text style={styles.subTitle}>Please fill in the details below to save your card information.</Text>
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="1234 5678 9101 1121"
        placeholderTextColor={COLORS.lightGrey}
      />
      <Text style={styles.label}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        value={cardholderName}
        onChangeText={setCardholderName}
        placeholder="Nguyen Van A"
        placeholderTextColor={COLORS.lightGrey}
      />
      <Text style={styles.label}>Expiration Date (MM/YY)</Text>
      <TextInput
        style={styles.input}
        value={expirationDate}
        onChangeText={setExpirationDate}
        maxLength={5}
        placeholder="12/25"
        placeholderTextColor={COLORS.lightGrey}
      />
      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={3}
        value={cvv}
        onChangeText={setCvv}
        placeholder="123"
        placeholderTextColor={COLORS.lightGrey}
      />
      <Text style={styles.label}>PIN</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        maxLength={4}
        keyboardType="numeric"
        value={pin}
        onChangeText={setPin}
        placeholder="****"
        placeholderTextColor={COLORS.lightGrey}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyWallet')}>
        <Text style={styles.linkText}>Back to My Wallet</Text>
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
  label: {
    fontSize: FONTSIZE.size_18,
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
  saveButton: {
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

export default CardScreen;
