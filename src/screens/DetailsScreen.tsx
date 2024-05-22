import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { useStore } from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroundInfo from '../components/ImageBackgroundInfo';
import PaymentFooter from '../components/PaymentFooter';
import { useAuth } from '../screens/AuthContext';

const calculateAverageRatings = (data: any, coffeeName: string) => {
  const ratings: { [key: string]: { sum: number; count: number } } = {};
  data.forEach((item: any) => {
    if (item.CoffeeName === coffeeName && item.average_rating) {
      if (!ratings[item.CoffeeName]) {
        ratings[item.CoffeeName] = { sum: 0, count: 0 };
      }
      ratings[item.CoffeeName].sum += parseFloat(item.average_rating);
      ratings[item.CoffeeName].count += 1;
    }
  });
  const averageRatings: { [key: string]: number } = {};
  Object.keys(ratings).forEach((key) => {
    averageRatings[key] = ratings[key].sum / ratings[key].count;
  });
  return { averageRatings, ratings };
};

interface Comment {
  CoffeeName: string;
  average_rating?: number;
  comment: string;
  gmail: string | null | undefined;
}

const DetailsScreen = ({ navigation, route }: any) => {
  const ItemOfIndex = useStore((state: any) =>
    route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList,
  )[route.params.index];
  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const { user } = useAuth();

  const [price, setPrice] = useState(ItemOfIndex.prices[0]);
  const [fullDesc, setFullDesc] = useState(false);
  const [averageRatings, setAverageRatings] = useState<{ [key: string]: number }>({});
  const [ratingsCounts, setRatingsCounts] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchRatingsData = async () => {
      try {
        const response = await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop');
        const data = await response.json();
        const { averageRatings, ratings } = calculateAverageRatings(data, route.params.id);
        setAverageRatings(averageRatings);

        const ratingsCounts: { [key: string]: number } = {};
        Object.keys(ratings).forEach((key) => {
          ratingsCounts[key] = ratings[key].count;
        });
        setRatingsCounts(ratingsCounts);
        setComments(data.filter((item: any) => item.CoffeeName === route.params.id));
      } catch (error) {
        console.error('Error fetching ratings data:', error);
      }
    };

    fetchRatingsData();
  }, []);

  const ToggleFavourite = (favourite: boolean, type: string, id: string) => {
    favourite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  const BackHandler = () => {
    navigation.pop();
  };

  const addToCarthandler = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    price,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices: [{ ...price, quantity: 1 }],
    });
    calculateCartPrice();
    navigation.navigate('Cart');
  };

  const toggleRateModal = () => {
    setRateModalVisible(!isRateModalVisible);
  };

  const toggleCommentModal = () => {
    setCommentModalVisible(!isCommentModalVisible);
  };

  const submitRating = async () => {
    try {
      const response = await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop');
      const data = await response.json();

      const existingRating = data.find((item: any) => item.gmail === user?.email && item.CoffeeName === route.params.id);

      if (existingRating) {
        await fetch(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${existingRating.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            average_rating: selectedRating,
          }),
        });
        Alert.alert('Rating Updated', 'Your rating has been updated.');
        setComments(prev => prev.map(comment => comment.gmail === user?.email && comment.CoffeeName === route.params.id ? { ...comment, average_rating: selectedRating } : comment));
      } else {
        await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            CoffeeName: route.params.id,
            average_rating: selectedRating,
            gmail: user?.email,
          }),
        });
        Alert.alert('Rating Submitted', 'Thank you for rating the product.');
        setComments(prev => [...prev, { CoffeeName: route.params.id, average_rating: selectedRating, gmail: user?.email, comment: '' }]);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      toggleRateModal();
    }
  };

  const submitComment = async () => {
    try {
      await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CoffeeName: route.params.id,
          comment: newComment,
          gmail: user?.email,
        }),
      });
      Alert.alert('Comment Submitted', 'Thank you for commenting on the product.');
      setComments(prev => [...prev, { CoffeeName: route.params.id, comment: newComment, gmail: user?.email }]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      toggleCommentModal();
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_portrait={ItemOfIndex.imagelink_portrait}
          type={ItemOfIndex.type}
          id={ItemOfIndex.id}
          favourite={ItemOfIndex.favourite}
          name={ItemOfIndex.name}
          special_ingredient={ItemOfIndex.special_ingredient}
          ingredients={ItemOfIndex.ingredients}
          average_rating={averageRatings[route.params.id] || 0}
          ratings_count={ratingsCounts[route.params.id] || 0}
          roasted={ItemOfIndex.roasted}
          BackHandler={BackHandler}
          ToggleFavourite={ToggleFavourite}
        />

        <View style={styles.FooterInfoArea}>
          <TouchableOpacity
            style={styles.RateButton}
            onPress={toggleRateModal}>
            <Text style={styles.RateButtonText}>Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CommentButton}
            onPress={toggleCommentModal}>
            <Text style={styles.CommentButtonText}>Comment</Text>
          </TouchableOpacity>
          <Text style={styles.InfoTitle}>Description</Text>
          {fullDesc ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc((prev) => !prev);
              }}>
              <Text style={styles.DescriptionText}>
                {ItemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc((prev) => !prev);
              }}>
              <Text numberOfLines={3} style={styles.DescriptionText}>
                {ItemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <Text style={styles.InfoTitle}>Size</Text>
          <View style={styles.SizeOuterContainer}>
            {ItemOfIndex.prices.map((data: any) => (
              <TouchableOpacity
                key={data.size}
                onPress={() => {
                  setPrice(data);
                }}
                style={[
                  styles.SizeBox,
                  {
                    borderColor:
                      data.size == price.size
                        ? COLORS.SandyBrown
                        : COLORS.WhiteSmoke,
                  },
                ]}>
                <Text
                  style={[
                    styles.SizeText,
                    {
                      fontSize:
                        ItemOfIndex.type == 'Bean'
                          ? FONTSIZE.size_14
                          : FONTSIZE.size_16,
                      color:
                        data.size == price.size
                          ? COLORS.SandyBrown
                          : COLORS.WhiteSmoke,
                    },
                  ]}>
                  {data.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <PaymentFooter
          price={price}
          buttonTitle="Add to Cart"
          buttonPressHandler={() => {
            addToCarthandler({
              id: ItemOfIndex.id,
              index: ItemOfIndex.index,
              name: ItemOfIndex.name,
              roasted: ItemOfIndex.roasted,
              imagelink_square: ItemOfIndex.imagelink_square,
              special_ingredient: ItemOfIndex.special_ingredient,
              type: ItemOfIndex.type,
              price: price,
            });
          }}
        />
      </ScrollView>

      <Modal isVisible={isRateModalVisible} onBackdropPress={toggleRateModal} style={styles.Modal}>
        <View style={styles.ModalContent}>
          <Text style={styles.ModalTitle}>Rate This Product</Text>
          <ScrollView style={styles.CommentsContainer}>
            {comments.filter(comment => comment.average_rating).map((comment: Comment, index: number) => (
              <View key={index} style={styles.CommentItem}>
                <Text style={styles.CommentEmail}>{comment.gmail}</Text>
                <View style={styles.CommentRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                      key={star}
                      source={star <= (comment.average_rating || 0) ? require('../assets/app_images/star_yellow.png') : require('../assets/app_images/star_gray.png')}
                      style={styles.CommentStarIcon}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.StarsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSelectedRating(star)}
                style={styles.StarButton}>
                <Image
                  source={star <= selectedRating ? require('../assets/app_images/star_yellow.png') : require('../assets/app_images/star_gray.png')}
                  style={styles.StarIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.SubmitButton}
            onPress={submitRating}>
            <Text style={styles.SubmitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isCommentModalVisible} onBackdropPress={toggleCommentModal} style={styles.Modal}>
        <View style={styles.ModalContent}>
          <Text style={styles.ModalTitle}>Comments</Text>
          <ScrollView style={styles.CommentsContainer}>
            {comments.filter(comment => comment.comment).map((comment: Comment, index: number) => (
              <View key={index} style={styles.CommentItem}>
                <Text style={styles.CommentEmail}>{comment.gmail}</Text>
                <Text style={styles.CommentText}>{comment.comment}</Text>
              </View>
            ))}
          </ScrollView>
          <TextInput
            style={styles.CommentInput}
            placeholder="Add your comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={styles.SubmitButton}
            onPress={submitComment}>
            <Text style={styles.SubmitButtonText}>Submit</Text>
          </TouchableOpacity>
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
  ScrollViewFlex: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  FooterInfoArea: {
    padding: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.TuscanBrown,
    marginBottom: SPACING.space_10,
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.TuscanBrown,
    marginBottom: SPACING.space_30,
  },
  SizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  SizeBox: {
    flex: 1,
    backgroundColor: COLORS.SpanishBistre,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
  RateButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    marginBottom: SPACING.space_10,
  },
  RateButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  CommentButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    marginBottom: SPACING.space_20,
  },
  CommentButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  Modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  ModalContent: {
    backgroundColor: COLORS.WhiteSmoke,
    padding: SPACING.space_20,
    borderTopLeftRadius: BORDERRADIUS.radius_20,
    borderTopRightRadius: BORDERRADIUS.radius_20,
  },
  ModalTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.TuscanBrown,
    marginBottom: SPACING.space_20,
    textAlign: 'center',
  },
  StarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.space_20,
  },
  StarButton: {
    marginHorizontal: SPACING.space_10,
  },
  StarIcon: {
    width: 32,
    height: 32,
  },
  SubmitButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    marginTop: SPACING.space_20,
  },
  SubmitButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  CommentsContainer: {
    maxHeight: 200,
    marginBottom: SPACING.space_20,
  },
  CommentItem: {
    marginBottom: SPACING.space_10,
  },
  CommentEmail: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.TuscanBrown,
  },
  CommentRating: {
    flexDirection: 'row',
  },
  CommentStarIcon: {
    width: 16,
    height: 16,
  },
  CommentText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.TuscanBrown,
  },
  CommentInput: {
    height: 40,
    borderColor: COLORS.WhiteSmoke,
    borderWidth: 1,
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_10,
    marginBottom: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.TuscanBrown,
  },
});

export default DetailsScreen;
