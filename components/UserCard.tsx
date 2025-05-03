import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { MapPin, MessageCircle, Star, X, MoreVertical } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from '@/types/user';
import IntimacyPreferences from './IntimacyPreferences';
import { router } from 'expo-router';

interface UserCardProps {
  user: User;
  onPress?: () => void;
}

export default function UserCard({ user, onPress }: UserCardProps) {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to user profile
      router.push(`/profile/${user.id}`);
    }
  };
  
  const handleMessage = (e: any) => {
    e.stopPropagation();
    // Navigate to chat with user
    router.push(`/chat/${user.id}`);
  };
  
  const handleOptionsPress = (e: any) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };
  
  const handleFavorite = (e: any) => {
    e.stopPropagation();
    setShowActions(false);
    Alert.alert("Added to Favorites", `${user.username} has been added to your favorites.`);
  };
  
  const handleBlock = (e: any) => {
    e.stopPropagation();
    setShowActions(false);
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${user.username}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Block",
          style: "destructive",
          onPress: () => Alert.alert("Blocked", `${user.username} has been blocked.`)
        }
      ]
    );
  };
  
  return (
    <Pressable 
      style={[
        styles.card, 
        { backgroundColor: colors.cardBackground },
        isPressed && styles.cardPressed
      ]}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: user.profilePicture }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.imageOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.optionsButton}
              onPress={handleOptionsPress}
            >
              <MoreVertical size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleMessage}
            >
              <MessageCircle size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.indicator}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: user.isOnline ? colors.success : '#FF9800' }
          ]} />
        </View>
        
        {showActions && (
          <View style={styles.actionsMenu}>
            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={handleFavorite}
            >
              <Star size={16} color={colors.text} />
              <Text style={[styles.actionMenuText, { color: colors.text }]}>
                Favorite
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionMenuItem}
              onPress={handleBlock}
            >
              <X size={16} color={colors.text} />
              <Text style={[styles.actionMenuText, { color: colors.text }]}>
                Block
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user.username}, {user.age}
          </Text>
          <Text style={[styles.gender, { color: colors.textSecondary }]}>
            {user.gender}
          </Text>
        </View>
        
        <View style={styles.location}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={[styles.distance, { color: colors.textSecondary }]}>
            {user.distance} km away
          </Text>
        </View>
        
        {user.bio ? (
          <Text 
            style={[styles.bio, { color: colors.text }]}
            numberOfLines={2}
          >
            {user.bio}
          </Text>
        ) : null}
        
        <IntimacyPreferences user={user} showFull={false} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle overlay
  },
  topControls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsMenu: {
    position: 'absolute',
    top: 44,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionMenuText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  indicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  gender: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 8,
  }
}); 