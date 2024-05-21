import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';

const LocationScreen1 = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleEnterLocationManually = () => {
    navigation.navigate('EnterLocationManually');
  };

  const handleBackPress = () => {
    navigation.navigate('EditUserProfile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/app_images/icons8-location-100.png')}
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>What is Your Location?</Text>
      <Text style={styles.subtitle}>To Find Our Café.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleEnterLocationManually}
      >
        <Text style={styles.buttonText}>Enter Location Manually</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.WoodBrown,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationScreen1;
