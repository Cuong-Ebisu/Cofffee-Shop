import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING, FONTFAMILY, FONTSIZE } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import FavoritesItemCard from '../components/FavoritesItemCard';

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

const FavoritesScreen = ({ navigation }: any) => {
  const FavoritesList = useStore((state: any) => state.FavoritesList);
  const tabBarHeight = useBottomTabBarHeight();
  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );
  const ToggleFavourite = (favourite: boolean, type: string, id: string) => {
    favourite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  const [averageRatings, setAverageRatings] = useState<{ [key: string]: number }>({});
  const [ratingsCounts, setRatingsCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchRatingsData = async () => {
      try {
        const response = await fetch('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop');
        const data = await response.json();

        const allRatings = FavoritesList.map((item: any) => {
          return calculateAverageRatings(data, item.id);
        });

        const avgRatings: { [key: string]: number } = {};
        const ratingCounts: { [key: string]: number } = {};

        allRatings.forEach((rating: any) => {
          Object.keys(rating.averageRatings).forEach((key) => {
            avgRatings[key] = rating.averageRatings[key];
            ratingCounts[key] = rating.ratings[key].count;
          });
        });

        setAverageRatings(avgRatings);
        setRatingsCounts(ratingCounts);
      } catch (error) {
        console.error('Error fetching ratings data:', error);
      }
    };

    fetchRatingsData();
  }, [FavoritesList]);

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Favourites" />

            {FavoritesList.length == 0 ? (
              <EmptyListAnimation title={'No Favourites'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {FavoritesList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <FavoritesItemCard
                      id={data.id}
                      imagelink_portrait={data.imagelink_portrait}
                      name={data.name}
                      special_ingredient={data.special_ingredient}
                      type={data.type}
                      ingredients={data.ingredients}
                      average_rating={averageRatings[data.id] || 0}
                      ratings_count={ratingsCounts[data.id] || 0}
                      roasted={data.roasted}
                      description={data.description}
                      favourite={data.favourite}
                      ToggleFavouriteItem={ToggleFavourite}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
    backgroundColor: COLORS.WhiteSmoke,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.WoodBrown,
    textAlign: 'center',
    marginVertical: SPACING.space_20,
  },
  text: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.WoodBrown,
  },
});

export default FavoritesScreen;
