import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop?email=${user.email}`);
          const data = await response.json();
          if (data.length > 0) {
            setProfileData(data[0]);
          } else {
            Alert.alert("Error", "No profile data found for the logged-in user.");
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          Alert.alert("Error", "There was an error fetching your profile data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user?.email]);

  const handleEditProfile = () => {
    navigation.navigate('EditUserProfile');
  };

  const handleBackPress = () => {
    navigation.navigate('Tab');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.WoodBrown} />
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../assets/app_images/coffeeLogin3.jpg')}  // Adjust the path as necessary
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
        </TouchableOpacity>
        {profileData ? (
          <View style={styles.profileContainer}>
            <Image source={profileData.avatar ? { uri: profileData.avatar } : require('../assets/app_images/account1.jpg')} style={styles.avatar} />
            <Text style={styles.name}>{profileData.name}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profileData.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{profileData.phoneNumber}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{profileData.address}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{profileData.gender}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.errorText}>No profile data found.</Text>
        )}
      </View>
    </ImageBackground>
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
    padding: SPACING.space_20,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: SPACING.space_20,
    width: '90%',
    borderRadius: SPACING.space_10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.space_20,
    backgroundColor: COLORS.lightGrey,
  },
  name: {
    fontSize: FONTSIZE.size_28,
    fontWeight: 'bold',
    marginBottom: SPACING.space_20,
    color: COLORS.black,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.space_10,
    justifyContent: 'flex-start',
    width: '100%',
  },
  label: {
    fontSize: FONTSIZE.size_16,
    fontWeight: 'bold',
    color: COLORS.OtterBrown,
    marginRight: SPACING.space_10,
    width: '30%',
  },
  value: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.OtterBrown,
    width: '70%',
  },
  editButton: {
    height: 50,
    width: '100%',
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.space_20,
  },
  editButtonText: {
    fontSize: FONTSIZE.size_16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  errorText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.WoodBrown,
    textAlign: 'center',
  },
});

export default UserProfile;
