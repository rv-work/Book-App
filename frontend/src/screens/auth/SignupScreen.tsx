import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width, height } = Dimensions.get('window');

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState<boolean>(false);
  const [nameFocused, setNameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Signup Failed', result.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <Text style={styles.brandTitle}>BookStore</Text>
              <Text style={styles.welcomeText}>Join the Marketplace</Text>
              <Text style={styles.subtitle}>Start buying or selling today</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.formContainer}>
              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: width * 0.6 }]} />
                </View>
                <Text style={styles.progressText}>Step 1 of 2</Text>
              </View>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    nameFocused && styles.inputFocused,
                    name && styles.inputFilled
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                    email && styles.inputFilled
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    passwordFocused && styles.inputFocused,
                    password && styles.inputFilled
                  ]}
                  placeholder="Create a strong password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoComplete="password-new"
                />
                <Text style={styles.passwordHint}>
                  Must be at least 8 characters with letters and numbers
                </Text>
              </View>

              {/* Role Selection */}
              <View style={styles.roleContainer}>
                <Text style={styles.roleTitle}>Choose your account type:</Text>
                <Text style={styles.roleSubtitle}>What do you want to do on BookStore?</Text>

                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'buyer' && styles.selectedRole
                    ]}
                    onPress={() => setRole('buyer')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleIconContainer}>
                      <Text style={[
                        styles.roleIcon,
                        role === 'buyer' && styles.selectedRoleIcon
                      ]}>🛒</Text>
                    </View>
                    <Text style={[
                      styles.roleButtonText,
                      role === 'buyer' && styles.selectedRoleText,
                    ]}>
                      I'm a Buyer
                    </Text>
                    <Text style={[
                      styles.roleDescription,
                      role === 'buyer' && styles.selectedRoleDescription,
                    ]}>
                      Browse and purchase products from sellers
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'seller' && styles.selectedRole
                    ]}
                    onPress={() => setRole('seller')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleIconContainer}>
                      <Text style={[
                        styles.roleIcon,
                        role === 'seller' && styles.selectedRoleIcon
                      ]}>🏪</Text>
                    </View>
                    <Text style={[
                      styles.roleButtonText,
                      role === 'seller' && styles.selectedRoleText,
                    ]}>
                      I'm a Seller
                    </Text>
                    <Text style={[
                      styles.roleDescription,
                      role === 'seller' && styles.selectedRoleDescription,
                    ]}>
                      List and sell your products to buyers
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Benefits Section */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>
                  {role === 'buyer' ? 'Buyer Benefits:' : 'Seller Benefits:'}
                </Text>
                <View style={styles.benefitsList}>
                  {role === 'buyer' ? (
                    <>
                      <Text style={styles.benefitItem}>• Wide variety of products</Text>
                      <Text style={styles.benefitItem}>• Easy order tracking</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.benefitItem}>• Reach thousands of buyers</Text>
                      <Text style={styles.benefitItem}>• Easy inventory management</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to BookStore's{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  role === 'seller' && styles.sellerButton,
                  loading && styles.signupButtonLoading
                ]}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.signupButtonText}>
                    {role === 'buyer' ? 'Start Shopping' : 'Start Selling'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>@</Text>
                </TouchableOpacity>
              </View> */}

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: height,
  },
  headerSection: {
    backgroundColor: '#6366F1',
    height: height * 0.28,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#C7D2FE',
    textAlign: 'center',
    opacity: 0.9,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -20,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  progressContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
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
  passwordHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 130,
    justifyContent: 'center',
  },
  selectedRole: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  roleIconContainer: {
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 28,
  },
  selectedRoleIcon: {
    transform: [{ scale: 1.1 }],
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedRoleText: {
    color: '#6366F1',
  },
  roleDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedRoleDescription: {
    color: '#4F46E5',
  },
  benefitsContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  benefitsList: {
    gap: 4,
  },
  benefitItem: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#6366F1',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sellerButton: {
    backgroundColor: '#F59E0B',
    ...Platform.select({
      ios: {
        shadowColor: '#F59E0B',
      },
    }),
  },
  signupButtonLoading: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 16,
  },
  loginLink: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;
