import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';

// Filters for matching
type FilterPreferences = {
  ageRange: [number, number];
  maxDistance: number;
  showOnlineOnly: boolean;
  heightRange: [number, number];
  bodyTypes: string[];
  relationshipStatus: string[];
};

// Body type options
const bodyTypeOptions = ["Slim", "Average", "Athletic", "Muscular", "Large", "Stocky"];

// Relationship status options
const relationshipOptions = ["Single", "Dating", "Open relationship", "Partnered", "Married"];

export default function FilteringPreferences() {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<FilterPreferences>({
    ageRange: [18, 65],
    maxDistance: 25,
    showOnlineOnly: false,
    heightRange: [150, 210], // In cm
    bodyTypes: [],
    relationshipStatus: [],
  });

  // Toggle selection in array-based filters
  const toggleOption = (category: 'bodyTypes' | 'relationshipStatus', option: string) => {
    if (filters[category].includes(option)) {
      setFilters({
        ...filters,
        [category]: filters[category].filter(item => item !== option)
      });
    } else {
      setFilters({
        ...filters,
        [category]: [...filters[category], option]
      });
    }
  };

  // Update min age while ensuring it's not greater than max
  const updateMinAge = (value: string) => {
    const newMinAge = parseInt(value) || 18;
    setFilters({
      ...filters,
      ageRange: [
        Math.min(newMinAge, filters.ageRange[1]), 
        filters.ageRange[1]
      ]
    });
  };

  // Update max age while ensuring it's not less than min
  const updateMaxAge = (value: string) => {
    const newMaxAge = parseInt(value) || 18;
    setFilters({
      ...filters,
      ageRange: [
        filters.ageRange[0], 
        Math.max(newMaxAge, filters.ageRange[0])
      ]
    });
  };

  // Update distance filter
  const updateDistance = (value: string) => {
    const newDistance = parseInt(value) || 1;
    setFilters({
      ...filters,
      maxDistance: Math.max(1, newDistance)
    });
  };

  const handleSave = () => {
    // Here you would typically save these preferences to your backend
    router.back();
  };

  const OptionToggle = ({ category, option }: { category: 'bodyTypes' | 'relationshipStatus', option: string }) => (
    <TouchableOpacity
      style={[
        styles.toggleOption,
        { 
          backgroundColor: filters[category].includes(option) ? colors.primary : colors.cardBackground,
          borderColor: colors.border 
        }
      ]}
      onPress={() => toggleOption(category, option)}
    >
      <Text 
        style={[
          styles.toggleOptionText,
          { color: filters[category].includes(option) ? '#ffffff' : colors.text }
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Filtering Options</Text>
          <View style={styles.rightPlaceholder} />
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SlidersHorizontal size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Age Range</Text>
            </View>
            <View style={styles.rangeInputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Min</Text>
                <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={filters.ageRange[0].toString()}
                    onChangeText={updateMinAge}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>
              <Text style={[styles.rangeDivider, { color: colors.textSecondary }]}>to</Text>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max</Text>
                <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={filters.ageRange[1].toString()}
                    onChangeText={updateMaxAge}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SlidersHorizontal size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Distance</Text>
            </View>
            <View style={styles.distanceInputContainer}>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.cardBackground, flex: 1 }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={filters.maxDistance.toString()}
                  onChangeText={updateDistance}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <Text style={[styles.unitText, { color: colors.textSecondary }]}>km</Text>
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Shows people within this distance from you
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SlidersHorizontal size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Type (Optional)</Text>
            </View>
            <View style={styles.optionsContainer}>
              {bodyTypeOptions.map(option => (
                <OptionToggle key={option} category="bodyTypes" option={option} />
              ))}
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Select multiple options or none to see everyone
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SlidersHorizontal size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Relationship Status (Optional)</Text>
            </View>
            <View style={styles.optionsContainer}>
              {relationshipOptions.map(option => (
                <OptionToggle key={option} category="relationshipStatus" option={option} />
              ))}
            </View>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Select multiple options or none to see everyone
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Apply Filters</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  rightPlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  rangeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  rangeDivider: {
    marginHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  distanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitText: {
    marginLeft: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleOption: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  toggleOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
}); 