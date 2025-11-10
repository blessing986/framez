import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type Profile = {
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

const ProfileScreen = () => {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAllData = () => {
    setRefreshing(true);
    fetchProfile();
    fetchUserPosts();
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchUserPosts();
    }, [])
  );

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          signOut().catch((error: any) => {
            Alert.alert('Error', error.message);
          });
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postItem}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.postThumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.postThumbnail, styles.noImagePost]}>
          <Ionicons name="text" size={32} color="#9CA3AF" />
          <Text style={styles.postPreviewText} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F9FAFB', '#F3F4F6']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchAllData}
              tintColor="#7C3AED"
            />
          }>
          {/* Header Section */}

          <LinearGradient
            colors={['#7C3AED', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}>
            <View style={styles.avatarWrapper}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={['#A78BFA', '#7C3AED']}
                  style={styles.avatar}>
                  <Text style={styles.avatarInitial}>
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
              )}
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark-circle" size={28} color="#10B981" />
              </View>
            </View>

            {/* User Info */}
            <Text style={styles.name}>{profile?.username}</Text>
            <Text style={styles.email}>{profile?.email}</Text>
            <Text style={styles.joined}>
              Joined{' '}
              {profile?.created_at
                ? formatDate(profile.created_at)
                : 'Recently'}
            </Text>

            {/* Stats */}

            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>120</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>89</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Posts Section */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Posts</Text>
              <Ionicons name="grid-outline" size={20} color="#7C3AED" />
            </View>

            {posts.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="images-outline" size={60} color="#A78BFA" />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySub}>Start sharing your moments</Text>
              </View>
            ) : (
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.grid}
              />
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  headerGradient: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  avatarWrapper: {
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarInitial: { fontSize: 42, color: 'white', fontWeight: '700' },

  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 2,
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  joined: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },

  logoutBtn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
  },

  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },

  grid: { gap: 8, paddingTop: 16 },

  postImage: { width: '100%', height: '100%' },
  noImageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  noImageText: {
    color: '#6B21A8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },

  empty: { alignItems: 'center', marginTop: 50 },
  emptyText: {
    color: '#6B21A8',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 12,
  },
  emptySub: { color: '#9CA3AF', fontSize: 14, marginTop: 6 },

  postItem: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: '32%',
  },
  postThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  noImagePost: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  postPreviewText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default ProfileScreen;
