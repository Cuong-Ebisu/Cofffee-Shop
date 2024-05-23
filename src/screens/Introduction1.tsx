import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';

const Introduction1 = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleGetStartedPress = () => {
    navigation.navigate('Login');
  };

  const handleSignInPress = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/app_images/coffeeLogin3.jpg')} 
        style={styles.backgroundImage} 
      />
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Step into Our <Text style={styles.highlight}>World of Coffee Delight!</Text></Text>
          <Text style={styles.subtitle}>Discover the finest coffee experiences crafted just for you.</Text>
        </View>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStartedPress}>
          <Text style={styles.getStartedButtonText}>Let's Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignInPress}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: width,
    height: height * 0.6,
    resizeMode: 'cover',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    paddingTop: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
    marginTop: -50,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.space_20,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: SPACING.space_10,
  },
  highlight: {
    color: COLORS.WoodBrown,
  },
  subtitle: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.WoodBrown,
    textAlign: 'center',
    marginBottom: SPACING.space_30,
    marginTop: 20,
  },
  getStartedButton: {
    backgroundColor: COLORS.WoodBrown,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_40,
    borderRadius: SPACING.space_10,
    marginBottom: SPACING.space_20,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: FONTSIZE.size_16,
    fontWeight: 'bold',
  },
  signInText: {
    color: COLORS.WoodBrown,
    fontSize: FONTSIZE.size_14,
  },
  signInLink: {
    color: COLORS.WoodBrown,
    fontWeight: 'bold',
  },
});

export default Introduction1;
