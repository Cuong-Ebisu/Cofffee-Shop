import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App'; // Adjust the path as necessary

const PointScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          setPoints(data[0].points || 0);
        }
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    fetchPoints();
  }, [user?.email]);

  const handleRedeem = async () => {
    if (points < 10) {
      Alert.alert('Insufficient Points', 'You do not have enough points.');
    } else {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          const existingEntry = data[0];
          const updatedPoints = points - 10;

          await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${existingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              points: updatedPoints,
            }),
          });

          setPoints(updatedPoints);
          Alert.alert('Congratulations', 'You have been awarded 1 cup of coffee and it will be delivered to your home.');
        }
      } catch (error) {
        console.error('Error redeeming points:', error);
        Alert.alert('Error', 'There was an error processing your redemption.');
      }
    }
  };

  const renderCups = () => {
    const cups = [];
    for (let i = 0; i < 10; i++) {
      cups.push(
        <Image
          key={i}
          source={
            i < points
              ? require('../assets/app_images/icons8-coffee-cup-100-yellow.png')  // Adjust the path as necessary
              : require('../assets/app_images/icons8-coffee-cup-100-black.png')  // Adjust the path as necessary
          }
          style={styles.cupIcon}
        />
      );
    }
    return cups;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Tab')}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Your Points</Text>
      <Text style={styles.subTitle}>
        Redeem your points for rewards! Every 10 points earns you a free cup of coffee.
      </Text>
      <Text style={styles.pointsText}>Current Points: {points}</Text>
      <View style={styles.cupsContainer}>
        {renderCups()}
      </View>
      <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
        <Text style={styles.redeemButtonText}>Redeem Reward</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  backButton: {
    marginBottom: SPACING.space_20,
    alignSelf: 'flex-start',
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
  pointsText: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.bold,
    marginBottom: SPACING.space_20,
  },
  cupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.space_20,
  },
  cupIcon: {
    width: 70,
    height: 70,
    margin: SPACING.space_15,
  },
  redeemButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: SPACING.space_10,
  },
  redeemButtonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_18,
    fontWeight: 'bold',
  },
});

export default PointScreen;
