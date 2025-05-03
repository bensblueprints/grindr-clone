import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from '@/types/user';

interface IntimacyPreferencesProps {
  user: User;
  showFull?: boolean; // If true, shows all preferences. If false, shows abbreviated version.
}

export default function IntimacyPreferences({ user, showFull = false }: IntimacyPreferencesProps) {
  const { colors } = useTheme();

  // Don't show anything if user has chosen not to display preferences publicly
  if (!user.showPreferencesPublicly && !showFull) {
    return null;
  }

  const renderPreferenceItem = (label: string, value: string | string[] | undefined) => {
    if (!value) return null;
    
    return (
      <View style={styles.preferenceItem}>
        <Text style={[styles.preferenceLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.preferenceValue, { color: colors.text }]}>
          {Array.isArray(value) ? value.join(', ') : value}
        </Text>
      </View>
    );
  };

  // Simplified preview to display in user cards
  if (!showFull) {
    const lookingFor = user.intimacyPreferences?.length 
      ? `Looking for: ${user.intimacyPreferences.join(', ')}`
      : null;

    return lookingFor ? (
      <View style={styles.previewContainer}>
        <Text style={[styles.previewText, { color: colors.textSecondary }]}>
          {lookingFor}
        </Text>
      </View>
    ) : null;
  }

  // Full preference display for profile page
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Intimacy Preferences
      </Text>
      
      <View style={styles.preferencesContainer}>
        {renderPreferenceItem('Interested in', user.sexualPreference)}
        {renderPreferenceItem('Role', user.sexualRole)}
        {renderPreferenceItem('Position', user.sexualPosition)}
        {renderPreferenceItem('Looking for', user.intimacyPreferences)}
        {renderPreferenceItem('Intimacy style', user.sexStyle)}
        {renderPreferenceItem('Health status', user.hivStatus)}
        {renderPreferenceItem('Safety practices', user.safetyPractices)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  preferencesContainer: {
    gap: 12,
  },
  preferenceItem: {
    gap: 4,
  },
  preferenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  preferenceValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  previewContainer: {
    marginTop: 4,
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
}); 