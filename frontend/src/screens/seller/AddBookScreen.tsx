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
  StatusBar,
  Platform,
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
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);
  const [stockFocused, setStockFocused] = useState(false);

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

    if (Number(price) <= 0 || Number(stock) <= 0) {
      Alert.alert('Error', 'Price and stock must be greater than 0');
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
            uri: coverImage.uri!,
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

  const getProgressPercentage = () => {
    let completed = 0;
    if (title) completed += 20;
    if (description) completed += 20;
    if (price) completed += 20;
    if (stock) completed += 20;
    if (coverImage) completed += 20;
    return completed;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.brandTitle}>BookStore</Text>
            <Text style={styles.brandSubtitle}>Seller Dashboard</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>📚 Add New Book</Text>
              <Text style={styles.subtitle}>Fill in the details to list your book</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
              </View>
              <Text style={styles.progressText}>{getProgressPercentage()}% Complete</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Book Title *</Text>
                <TextInput
                  style={[
                    styles.input,
                    titleFocused && styles.inputFocused,
                    title && styles.inputFilled
                  ]}
                  placeholder="Enter book title"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Book Description *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    descriptionFocused && styles.inputFocused,
                    description && styles.inputFilled
                  ]}
                  placeholder="Describe your book, its condition, and any special features..."
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setDescriptionFocused(true)}
                  onBlur={() => setDescriptionFocused(false)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.inputHint}>
                  {description.length}/500 characters
                </Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Pricing & Inventory</Text>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Price (₹) *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      priceFocused && styles.inputFocused,
                      price && styles.inputFilled
                    ]}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={price}
                    onChangeText={setPrice}
                    onFocus={() => setPriceFocused(true)}
                    onBlur={() => setPriceFocused(false)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Stock Quantity *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      stockFocused && styles.inputFocused,
                      stock && styles.inputFilled
                    ]}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={stock}
                    onChangeText={setStock}
                    onFocus={() => setStockFocused(true)}
                    onBlur={() => setStockFocused(false)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.pricingTips}>
                <Text style={styles.tipsTitle}>💡 Pricing Tips</Text>
                <Text style={styles.tipsText}>• Research similar books for competitive pricing</Text>
                <Text style={styles.tipsText}>• Consider book condition when setting price</Text>
                <Text style={styles.tipsText}>• Higher stock increases visibility</Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Book Cover Image</Text>

              <TouchableOpacity
                style={styles.imageButton}
                onPress={selectImage}
                activeOpacity={0.8}
              >
                <Text style={styles.imageButtonIcon}>📸</Text>
                <Text style={styles.imageButtonText}>
                  {coverImage ? 'Change Cover Image' : 'Add Cover Image'}
                </Text>
                <Text style={styles.imageButtonSubtext}>
                  {coverImage ? 'Tap to replace' : 'Recommended: 400x600px'}
                </Text>
              </TouchableOpacity>

              {coverImage && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: coverImage.uri }} style={styles.previewImage} />
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageName}>{coverImage.fileName}</Text>
                    <Text style={styles.imageSize}>
                      {coverImage.fileSize ? `${(coverImage.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setCoverImage(null)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.removeImageText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.actionSection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Listing Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Title:</Text>
                  <Text style={styles.summaryValue}>{title || 'Not set'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Price:</Text>
                  <Text style={styles.summaryValue}>₹{price || '0.00'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Stock:</Text>
                  <Text style={styles.summaryValue}>{stock || '0'} units</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Image:</Text>
                  <Text style={styles.summaryValue}>{coverImage ? 'Added ✓' : 'Not added'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  loading && styles.addButtonLoading,
                  getProgressPercentage() < 100 && styles.addButtonDisabled
                ]}
                onPress={handleAddBook}
                disabled={loading || getProgressPercentage() < 100}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.addButtonText}>
                      {getProgressPercentage() < 100 ? 'Complete All Fields' : 'List Book on BookStore'}
                    </Text>
                    {getProgressPercentage() === 100 && (
                      <Text style={styles.addButtonSubtext}>Start selling to thousands of buyers</Text>
                    )}
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#C7D2FE',
    fontWeight: '500',
    marginTop: -2,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    marginTop: -12,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  inputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pricingTips: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#3730A3',
    marginBottom: 4,
  },
  imageButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  imageButtonSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  imagePreview: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  previewImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  imageInfo: {
    flex: 1,
  },
  imageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  imageSize: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  removeImageButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeImageText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  actionSection: {
    gap: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonLoading: {
    opacity: 0.7,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    ...Platform.select({
      ios: {
        shadowColor: '#9CA3AF',
      },
    }),
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
});

export default AddBookScreen;
