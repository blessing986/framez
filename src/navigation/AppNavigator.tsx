import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import AuthScreen from '../screens/Auth';
import FeedScreen from '../screens/FeedScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: '600' }}>{title}</Text>
  </View>
);

const renderTabBarIcon = (
  routeName: string,
  focused: boolean,
  color: string,
  size: number
) => {
  let iconName: any;

  if (routeName === 'Feed') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (routeName === 'Create') {
    iconName = focused ? 'add-circle' : 'add-circle-outline';
  } else if (routeName === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) =>
        renderTabBarIcon(route.name, focused, color, size),
      tabBarActiveTintColor: '#7C3AED',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      headerStyle: {
        backgroundColor: '#7C3AED',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />

    <Tab.Screen name="Create" options={{ title: 'New Post' }}>
      {() => <PlaceholderScreen title="Create Post Screen" />}
    </Tab.Screen>

    <Tab.Screen name="Profile">
      {() => <PlaceholderScreen title="Profile Screen" />}
    </Tab.Screen>
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
