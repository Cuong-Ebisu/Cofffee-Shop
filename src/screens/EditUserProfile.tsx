import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, FlatList, Alert, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS, SPACING, FONTSIZE, FONTFAMILY } from '../theme/theme';
import { RootStackParamList } from '../../App';  // Adjust the path as necessary
import { useAuth } from './AuthContext';

interface FeedbackItem {
  id: string;
  email: string;
  feedback: string;
}

const HelpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  const handleBackPress = () => {
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

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackItemText}>{item.feedback}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Help & Support</Text>
      <Text style={styles.subTitle}>
        If you have any questions or need further assistance, please reach out to our support team.
      </Text>
      <Text style={styles.contactText}>Email: 211110390@student.hcmute.edu.vn</Text>
      <Text style={styles.contactText}>Phone: 0703065317</Text>

      <Text style={styles.sectionTitle}>Feedback</Text>
      <Text style={styles.contactText}>We value your feedback! Please let us know how we can improve your experience:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback here"
        placeholderTextColor={COLORS.lightGrey}
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <TouchableOpacity style={styles.completeButton} onPress={handleSendFeedback}>
        <Text style={styles.completeButtonText}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={handleViewFeedback}>
        <Text style={styles.completeButtonText}>View Feedback</Text>
      </TouchableOpacity>

      <Modal visible={showFeedbackModal} animationType="slide" transparent onRequestClose={() => setShowFeedbackModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Feedback List</Text>
            <FlatList
              data={feedbackList}
              renderItem={renderFeedbackItem}
              keyExtractor={(item) => item.id}
              style={styles.feedbackList}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFeedbackModal(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  contactText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginBottom: SPACING.space_10,
  },
  sectionTitle: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: SPACING.space_20,
    marginBottom: SPACING.space_10,
  },
  input: {
    height: 100,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    borderRadius: SPACING.space_10,
    paddingHorizontal: SPACING.space_10,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
    marginBottom: SPACING.space_20,
    textAlignVertical: 'top',
  },
  completeButton: {
    height: 50,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.space_20,
  },
  completeButtonText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.space_20,
    padding: SPACING.space_20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.black,
    marginBottom: SPACING.space_20,
  },
  feedbackList: {
    width: '100%',
    backgroundColor: COLORS.white,
  },
  feedbackItem: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SPACING.space_10,
    padding: SPACING.space_10,
    marginBottom: SPACING.space_10,
    width: '100%',
  },
  feedbackItemText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.black,
  },
  closeModalButton: {
    width: '100%',
    height: 50,
    borderRadius: SPACING.space_10,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.space_20,
  },
  closeModalButtonText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.bold,
    color: COLORS.white,
  },
});

export default HelpScreen;
