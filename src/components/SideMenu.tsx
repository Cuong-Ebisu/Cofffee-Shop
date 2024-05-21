import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary
import { COLORS, SPACING, FONTSIZE } from '../theme/theme';

interface SideMenuProps {
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onClose }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens, user data)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleEditProfile = () => {
    navigation.navigate('EditUserProfile');
    onClose();
  };

  const handleEditAPI = () => {
    navigation.navigate('EditAPI');
    onClose();
  };

  const handleUserProfile = () => {
    navigation.navigate('UserProfile');
    onClose();
  };

  return (
    <View style={styles.SideMenuContainer}>
      <TouchableOpacity style={styles.CloseButton} onPress={onClose}>
        <Image
          source={require('../assets/app_images/icons8-left-arrow-100.png')}  // Adjust the path as necessary
          style={styles.CloseButtonIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuItem} onPress={handleUserProfile}>
        <Text style={styles.MenuItemText}>User Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuItem} onPress={handleEditProfile}>
        <Text style={styles.MenuItemText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuItem} onPress={handleEditAPI}>
        <Text style={styles.MenuItemText}>Edit API</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuItem} onPress={handleLogout}>
        <Text style={styles.MenuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  SideMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.primaryGreyHex,
    padding: SPACING.space_20,
    zIndex: 1000,
  },
  CloseButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.space_20,
  },
  CloseButtonIcon: {
    width: SPACING.space_36,
    height: SPACING.space_36,
  },
  MenuItem: {
    marginBottom: SPACING.space_20,
  },
  MenuItemText: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
});

export default SideMenu;
