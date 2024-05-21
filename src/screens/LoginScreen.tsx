import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const checkAndAddEmailToAPI = async (email: string) => {
    try {
      const response = await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop?email=${email}`);
      const data = await response.json();
      if (data.length === 0) {
        await fetch('https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
      }
    } catch (error) {
      console.error('Error checking or adding email to API:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await checkAndAddEmailToAPI(email);
      navigation.navigate('Tab'); // Navigate to TabNavigator which contains the HomeScreen
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
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
          <View style={styles.loginContainer}>
            <Text style={styles.header}>Login</Text>
            <Text style={styles.header2}>Hi! Welcome back, you've been missed</Text>
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
            <Button color="#836953" title="Log In" onPress={handleLogin} />
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.registerButton}>Sign up</Text>
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
  loginContainer: {
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
  header2: {
    fontSize: 16,
    marginBottom: 10,
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  registerText: {
    fontSize: 16,
  },
  registerButton: {
    fontSize: 16,
    color: '#836953',
    fontWeight: 'bold',
  }
});

export default LoginScreen;
