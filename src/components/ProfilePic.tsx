import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary
import { COLORS, SPACING } from '../theme/theme';

const ProfilePic = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/app_images/account1.jpg')}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: SPACING.space_45, // Adjusted to fit image size
    width: SPACING.space_45,  // Adjusted to fit image size
    borderRadius: SPACING.space_24, // Adjusted for a circular shape
    borderWidth: 2,
    borderColor: COLORS.WhiteSmoke,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});

export default ProfilePic;
