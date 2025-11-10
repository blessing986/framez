import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

const CreatePost = ({ navigation }: any) => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileExt = uri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, arrayBuffer, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (imageUri) imageUrl = await uploadImage(imageUri);

      const { error } = await supabase.from('posts').insert({
        user_id: session?.user.id,
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      Alert.alert('Success! 🎉', 'Your post has been shared!', [
        {
          text: 'OK',
          onPress: () => {
            setContent('');
            setImageUri(null);
            navigation.navigate('Feed');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#F5F3FF', '#EEF2FF']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Post</Text>
            <Text style={styles.subtitle}>Share your thoughts or a moment</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="What's happening?"
                placeholderTextColor="#A1A1AA"
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={500}
              />
              <Text style={styles.counter}>{content.length}/500</Text>
            </View>

            {imageUri && (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={pickImage}
                disabled={loading}
              >
                <Ionicons name="images-outline" size={22} color="#7C3AED" />
                <Text style={styles.iconText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={takePhoto}
                disabled={loading}
              >
                <Ionicons name="camera-outline" size={22} color="#3B82F6" />
                <Text style={styles.iconText}>Camera</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.postButton, loading && { opacity: 0.6 }]}
              onPress={handlePost}
              disabled={loading}
            >
              <LinearGradient
                colors={['#7C3AED', '#4F46E5']}
                style={styles.postGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.postContent}>
                    <Ionicons name="send" size={18} color="white" />
                    <Text style={styles.postText}>Post</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.tipsContainer}>
            <LinearGradient
              colors={['rgba(124, 58, 237, 0.1)', 'rgba(59, 130, 246, 0.1)']}
              style={styles.tipsGradient}
            >
              <Ionicons name="bulb-outline" size={20} color="#7C3AED" />
              <Text style={styles.tipsText}>
                💡 Tip: Add images to make your posts more engaging!
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: { padding: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1B4B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    fontSize: 12,
    color: '#9CA3AF',
  },
  imagePreviewWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  iconButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  iconText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  postButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#7C3AED',
  },
  postGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
   tipsContainer: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default CreatePost;
