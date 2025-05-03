import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronRight, Bell, Shield, Eye, Moon, MapPin, 
  Trash2, LogOut, HelpCircle, FileText, Heart, Users, Filter
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const { logout, currentUser, updateUser } = useAuth();
  const [showLocation, setShowLocation] = useState(currentUser?.showLocation || false);
  const [notifications, setNotifications] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };
  
  const toggleLocationVisibility = () => {
    const newValue = !showLocation;
    setShowLocation(newValue);
    updateUser({ showLocation: newValue });
  };
  
  const SettingItem = ({ 
    icon, 
    title, 
    showChevron = true, 
    onPress,
    rightElement,
    danger = false
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text style={[
          styles.settingTitle, 
          { color: danger ? colors.error : colors.text }
        ]}>
          {title}
        </Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        showChevron && <ChevronRight size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              ACCOUNT
            </Text>
            
            <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground }]}>
              <SettingItem 
                icon={<Shield size={22} color={colors.primary} />}
                title="Privacy"
                onPress={() => {}}
              />
              
              <SettingItem 
                icon={<MapPin size={22} color={colors.primary} />}
                title="Location"
                rightElement={
                  <Switch
                    value={showLocation}
                    onValueChange={toggleLocationVisibility}
                    trackColor={{ false: colors.border, true: Platform.OS === 'ios' ? colors.primary : colors.primaryTransparent }}
                    thumbColor={Platform.OS === 'android' ? colors.primary : '#fff'}
                    ios_backgroundColor={colors.border}
                  />
                }
              />
              
              <SettingItem 
                icon={<Bell size={22} color={colors.primary} />}
                title="Notifications"
                rightElement={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: colors.border, true: Platform.OS === 'ios' ? colors.primary : colors.primaryTransparent }}
                    thumbColor={Platform.OS === 'android' ? colors.primary : '#fff'}
                    ios_backgroundColor={colors.border}
                  />
                }
              />
            </View>
          </View>

          {/* New Dating Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              DATING PREFERENCES
            </Text>
            
            <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground }]}>
              <SettingItem 
                icon={<Heart size={22} color={colors.primary} />}
                title="I'm interested in"
                onPress={() => router.push('/preferences/interests')}
              />
              
              <SettingItem 
                icon={<Users size={22} color={colors.primary} />}
                title="Sexual preferences"
                onPress={() => router.push('/preferences/sexual')}
              />

              <SettingItem 
                icon={<Filter size={22} color={colors.primary} />}
                title="Filtering options"
                onPress={() => router.push('/preferences/filtering')}
              />

              <SettingItem 
                icon={<Eye size={22} color={colors.primary} />}
                title="Show me online"
                rightElement={
                  <Switch
                    value={showOnline}
                    onValueChange={setShowOnline}
                    trackColor={{ false: colors.border, true: Platform.OS === 'ios' ? colors.primary : colors.primaryTransparent }}
                    thumbColor={Platform.OS === 'android' ? colors.primary : '#fff'}
                    ios_backgroundColor={colors.border}
                  />
                }
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              PREFERENCES
            </Text>
            
            <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground }]}>
              <SettingItem 
                icon={<Moon size={22} color={colors.primary} />}
                title="Dark Mode"
                rightElement={
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: Platform.OS === 'ios' ? colors.primary : colors.primaryTransparent }}
                    thumbColor={Platform.OS === 'android' ? colors.primary : '#fff'}
                    ios_backgroundColor={colors.border}
                  />
                }
              />
              
              <SettingItem 
                icon={<Eye size={22} color={colors.primary} />}
                title="Appearance"
                onPress={() => {}}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              SUPPORT
            </Text>
            
            <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground }]}>
              <SettingItem 
                icon={<HelpCircle size={22} color={colors.primary} />}
                title="Help Center"
                onPress={() => {}}
              />
              
              <SettingItem 
                icon={<FileText size={22} color={colors.primary} />}
                title="Terms of Service"
                onPress={() => {}}
              />
              
              <SettingItem 
                icon={<FileText size={22} color={colors.primary} />}
                title="Privacy Policy"
                onPress={() => {}}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground }]}>
              <SettingItem 
                icon={<LogOut size={22} color={colors.warning} />}
                title="Logout"
                onPress={handleLogout}
              />
              
              <SettingItem 
                icon={<Trash2 size={22} color={colors.error} />}
                title="Delete Account"
                danger
                onPress={handleDeleteAccount}
              />
            </View>
          </View>
          
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingsGroup: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});