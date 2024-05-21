import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary
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
        {profileData ? (
          <>
            <View style={styles.profileContainer}>
              <Image source={profileData.avatar ? { uri: profileData.avatar } : require('../assets/app_images/account1.jpg')} style={styles.avatar} />
              <Text style={styles.name}>{profileData.name}</Text>
              <Text style={styles.email}>{profileData.email}</Text>
              <Text style={styles.phone}>{profileData.phoneNumber}</Text>
              <Text style={styles.gender}>{profileData.gender}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </>
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
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: COLORS.lightGrey,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: COLORS.OtterBrown,
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    color: COLORS.OtterBrown,
    marginBottom: 10,
  },
  gender: {
    fontSize: 16,
    color: COLORS.OtterBrown,
    marginBottom: 30,
  },
  editButton: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.WoodBrown,
    textAlign: 'center',
  },
});

export default UserProfile;
