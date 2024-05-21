import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import { Dimensions } from 'react-native';
import { useAuth } from './AuthContext';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffeelist = data.filter((item: any) => item.name == category);
    return coffeelist;
  }
};

const HomeScreen = ({ navigation }: any) => {
  const CoffeeList = useStore((state: any) => state.CoffeeList);
  const BeanList = useStore((state: any) => state.BeanList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const { user } = useAuth();
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop?email=${user.email}`);
          const data = await response.json();
          if (data.length > 0) {
            setAddress(data[0].address);
          } else {
            setAddress(null);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAddress();
  }, [user?.email]);

  const [categories, setCategories] = useState(getCategoriesFromData(CoffeeList));
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, CoffeeList)
  );

  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedCoffee([
        ...CoffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({ index: 0, category: categories[0] });
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  };

  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.WoodBrown} />
      </View>
    );
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        {/* App Header */}
        <HeaderBar />

        {/* Address and Title Container */}
        <View style={styles.titleSearchContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.locationLabel}>Location</Text>
            <View style={styles.addressContent}>
              <Text style={styles.addressText}>{address ? address : 'Set Your Address'}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EnterLocationManually')}>
                <Image 
                  source={require('../assets/app_images/icons8-edit-64.png')} 
                  style={styles.editIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.ScreenTitle}>
            Find the best{'\n'}coffee for you
          </Text>

          {/* Search Input */}
          <View style={styles.InputContainerComponent}>
            <TouchableOpacity
              onPress={() => {
                searchCoffee(searchText);
              }}
            >
              <CustomIcon
                style={styles.InputIcon}
                name="search"
                size={FONTSIZE.size_18}
                color={
                  searchText.length > 0
                    ? COLORS.TurquoiseBlue
                    : COLORS.WhiteSmoke
                }
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Find Your Coffee..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                searchCoffee(text);
              }}
              placeholderTextColor={COLORS.WhiteSmoke}
              style={styles.TextInputContainer}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  resetSearchCoffee();
                }}
              >
                <CustomIcon
                  style={styles.InputIcon}
                  name="close"
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>

        {/* Category Scroller */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}
        >
          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.CategoryScrollViewContainer}
            >
              <TouchableOpacity
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  setCategoryIndex({ index: index, category: categories[index] });
                  setSortedCoffee([
                    ...getCoffeeList(categories[index], CoffeeList),
                  ]);
                }}
              >
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index == index
                      ? { color: COLORS.primaryOrangeHex }
                      : {},
                  ]}
                >
                  {data}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Coffee Flatlist */}
        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>No Coffee Available</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedCoffee}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  });
                }}
              >
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={CoffeCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />

        <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>

        {/* Beans Flatlist */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BeanList}
          contentContainerStyle={[
            styles.FlatListContainer,
            { marginBottom: tabBarHeight },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  });
                }}
              >
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={CoffeCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSearchContainer: {
    backgroundColor: COLORS.WhiteSmoke,
    borderRadius: BORDERRADIUS.radius_20,
    padding: SPACING.space_10,
    margin: SPACING.space_10,
  },
  addressContainer: {
    marginBottom: SPACING.space_10,
  },
  locationLabel: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.WoodBrown,
    fontFamily: FONTFAMILY.poppins_semibold,
    marginBottom: SPACING.space_4,
    marginLeft: 10,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  addressText: {
    fontSize: FONTSIZE.size_14,
    color: COLORS.WoodBrown,
  },
  editIcon: {
    width: 20,
    height: 20,
    marginLeft: SPACING.space_10,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.WoodBrown,
    textAlign: 'center',
    marginBottom: SPACING.space_20,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginTop: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.WoodBrown,
    alignItems: 'center',
    width: '100%',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.SpanishBistre,
  },
});

export default HomeScreen;
