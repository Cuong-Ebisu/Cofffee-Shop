import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import { COLORS, SPACING, FONTSIZE } from '../theme/theme';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  EditAPI: undefined;
  // Các màn hình khác trong stack nếu có
};

type EditAPIScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditAPI'
>;

type Props = {
  navigation: EditAPIScreenNavigationProp;
};

interface Coffee {
  id: string;
  CoffeeName: string;
  average_rating: string;
  gmail: string;
}

const EditAPI: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<Coffee[]>([]);
  const [id, setId] = useState<string>('');
  const [CoffeeName, setCoffeeName] = useState<string>('');
  const [average_rating, setAverageRating] = useState<string>('');
  const [gmail, setGmail] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post('https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop', {
        CoffeeName,
        average_rating,
        gmail,
      });
      setData([...data, response.data]);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    try {
      const response = await axios.put(`https://664d605aede9a2b556535a28.mockapi.io/CoffeeShop/CoffeeShop/${id}`, {
        CoffeeName,
        average_rating,
        gmail,
      });
      setData(data.map(item => (item.id === id ? response.data : item)));
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: Coffee) => {
    setId(item.id);
    setCoffeeName(item.CoffeeName);
    setAverageRating(item.average_rating);
    setGmail(item.gmail);
  };

  const resetForm = () => {
    setId('');
    setCoffeeName('');
    setAverageRating('');
    setGmail('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/app_images/icons8-left-arrow-100.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Edit API</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="Coffee Name"
        value={CoffeeName}
        onChangeText={setCoffeeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Average Rating"
        value={average_rating}
        onChangeText={setAverageRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Gmail"
        value={gmail}
        onChangeText={setGmail}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleDelete(id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.id}</Text>
            <Text style={styles.itemText}>{item.CoffeeName}</Text>
            <Text style={styles.itemText}>{item.average_rating}</Text>
            <Text style={styles.itemText}>{item.gmail}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  backButton: {
    marginBottom: SPACING.space_20,
  },
  backIcon: {
    width: SPACING.space_24,
    height: SPACING.space_24,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    marginBottom: SPACING.space_20,
    color: COLORS.primaryBlackHex,
  },
  input: {
    height: SPACING.space_40,
    borderColor: COLORS.primaryGreyHex,
    borderWidth: 1,
    marginBottom: SPACING.space_20,
    paddingHorizontal: SPACING.space_10,
    fontSize: FONTSIZE.size_18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.space_20,
  },
  button: {
    backgroundColor: COLORS.WoodBrown,
    padding: SPACING.space_12,
    alignItems: 'center',
    width: '32%',
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_18,
  },
  item: {
    padding: SPACING.space_10,
    borderBottomColor: COLORS.primaryGreyHex,
    borderBottomWidth: 1,
    marginBottom: SPACING.space_20,
  },
  itemText: {
    fontSize: FONTSIZE.size_18,
    marginBottom: SPACING.space_8,
  },
  editButton: {
    backgroundColor: COLORS.WoodBrown,
    padding: SPACING.space_8,
    alignItems: 'center',
    marginBottom: SPACING.space_8,
  },
  deleteButton: {
    backgroundColor: COLORS.primaryRedHex,
    padding: SPACING.space_8,
    alignItems: 'center',
    marginBottom: SPACING.space_8,
  },
});

export default EditAPI;
