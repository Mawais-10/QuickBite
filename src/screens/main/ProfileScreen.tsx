import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/CustomButton';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../../theme';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to sign out of your QuickBite account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert('Error', 'Logout failed. Please try again.');
          }
        }
      }
    ]);
  };

  const handleMockAction = (title: string) => {
    Alert.alert(title, `This feature is coming soon in v1.1.0! Thank you for using QuickBite.`, [{ text: 'Great' }]);
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const parts = user.email.split('@');
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return 'Foodie Gamer';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getUserName().charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{getUserName()}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          
          <View style={styles.statsStrip}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>Premium</Text>
              <Text style={styles.statLbl}>Account Status</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>USD ($)</Text>
              <Text style={styles.statLbl}>Currency</Text>
            </View>
          </View>
        </View>

        {/* Mock Settings Options List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleMockAction('Profile Info')} style={styles.optionRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FF6B3515' }]}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.optionText}>Personal Details</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => handleMockAction('Payment Methods')} style={styles.optionRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#27AE6015' }]}>
              <Ionicons name="card" size={20} color={COLORS.success} />
            </View>
            <Text style={styles.optionText}>Saved Payments</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => handleMockAction('Delivery Addresses')} style={styles.optionRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#2F80ED15' }]}>
              <Ionicons name="location" size={20} color="#2F80ED" />
            </View>
            <Text style={styles.optionText}>Delivery Locations</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleMockAction('Help Center')} style={styles.optionRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#9B51E015' }]}>
              <Ionicons name="help-circle" size={20} color="#9B51E0" />
            </View>
            <Text style={styles.optionText}>Help & Customer Support</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => handleMockAction('Share App')} style={styles.optionRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#F2C94C15' }]}>
              <Ionicons name="share-social" size={20} color="#F2C94C" />
            </View>
            <Text style={styles.optionText}>Invite Friends & Earn Points</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.placeholder} />
          </TouchableOpacity>
        </View>

        {/* App specs & version information */}
        <View style={styles.infoCard}>
          <Text style={styles.appNameText}>🍔 QuickBite Delivery</Text>
          <Text style={styles.appDescText}>Built with React Native, Expo, and Cloud Firebase.</Text>
          <Text style={styles.versionText}>Version 1.0.0 (Stable)</Text>
        </View>

        {/* Red Log Out button */}
        <CustomButton
          title="Sign Out Account"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  profileHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary + '30',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    marginBottom: 2,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.placeholder,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 25,
    backgroundColor: COLORS.border,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    color: COLORS.dark,
    marginVertical: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 0.5,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  optionText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.dark,
  },
  infoCard: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  appNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  appDescText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 2,
    color: COLORS.placeholder,
  },
  logoutBtn: {
    height: 48,
    borderRadius: 12,
    marginTop: SPACING.xs,
  },
});
