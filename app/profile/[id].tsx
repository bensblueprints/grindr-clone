import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageCircle, MapPin, X, Lock, Image as ImageIcon, ChevronRight } from 'lucide-react-native';
import { useMockUsers } from '@/hooks/useMockUsers';
import { User } from '@/types/user';
import IntimacyPreferences from '@/components/IntimacyPreferences';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { users, loading } = useMockUsers();
  const [user, setUser] = useState<User | null>(null);
  const [photoGalleryVisible, setPhotoGalleryVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  
  // Mock photos array - in a real app, this would come from the user object
  const [userPhotos, setUserPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (users.length > 0 && id) {
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
        
        // Set mock photos for the gallery
        const mockPhotos = [
          foundUser.profilePicture,
          "https://randomuser.me/api/portraits/men/33.jpg",
          "https://randomuser.me/api/portraits/men/34.jpg",
          "https://randomuser.me/api/portraits/men/35.jpg",
          "https://randomuser.me/api/portraits/men/36.jpg"
        ];
        setUserPhotos(mockPhotos);
      }
    }
  }, [users, id]);

  const handleMessage = () => {
    if (user) {
      // Navigate to chat with this user
      router.push(`/chat/${user.id}`);
    }
  };
  
  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
    setPhotoGalleryVisible(true);
  };
  
  const handleRequestHiddenAlbum = () => {
    Alert.alert(
      "Request Hidden Album",
      "Would you like to request access to this user's private photos?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Request Access",
          onPress: () => {
            // Show confirmation and simulate sending a request
            Alert.alert("Request Sent", "Your request has been sent. You'll be notified when they respond.");
          }
        }
      ]
    );
  };

  if (loading || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </SafeAreaView>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: colors.primary }]}
            onPress={handleMessage}
          >
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => handlePhotoPress(0)}
            >
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.profileImage} 
              />
              {user.isOnline && (
                <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
              )}
              <View style={styles.photoCountBadge}>
                <ImageIcon size={12} color="#FFFFFF" />
                <Text style={styles.photoCountText}>{userPhotos.length}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user.username}, {user.age}
              </Text>
              <Text style={[styles.profileGender, { color: colors.textSecondary }]}>
                {user.gender}
              </Text>
              
              {user.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                    {user.location} • {user.distance} km away
                  </Text>
                </View>
              )}
              
              <Text style={[styles.lastActive, { color: colors.textSecondary }]}>
                {user.isOnline ? 'Online now' : `Last active ${user.lastActive}`}
              </Text>
              
              <TouchableOpacity 
                style={[styles.fullWidthButton, { backgroundColor: colors.primary }]}
                onPress={handleMessage}
              >
                <MessageCircle size={18} color="#FFFFFF" />
                <Text style={styles.fullWidthButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Photo Gallery Preview */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
              <TouchableOpacity onPress={() => setPhotoGalleryVisible(true)}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoGrid}
            >
              {userPhotos.slice(0, 4).map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.thumbnailContainer}
                  onPress={() => handlePhotoPress(index)}
                >
                  <Image source={{ uri: photo }} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
              {userPhotos.length > 4 && (
                <TouchableOpacity
                  style={[styles.morePhotosButton, { backgroundColor: colors.cardBackground }]}
                  onPress={() => setPhotoGalleryVisible(true)}
                >
                  <Text style={[styles.morePhotosText, { color: colors.primary }]}>
                    +{userPhotos.length - 4}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          
          {/* Request Hidden Album Button */}
          <TouchableOpacity
            style={[styles.hiddenAlbumButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleRequestHiddenAlbum}
          >
            <View style={styles.hiddenAlbumContent}>
              <Lock size={18} color={colors.primary} />
              <Text style={[styles.hiddenAlbumText, { color: colors.text }]}>
                Request Private Photos
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {user.bio && (
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
              <Text style={[styles.bioText, { color: colors.textSecondary }]}>
                {user.bio}
              </Text>
            </View>
          )}
          
          {user.interests && user.interests.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Interests</Text>
              <View style={styles.interestsContainer}>
                {user.interests.map((interest, index) => (
                  <View 
                    key={index} 
                    style={[styles.interestTag, { backgroundColor: colors.background }]}
                  >
                    <Text style={[styles.interestText, { color: colors.text }]}>
                      {interest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <IntimacyPreferences user={user} showFull={true} />
        </ScrollView>
      </SafeAreaView>
      
      {/* Photo Gallery Modal */}
      <Modal
        visible={photoGalleryVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoGalleryVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPhotoGalleryVisible(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <FlatList
            data={userPhotos}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedPhotoIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image
                  source={{ uri: item }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          
          <View style={styles.photoIndicator}>
            {userPhotos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  { backgroundColor: index === selectedPhotoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' }
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  messageButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  profileGender: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  lastActive: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  fullWidthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  fullWidthButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  photoGrid: {
    paddingVertical: 8,
  },
  thumbnailContainer: {
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  morePhotosButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  morePhotosText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  hiddenAlbumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  hiddenAlbumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenAlbumText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  fullScreenImage: {
    width: 400,
    height: 500,
  },
  photoIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
}); 