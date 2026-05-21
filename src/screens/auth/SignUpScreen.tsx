import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/CustomButton';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../../theme';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (text: string) => {
    if (!text.trim()) {
      return 'Full Name is required';
    }
    return '';
  };

  const validateEmail = (text: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      return 'Email is required';
    } else if (!regex.test(text)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (text: string) => {
    if (!text) {
      return 'Password is required';
    } else if (text.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateConfirmPassword = (text: string, pass: string) => {
    if (!text) {
      return 'Please confirm your password';
    } else if (text !== pass) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSignUp = async () => {
    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(confirmPassword, password);

    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);

    if (nErr || eErr || pErr || cpErr) {
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'An error occurred during signup. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      }
      Alert.alert('Sign Up Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>

        {/* Title Heading */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to browse and order delicious meals!</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.textInputWrapper, nameError ? styles.inputErrorBorder : null]}>
              <Ionicons name="person-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                placeholderTextColor={COLORS.placeholder}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) setNameError(validateName(text));
                }}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.textInputWrapper, emailError ? styles.inputErrorBorder : null]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="email@example.com"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(validateEmail(text));
                }}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.textInputWrapper, passwordError ? styles.inputErrorBorder : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(validatePassword(text));
                  if (confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, text));
                }}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[styles.textInputWrapper, confirmPasswordError ? styles.inputErrorBorder : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError(validateConfirmPassword(text, password));
                }}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Sign Up CTA */}
          <CustomButton
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            variant="primary"
            style={styles.signUpBtn}
          />

          {/* Go to Login Navigation */}
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.promptLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  titleContainer: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 48,
    ...SHADOWS.light,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    color: COLORS.dark,
    fontSize: 14,
  },
  eyeBtn: {
    padding: SPACING.xs,
  },
  inputErrorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  signUpBtn: {
    height: 50,
    borderRadius: 12,
    marginTop: SPACING.md,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  promptText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
  },
  promptLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
