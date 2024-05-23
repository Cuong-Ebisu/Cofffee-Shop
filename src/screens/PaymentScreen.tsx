import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';
import PaymentMethod from '../components/PaymentMethod';
import PaymentFooter from '../components/PaymentFooter';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import { useStore } from '../store/store';
import PopUpAnimation from '../components/PopUpAnimation';
import { useAuth } from './AuthContext';

const PaymentList = [
  {
    name: 'Wallet',
    icon: require('../assets/app_images/icons8-wallet-1003.png'),
    isIcon: false,
  },
  {
    name: 'Momo',
    icon: require('../assets/app_images/momo.png'),
    isIcon: false,
  },
  {
    name: 'Google Pay',
    icon: require('../assets/app_images/gpay.png'),
    isIcon: false,
  },
  {
    name: 'Apple Pay',
    icon: require('../assets/app_images/applepay.png'),
    isIcon: false,
  },
  {
    name: 'Amazon Pay',
    icon: require('../assets/app_images/amazonpay.png'),
    isIcon: false,
  },
];

const PaymentScreen = ({ navigation, route }: any) => {
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const addToOrderHistoryListFromCart = useStore(
    (state: any) => state.addToOrderHistoryListFromCart,
  );
  const { user } = useAuth();
  const [paymentMode, setPaymentMode] = useState('Credit Card');
  const [showAnimation, setShowAnimation] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          setWalletAmount(data[0].amount || 0);
        }
      } catch (error) {
        console.error('Error fetching wallet amount:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchWalletAmount();
    fetchProfile();
  }, [user?.email]);

  const checkProfileCompletion = (profile: any) => {
    return profile?.name && profile?.phoneNumber && profile?.gender && profile?.address;
  };

  const buttonPressHandler = async () => {
    if (!checkProfileCompletion(profile)) {
      Alert.alert('Incomplete Profile', 'Your profile information is incomplete.');
      return;
    }

    setShowReceipt(true);
  };

  const handlePayment = async () => {
    if (paymentMode === 'Wallet' && walletAmount < route.params.amount) {
      Alert.alert('Insufficient Funds', 'You do not have enough funds in your wallet.');
      return;
    }

    let updatedAmount = walletAmount;

    if (paymentMode === 'Wallet') {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          const existingEntry = data[0];
          updatedAmount = existingEntry.amount ? parseFloat(existingEntry.amount) - parseFloat(route.params.amount) : 0;

          await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${existingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: updatedAmount,
              points: (existingEntry.points || 0) + Math.floor(route.params.amount / 10),
            }),
          });

          setWalletAmount(updatedAmount);
        }
      } catch (error) {
        console.error('Error updating wallet amount:', error);
        Alert.alert('Error', 'There was an error processing your payment.');
        return;
      }
    } else {
      try {
        const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
        const data = await response.json();
        if (data.length > 0) {
          const existingEntry = data[0];

          await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${existingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              points: (existingEntry.points || 0) + Math.floor(route.params.amount / 10),
            }),
          });
        }
      } catch (error) {
        console.error('Error updating points:', error);
        Alert.alert('Error', 'There was an error processing your payment.');
        return;
      }
    }

    setShowAnimation(true);
    addToOrderHistoryListFromCart();
    calculateCartPrice();
    setTimeout(() => {
      setShowAnimation(false);
      navigation.navigate('History');
    }, 2000);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/successful.json')}
        />
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <GradientBGIcon
              name="left"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_16}
            />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Payments</Text>
          <View style={styles.EmptyView} />
        </View>

        <View style={styles.PaymentOptionsContainer}>
          <TouchableOpacity
            onPress={() => {
              setPaymentMode('Credit Card');
            }}>
            <View
              style={[
                styles.CreditCardContainer,
                {
                  borderColor:
                    paymentMode === 'Credit Card'
                      ? COLORS.primaryOrangeHex
                      : COLORS.OtterBrown,
                },
              ]}>
              <Text style={styles.CreditCardTitle}>Credit Card</Text>
              <View style={styles.CreditCardBG}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 2, y: 1 }}
                  style={styles.LinearGradientStyle}
                  colors={[COLORS.WoodBrown, COLORS.WhiteSmoke]}>
                  <View style={styles.CreditCardRow}>
                    <CustomIcon
                      name="chip"
                      size={FONTSIZE.size_10}
                      color={COLORS.primaryOrangeHex}
                    />
                    <CustomIcon
                      name="visa"
                      size={FONTSIZE.size_10}
                      color={COLORS.primaryWhiteHex}
                    />
                  </View>
                  <View style={styles.CreditCardNumberContainer}>
                    <Text style={styles.CreditCardNumber}>3879</Text>
                    <Text style={styles.CreditCardNumber}>8923</Text>
                    <Text style={styles.CreditCardNumber}>6745</Text>
                    <Text style={styles.CreditCardNumber}>4638</Text>
                  </View>
                  <View style={styles.CreditCardRow}>
                    <View style={styles.CreditCardNameContainer}>
                      <Text style={styles.CreditCardNameSubitle}>
                        Card Holder Name
                      </Text>
                      <Text style={styles.CreditCardNameTitle}>
                        HUYNH ANH DUNG
                      </Text>
                    </View>
                    <View style={styles.CreditCardDateContainer}>
                      <Text style={styles.CreditCardNameSubitle}>
                        Expiry Date
                      </Text>
                      <Text style={styles.CreditCardNameTitle}>02/30</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </TouchableOpacity>
          {PaymentList.map((data: any) => (
            <TouchableOpacity
              key={data.name}
              onPress={() => {
                setPaymentMode(data.name);
              }}>
              <PaymentMethod
                paymentMode={paymentMode}
                name={data.name}
                icon={data.icon}
                isIcon={data.isIcon}
              />
              {data.name === 'Wallet' && paymentMode === 'Wallet' && (
                <Text style={styles.walletAmountText}>${walletAmount.toFixed(2)}</Text>
              )}
              {paymentMode === 'Momo' && data.name === 'Momo' && (
                <Image
                  source={require('../assets/app_images/momo_qr.png')}
                  style={styles.QRCode}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <PaymentFooter
        buttonTitle={`Pay with ${paymentMode}`}
        price={{ price: route.params.amount, currency: '$' }}
        buttonPressHandler={buttonPressHandler}
      />

      <Modal visible={showReceipt} animationType="slide" transparent>
        <View style={styles.ReceiptContainer}>
          <View style={styles.ReceiptContent}>
            <Text style={styles.ReceiptTitle}>Receipt</Text>
            <Text style={styles.ReceiptText}>Name: {profile?.name}</Text>
            <Text style={styles.ReceiptText}>Phone: {profile?.phoneNumber}</Text>
            <Text style={styles.ReceiptText}>Gender: {profile?.gender}</Text>
            <Text style={styles.ReceiptText}>Address: {profile?.address}</Text>
            <Text style={styles.ReceiptText}>Amount: ${route.params.amount}</Text>
            <TouchableOpacity
              style={styles.PayButton}
              onPress={handlePayment}>
              <Text style={styles.ButtonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowReceipt(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.WhiteSmoke,
  },
  LottieAnimation: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  HeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryOrangeHex,
  },
  EmptyView: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
  PaymentOptionsContainer: {
    padding: SPACING.space_15,
    gap: SPACING.space_15,
  },
  CreditCardContainer: {
    padding: SPACING.space_10,
    gap: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_15 * 2,
    borderWidth: 3,
    borderColor: COLORS.SpanishBistre,
  },
  CreditCardTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryOrangeHex,
    marginLeft: SPACING.space_10,
  },
  CreditCardBG: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: BORDERRADIUS.radius_25,
  },
  LinearGradientStyle: {
    borderRadius: BORDERRADIUS.radius_25,
    gap: SPACING.space_36,
    paddingHorizontal: SPACING.space_15,
    paddingVertical: SPACING.space_10,
  },
  CreditCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CreditCardNumberContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  CreditCardNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    letterSpacing: SPACING.space_4 + SPACING.space_2,
  },
  CreditCardNameSubitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.SpanishBistre,
  },
  CreditCardNameTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  CreditCardNameContainer: {
    alignItems: 'flex-start',
  },
  CreditCardDateContainer: {
    alignItems: 'flex-end',
  },
  walletAmountText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryOrangeHex,
    textAlign: 'right',
    paddingRight: SPACING.space_10,
  },
  QRCode: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: SPACING.space_20,
  },
  ReceiptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ReceiptContent: {
    width: '80%',
    padding: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_20,
  },
  ReceiptTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_10,
    textAlign: 'center',
  },
  ReceiptText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    marginVertical: SPACING.space_15,
  },
  PayButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_36 * 2,
    borderRadius: BORDERRADIUS.radius_20,
    marginTop: SPACING.space_20,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  closeModalButton: {
    marginTop: SPACING.space_20,
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: SPACING.space_10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
