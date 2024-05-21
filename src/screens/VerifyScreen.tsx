import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

type VerifyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Verify'>;
type VerifyScreenRouteProp = RouteProp<RootStackParamList, 'Verify'>;

const VerifyScreen = () => {
  const [inputOtp, setInputOtp] = useState('');
  const navigation = useNavigation<VerifyScreenNavigationProp>();
  const route = useRoute<VerifyScreenRouteProp>();
  const { email, otp } = route.params;

  const handleVerify = () => {
    if (inputOtp === otp) {
      Alert.alert("Verification Successful", "You have been successfully signed up.");
      navigation.navigate('Home');
    } else {
      Alert.alert("Verification Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground 
        source={require('../assets/app_images/coffeeLogin3.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.verifyContainer}>
            <Text style={styles.header}>Verify Email</Text>
            <Text style={styles.subHeader}>Enter the 4-digit OTP sent to {email}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputOtp}
              value={inputOtp}
              placeholder="Enter OTP"
              keyboardType="numeric"
            />
            <Button color="#836953" title="Verify" onPress={handleVerify} />
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  header: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#836953',
    fontWeight: 'bold',
  },
});

export default VerifyScreen;

