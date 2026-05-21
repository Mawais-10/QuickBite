import React from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { CustomButton } from '../../components/CustomButton';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* High-quality pizza background image */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for text readability */}
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            {/* App Logo Emblem */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🍔</Text>
            </View>

            {/* Typography headings */}
            <Text style={styles.appName}>QuickBite</Text>
            <Text style={styles.tagline}>Tasty meals, lightning fast delivery</Text>
            
            <Text style={styles.description}>
              Satisfy your cravings instantly by ordering from the best restaurants around you.
            </Text>

            {/* CTA Action Buttons */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Get Started"
                onPress={() => navigation.navigate('SignUp')}
                variant="primary"
                style={styles.btn}
              />
              
              <CustomButton
                title="Log In"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                style={styles.btnOutline}
                textStyle={{ color: COLORS.white }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 30, 21, 0.8)', // Organic dark forest-green overlay
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    fontSize: 36,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  tagline: {
    ...TYPOGRAPHY.h3,
    color: COLORS.accent, // Gold accent to match Gourmet Emerald
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: '#D0D0E0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  btn: {
    width: '100%',
    height: 52,
  },
  btnOutline: {
    width: '100%',
    height: 52,
    borderColor: COLORS.white,
  },
});
