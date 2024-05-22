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

  const handleMyWallet = () => {
    navigation.navigate('MyWallet');
    onClose();
  };

  const handlePoints = () => {
    navigation.navigate('PointScreen');
    onClose();
  };

  return (
    <View style={styles.sideMenuContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image
          source={require('../assets/app_images/icons8-left-arrow-100.png')}  // Adjust the path as necessary
          style={styles.closeButtonIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleUserProfile}>
        <Image
          source={require('../assets/app_images/icons8-user-profile-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>User Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
        <Image
          source={require('../assets/app_images/icons8-edit-property-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleEditAPI}>
        <Image
          source={require('../assets/app_images/icons8-rest-api-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>Edit API</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleMyWallet}>
        <Image
          source={require('../assets/app_images/icons8-wallet-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>My Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handlePoints}>
        <Image
          source={require('../assets/app_images/icons8-point-spread-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>Points</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Image
          source={require('../assets/app_images/icons8-logout-100.png')}  // Adjust the path as necessary
          style={styles.menuItemIcon}
        />
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.primaryGreyHex,
    padding: SPACING.space_20,
    zIndex: 1000,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.space_20,
  },
  closeButtonIcon: {
    width: SPACING.space_36,
    height: SPACING.space_36,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.space_20,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_15,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  menuItemIcon: {
    width: SPACING.space_24,
    height: SPACING.space_24,
    marginRight: SPACING.space_10,
  },
  menuItemText: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryGreyHex,
    fontWeight: 'bold',
  },
});

export default SideMenu;
