import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Tạo OTP ngẫu nhiên
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup Error", "Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Signup Error", "Password must contain letters, numbers, and special characters");
      return;
    }

    try {
      const otp = generateOtp();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      Alert.alert("Verification Email Sent", `Please check your email for the verification code. OTP: ${otp}`);
      navigation.navigate('Verify', { email, otp });
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground 
        source={require('../assets/app_images/coffeeLogin3.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.signupContainer}>
            <Text style={styles.header}>Sign Up</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Enter your password"
                secureTextEntry={passwordVisibility}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityBtn}>
                <Text style={styles.visibilityText}>{passwordVisibility ? 'Show' : 'Hide'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={passwordVisibility}
                autoCapitalize="none"
              />
            </View>
            <Button color="#836953" title="Sign Up" onPress={handleSignup} />
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButton}>Log in</Text>
              </TouchableOpacity>
            </View>
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
  signupContainer: {
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
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '85%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 1,
  },
  visibilityBtn: {
    marginLeft: 10,
  },
  visibilityText: {
    color: '#836953',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
  },
  loginButton: {
    fontSize: 16,
    color: '#836953',
    fontWeight: 'bold',
  }
});

export default SignupScreen;

