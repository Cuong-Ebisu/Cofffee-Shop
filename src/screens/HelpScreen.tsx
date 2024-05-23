import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE } from '../theme/theme';
import { useAuth } from './AuthContext'; // Adjust the path as necessary

interface FeedbackItem {
  id: string;
  email: string;
  feedback: string;
}

const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }

    try {
      const response = await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          feedback: feedback.trim(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your feedback has been sent.');
        setFeedback('');
      } else {
        Alert.alert('Error', 'Failed to send feedback.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      Alert.alert('Error', 'An error occurred while sending your feedback.');
    }
  };

  const handleViewFeedback = async () => {
    try {
      const response = await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop?email=${user?.email}`);
      const data: FeedbackItem[] = await response.json();
      setFeedbackList(data);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      Alert.alert('Error', 'An error occurred while fetching your feedback.');
    }
  };

  const renderFeedbackItem: ListRenderItem<FeedbackItem> = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackItemText}>{item.feedback}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('../assets/app_images/icons8-left-arrow-100.png')}  // Adjust the path as necessary
          style={styles.backButtonIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Q: How do I place an order?</Text>
        <Text style={styles.faqAnswer}>A: To place an order, simply browse our menu, select the items you want, and add them to your cart. Once you’re ready, go to the checkout page to complete your order.</Text>
      </View>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Q: How can I track my order?</Text>
        <Text style={styles.faqAnswer}>A: After placing an order, you can track its status in the 'My Orders' section of the app.</Text>
      </View>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Q: What payment methods do you accept?</Text>
        <Text style={styles.faqAnswer}>A: We accept various payment methods including credit cards, debit cards, and popular e-wallets like Momo and Google Pay.</Text>
      </View>
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.contactText}>If you have any other questions or need further assistance, please reach out to our support team:</Text>
      <Text style={styles.contactText}>Email: 211110390@student.hcmute.edu.vn</Text>
      <Text style={styles.contactText}>Phone: 0703065317</Text>
      <Text style={styles.sectionTitle}>Feedback</Text>
      <Text style={styles.contactText}>We value your feedback! Please let us know how we can improve your experience:</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Enter your feedback here"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <TouchableOpacity style={styles.feedbackButton} onPress={handleSendFeedback}>
        <Text style={styles.feedbackButtonText}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewFeedbackButton} onPress={handleViewFeedback}>
        <Text style={styles.feedbackButtonText}>View Feedback</Text>
      </TouchableOpacity>
      
      <Modal visible={showFeedbackModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Feedback List</Text>
            <FlatList
              data={feedbackList}
              renderItem={renderFeedbackItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFeedbackModal(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.space_20,
  },
  backButtonIcon: {
    width: SPACING.space_36,
    height: SPACING.space_36,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryBlackHex,
    fontWeight: 'bold',
    marginBottom: SPACING.space_20,
  },
  sectionTitle: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryOrangeHex,
    fontWeight: 'bold',
    marginTop: SPACING.space_20,
    marginBottom: SPACING.space_10,
  },
  faqItem: {
    marginBottom: SPACING.space_15,
  },
  faqQuestion: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    marginTop: SPACING.space_15,
  },
  contactText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    marginTop: SPACING.space_10,
  },
  feedbackInput: {
    marginTop: SPACING.space_10,
    padding: SPACING.space_10,
    borderColor: COLORS.primaryGreyHex,
    borderWidth: 1,
    borderRadius: SPACING.space_10,
    height: 100,
    textAlignVertical: 'top',
  },
  feedbackButton: {
    marginTop: SPACING.space_20,
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: SPACING.space_10,
    alignItems: 'center',
  },
  viewFeedbackButton: {
    marginTop: SPACING.space_10,
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: SPACING.space_10,
    alignItems: 'center',
  },
  feedbackButtonText: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_20,
    borderRadius: SPACING.space_10,
  },
  modalTitle: {
    fontSize: FONTSIZE.size_20,
    fontWeight: 'bold',
    marginBottom: SPACING.space_10,
    textAlign: 'center',
  },
  feedbackItem: {
    backgroundColor: COLORS.primaryGreyHex,
    padding: SPACING.space_10,
    marginVertical: SPACING.space_15,
    borderRadius: SPACING.space_10,
  },
  feedbackItemText: {
    fontSize: FONTSIZE.size_16,
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

export default HelpScreen;
