import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker';
import { sellerApi, AddBookData } from '../../services/api';
import { StackNavigationProp } from '@react-navigation/stack';

type AddBookScreenNavigationProp = StackNavigationProp<any, 'AddBook'>;

interface Props {
  navigation: AddBookScreenNavigationProp;
}

const AddBookScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) setCoverImage(response.assets[0]);
    });
  };

  const handleAddBook = async () => {
    if (!title || !description || !price || !stock) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isNaN(Number(price)) || isNaN(Number(stock))) {
      Alert.alert('Error', 'Price and stock must be valid numbers');
      return;
    }

    setLoading(true);

    try {
      const bookData: AddBookData = {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        coverImage: coverImage
          ? {
            uri: coverImage.uri!, // assert it exists
            type: coverImage.type || 'image/jpeg',
            fileName: coverImage.fileName || 'cover.jpg',
          }
          : undefined,
      };

      await sellerApi.addBook(bookData);

      Alert.alert('Success', 'Book added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setPrice('');
            setStock('');
            setCoverImage(null);
            navigation.navigate('MyBooks');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Book</Text>

        <TextInput
          style={styles.input}
          placeholder="Book Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Book Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TextInput
          style={styles.input}
          placeholder="Price (₹)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Stock Quantity"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
          <Text style={styles.imageButtonText}>
            {coverImage ? 'Change Cover Image' : 'Select Cover Image'}
          </Text>
        </TouchableOpacity>

        {coverImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: coverImage.uri }} style={styles.previewImage} />
            <Text style={styles.imageName}>{coverImage.fileName}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBook}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.addButtonText}>Add Book</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100 },
  imageButton: { backgroundColor: '#6c757d', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  imageButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  imagePreview: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 150, height: 200, borderRadius: 8, marginBottom: 10 },
  imageName: { fontSize: 14, color: '#666' },
  addButton: { backgroundColor: '#28a745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AddBookScreen;
