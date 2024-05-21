import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { COLORS, SPACING, FONTSIZE } from '../theme/theme';

interface User {
  id: string;
  name: string;
  phone: string;
  gender: string;
  address: string;
}

const EditAPI = () => {
  const [data, setData] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post('https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop', {
        name,
        phone,
        gender,
        address,
      });
      setData([...data, response.data]);
      setName('');
      setPhone('');
      setGender('');
      setAddress('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`https://6606e9f2be53febb857ee01e.mockapi.io/Coffeeshop/${id}`, {
        name,
        phone,
        gender,
        address,
      });
      setData(data.map(item => (item.id === id ? response.data : item)));
      setName('');
      setPhone('');
      setGender('');
      setAddress('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: User) => {
    setName(item.name);
    setPhone(item.phone);
    setGender(item.gender);
    setAddress(item.address);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit API</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.phone}</Text>
            <Text style={styles.itemText}>{item.gender}</Text>
            <Text style={styles.itemText}>{item.address}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(item.id)}>
              <Text style={styles.buttonText}>Update</Text>
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
  button: {
    backgroundColor: COLORS.WoodBrown,
    padding: SPACING.space_12,
    alignItems: 'center',
    marginBottom: SPACING.space_20,
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
  updateButton: {
    backgroundColor: COLORS.WoodBrown,
    padding: SPACING.space_8,
    alignItems: 'center',
    marginBottom: SPACING.space_8,
  },
});

export default EditAPI;
