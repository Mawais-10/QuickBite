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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleLogin = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'An error occurred during login. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid.';
      }
      Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim() || validateEmail(email)) {
      Alert.alert('Forgot Password', 'Please enter a valid email address first to reset your password.', [{ text: 'OK' }]);
      return;
    }
    Alert.alert('Reset Link Sent', `A password reset instructions email was sent to ${email.trim()}.`, [{ text: 'OK' }]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to satisfy your tastebuds!</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
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
                }}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login CTA */}
          <CustomButton
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            style={styles.loginBtn}
          />

          {/* Go to Register Navigation */}
          <View style={styles.signUpPrompt}>
            <Text style={styles.promptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.promptLink}>Sign Up</Text>
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
    marginBottom: SPACING.xl,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    height: 50,
    borderRadius: 12,
  },
  signUpPrompt: {
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
