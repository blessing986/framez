// src/components/FloatingNav.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const FloatingNav = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {expanded && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Feed');
              setExpanded(false);
            }}
          >
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={styles.gradient}
            >
              <Ionicons name="home" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.label}>Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Create');
              setExpanded(false);
            }}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.gradient}
            >
              <Ionicons name="add" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.label}>New Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Profile');
              setExpanded(false);
            }}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.gradient}
            >
              <Ionicons name="person" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.label}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setExpanded(!expanded)}
      >
        <LinearGradient
          colors={['#7C3AED', '#3B82F6']}
          style={styles.gradient}
        >
          <Ionicons
            name={expanded ? 'close' : 'menu'}
            size={28}
            color="white"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  menuContainer: {
    marginBottom: 20,
    gap: 16, 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default FloatingNav;