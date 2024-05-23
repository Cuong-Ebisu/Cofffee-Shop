import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

const ReceiptModal = ({ profile, amount, onPay, onClose }: any) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Receipt</Text>
        <Text style={styles.modalText}>Name: {profile.name}</Text>
        <Text style={styles.modalText}>Phone Number: {profile.phoneNumber}</Text>
        <Text style={styles.modalText}>Gender: {profile.gender}</Text>
        <Text style={styles.modalText}>Address: {profile.address}</Text>
        <Text style={styles.modalText}>Amount: ${amount}</Text>
        <TouchableOpacity style={styles.payButton} onPress={onPay}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_15,
  },
  modalText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_10,
  },
  payButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    marginTop: SPACING.space_20,
  },
  closeButton: {
    backgroundColor: COLORS.secondaryLightGreyHex,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    marginTop: SPACING.space_10,
  },
  buttonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
});

export default ReceiptModal;
