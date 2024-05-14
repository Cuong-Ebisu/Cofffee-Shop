import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {
  createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, deleteUser
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (user && user.emailVerified) {
        navigation.navigate('Login');
      }
    }); // Return the unsubscribe function from onAuthStateChanged
  }, []);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long and include letters, numbers, and special characters.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        Alert.alert(
          "Verification Email Sent",
          "Please check your email to verify your account.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Login'), // Ensure we navigate back to login
            },
          ]
        );
      }
    } catch (error: any) {
      setError(error.message);
      if (error.code === 'auth/email-already-in-use' && auth.currentUser) {
        await deleteUser(auth.currentUser); // Delete unverified user attempt
      }
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
          <View style={styles.loginContainer}>
            <Text style={styles.header}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry
            />
            <Button color="#836953" title="Sign Up" onPress={handleSignup} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignupScreen;