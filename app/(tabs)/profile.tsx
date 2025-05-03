import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, MapPin, MapPinOff, Edit2, Image as ImageIcon, Plus, Trash2, Settings, Check } from 'lucide-react-native';
import { ProfileAttribute } from '@/components/ProfileAttribute';
import * as ImagePicker from 'expo-image-picker';
import IntimacyPreferences from '@/components/IntimacyPreferences';

// Mockup profile photos
const initialPhotos = [
  "https://randomuser.me/api/portraits/men/32.jpg",
];

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(initialPhotos[0]);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile info with editable fields
  const [profileInfo, setProfileInfo] = useState({
    name: "Alex", // Default name
    age: "28",
    bio: "Just moved to the city, looking to meet new people and have fun!",
    height: "180",
    weight: "75",
    ethnicity: "Mixed",
    location: "Downtown",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      // Update the first photo in the array
      const newPhotos = [...photos];
      newPhotos[0] = imageUri;
      setPhotos(newPhotos);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfileInfo({
      ...profileInfo,
      [field]: value
    });
  };

  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to add photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleDeletePhoto = (index: number) => {
    // Don't allow deleting if it's the last photo
    if (photos.length <= 1) {
      Alert.alert("Cannot Delete", "You must have at least one profile photo.");
      return;
    }

    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            setPhotos(newPhotos);
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call to save profile
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      Alert.alert("Success", "Your profile has been updated!");
    }, 1500);
  };

  const ProfileHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => router.push('/(tabs)/settings')}
      >
        <Settings size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const ProfilePhotos = () => (
    <View style={styles.photosSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosContainer}
      >
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoWrapper}>
            <Image
              source={{ uri: photo }}
              style={styles.profilePhoto}
            />
            {isEditing && (
              <TouchableOpacity 
                style={[styles.deletePhotoButton, { backgroundColor: colors.primary }]}
                onPress={() => handleDeletePhoto(index)}
              >
                <Trash2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {isEditing && photos.length < 6 && (
          <TouchableOpacity 
            style={[styles.addPhotoButton, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={handleAddPhoto}
          >
            <Plus size={32} color={colors.primary} />
            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  const ProfileInfo = () => (
    <View style={[styles.infoSection, { backgroundColor: colors.cardBackground }]}>
      {isEditing ? (
        <>
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Name</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              value={profileInfo.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Age</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              value={profileInfo.age}
              onChangeText={(text) => handleChange("age", text.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="Your age"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Bio</Text>
            <TextInput
              style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]}
              value={profileInfo.bio}
              onChangeText={(text) => handleChange("bio", text)}
              placeholder="Write something about yourself"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={300}
            />
          </View>
          
          <View style={styles.fieldRow}>
            <View style={[styles.fieldContainer, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Height (cm)</Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
                value={profileInfo.height}
                onChangeText={(text) => handleChange("height", text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="Height"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={[styles.fieldContainer, { flex: 1, marginLeft: 12 }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Weight (kg)</Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
                value={profileInfo.weight}
                onChangeText={(text) => handleChange("weight", text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="Weight"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Ethnicity</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              value={profileInfo.ethnicity}
              onChangeText={(text) => handleChange("ethnicity", text)}
              placeholder="Your ethnicity"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Location</Text>
            <TextInput
              style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              value={profileInfo.location}
              onChangeText={(text) => handleChange("location", text)}
              placeholder="Your location"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.profileHeader}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {profileInfo.name}, {profileInfo.age}
            </Text>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileBio, { color: colors.textSecondary }]}>
            {profileInfo.bio}
          </Text>
          
          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Height</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{profileInfo.height} cm</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Weight</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{profileInfo.weight} kg</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Ethnicity</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{profileInfo.ethnicity}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
              📍 {profileInfo.location}
            </Text>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ProfileHeader />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfilePhotos />
          <ProfileInfo />
          
          {/* Add IntimacyPreferences component with mock user data for profile */}
          {!isEditing && (
            <View style={styles.preferencesSection}>
              <IntimacyPreferences 
                user={{
                  id: "1",
                  username: profileInfo.name,
                  age: parseInt(profileInfo.age),
                  gender: "Male",
                  distance: 0,
                  profilePicture: photos[0],
                  sexualPreference: "Everyone",
                  sexualRole: "Versatile",
                  sexualPosition: "Both",
                  intimacyPreferences: ["Casual Dating", "Friendship"],
                  sexStyle: "Moderate",
                  hivStatus: "Negative",
                  safetyPractices: "Always practice safe sex",
                  showPreferencesPublicly: true
                }} 
                showFull={true} 
              />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Check size={20} color="#FFFFFF" style={styles.saveIcon} />
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          <View style={styles.spacer} />
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
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  photosSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  photosContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 200,
    height: 250,
    borderRadius: 12,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 160,
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    lineHeight: 24,
  },
  profileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  fieldInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  bioInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  spacer: {
    height: 50,
  },
  preferencesSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});