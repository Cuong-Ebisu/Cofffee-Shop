import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary
import { useAuth } from './AuthContext';

const EditUserProfile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [gender, setGender] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBackPress = () => {
    navigation.navigate('Tab');
  };

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setModalVisible(false);
  };

  const handleCompleteProfile = async () => {
    if (user?.email) {
      const profileData = {
        email: user.email,
        name,
        phoneNumber,
        gender,
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
        Alert.alert("Profile Updated", "Your profile has been updated successfully.");
        navigation.navigate('Tab');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert("Error", "There was an error updating your profile. Please try again.");
      }
    } else {
      Alert.alert("Error", "No logged-in user found.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Complete Your Profile</Text>
      <Text style={styles.subTitle}>
        Don’t worry, only you can see your personal data. No one else will be able to see it.
      </Text>
      <View style={styles.avatarContainer}>
        <Image source={require('../assets/app_images/account1.jpg')} style={styles.avatar} />
        <TouchableOpacity style={styles.editIconContainer}>
          <Image source={require('../assets/app_images/icons8-edit-64.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <TextInput 
        style={styles.input} 
        placeholder="Ex. John Doe" 
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setName}
        value={name}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Enter Phone Number" 
        keyboardType="phone-pad" 
        placeholderTextColor={COLORS.lightGrey}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <TouchableOpacity style={styles.genderSelect} onPress={() => setModalVisible(true)}>
        <Text style={styles.genderText}>{gender ? gender : 'Select Gender'}</Text>
        <Image source={require('../assets/app_images/icons8-dropdown-50.png')} style={styles.dropdownIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={handleCompleteProfile}>
        <Text style={styles.completeButtonText}>Complete Profile</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={() => handleGenderSelect('Male')}>
            <Text style={styles.modalOptionText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => handleGenderSelect('Female')}>
            <Text style={styles.modalOptionText}>Female</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.space_20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGrey,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
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
  genderSelect: {
    height: 50,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    borderRadius: SPACING.space_10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.space_10,
    marginBottom: SPACING.space_20,
  },
  genderText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
  },
  dropdownIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.lightGrey,
  },
  completeButton: {
    height: 50,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    margin: SPACING.space_20,
    borderRadius: SPACING.space_10,
    padding: SPACING.space_20,
  },
  modalOption: {
    paddingVertical: SPACING.space_10,
  },
  modalOptionText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default EditUserProfile;
