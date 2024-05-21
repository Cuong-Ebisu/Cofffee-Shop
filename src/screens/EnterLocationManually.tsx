import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary
import { useAuth } from './AuthContext';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';

const EnterLocationManually = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [cityProvince, setCityProvince] = useState('');
  const [country] = useState('Vietnam');

  const handleSaveAddress = async () => {
    if (!houseNumber || !streetName || !ward || !district || !cityProvince) {
      Alert.alert("Incomplete Information", "Please fill out all fields.");
      return;
    }

    if (user?.email) {
      const address = `${houseNumber} ${streetName}, ${ward}, ${district}, ${cityProvince}, ${country}`;
      const profileData = {
        email: user.email,
        address,
      };

      try {
        const response = await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop?email=${user.email}`);
        const data = await response.json();
        if (data.length === 0) {
          await fetch('https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          });
        } else {
          const existingUser = data[0];
          await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop/${existingUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          });
        }
        Alert.alert("Address Saved", "Your address has been saved successfully.");
        navigation.navigate('Tab');
      } catch (error) {
        console.error('Error saving address:', error);
        Alert.alert("Error", "There was an error saving your address. Please try again.");
      }
    } else {
      Alert.alert("Error", "No logged-in user found.");
    }
  };

  const handleBackPress = () => {
    navigation.navigate('LocationScreen1');
  };

  const handleNavigateToTab = () => {
    navigation.navigate('Tab');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={handleNavigateToTab}>
        <Image source={require('../assets/app_images/icons8-home-100.png')} style={styles.homeIcon} />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/app_images/icons8-location-100.png')}
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>Enter Your Address</Text>
      <TextInput
        style={styles.input}
        placeholder="House Number"
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setHouseNumber}
        value={houseNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Name"
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setStreetName}
        value={streetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Ward/Commune"
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setWard}
        value={ward}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setDistrict}
        value={district}
      />
      <TextInput
        style={styles.input}
        placeholder="City/Province"
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setCityProvince}
        value={cityProvince}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        placeholderTextColor={COLORS.lightGrey}
        value={country}
        editable={false}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>Save Address</Text>
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
  homeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  homeIcon: {
    width: 45,
    height:45,
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
    marginBottom: 16,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    borderRadius: SPACING.space_10,
    paddingHorizontal: SPACING.space_10,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: COLORS.WoodBrown,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnterLocationManually;
