// Login/Signup
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username: string): string => {
  if (!username.trim()) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  return '';
};

const validateEmailField = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email';
  return '';
};

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

// Custom hook for form validation
const useFormValidation = (isLogin: boolean) => {
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    username: '',
    general: '',
  });

  const validateForm = (email: string, password: string, username: string): boolean => {
    const usernameError = isLogin ? '' : validateUsername(username);
    
    const newErrors = {
      email: validateEmailField(email),
      password: validatePassword(password),
      username: usernameError,
      general: '',
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.username;
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const setGeneralError = (message: string) => {
    setErrors(prev => ({ ...prev, general: message }));
  };

  const clearAllErrors = () => {
    setErrors({ email: '', password: '', username: '', general: '' });
  };

  return { errors, validateForm, clearError, setGeneralError, clearAllErrors };
};

// Custom hook for animations
const useAuthAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { fadeAnim, slideAnim, scaleAnim };
};

// Input Field Component
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
}: any) => (
  <View>
    <View style={[styles.inputContainer, error && styles.inputError]}>
      <Ionicons
        name={icon}
        size={20}
        color={error ? '#EF4444' : 'rgba(255, 255, 255, 0.6)'}
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, showPasswordToggle && styles.passwordInput]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        keyboardType={keyboardType}
      />
      {showPasswordToggle && (
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={error ? '#EF4444' : 'rgba(255, 255, 255, 0.6)'}
          />
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorLabel}>{error}</Text> : null}
  </View>
);

// Toggle Button Component
const ToggleButton = ({ isActive, onPress, label }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
  >
    <LinearGradient
      colors={isActive ? ['#7C3AED', '#3B82F6'] : ['transparent', 'transparent']}
      style={styles.toggleGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.toggleText, isActive && styles.toggleTextActive]}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { errors, validateForm, clearError, setGeneralError, clearAllErrors } = useFormValidation(isLogin);
  const { fadeAnim, slideAnim, scaleAnim } = useAuthAnimations();

  const handleSubmit = async () => {
    clearAllErrors();

    if (!validateForm(email, password, username)) {
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setUsername('');
    clearAllErrors();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#6B46C1', '#3B82F6', '#4F46E5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={20} tint="light" style={styles.glassCard}>
              {/* Header */}
              <LinearGradient
                colors={['#7C3AED', '#3B82F6', '#4F46E5']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.headerContent}>
                  <Ionicons name="camera" size={48} color="white" />
                  <Text style={styles.title}>Framez</Text>
                </View>
                <Text style={styles.subtitle}>Share Your Moments ✨</Text>
              </LinearGradient>

              {/* Toggle Buttons */}
              <View style={styles.toggleContainer}>
                <ToggleButton
                  isActive={isLogin}
                  onPress={() => !isLogin && toggleMode()}
                  label="Login"
                />
                <ToggleButton
                  isActive={!isLogin}
                  onPress={() => isLogin && toggleMode()}
                  label="Sign Up"
                />
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* General Error */}
                {errors.general ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.general}</Text>
                  </View>
                ) : null}

                {/* Username (Sign up only) */}
                {!isLogin && (
                  <InputField
                    icon="person-outline"
                    placeholder="Username"
                    value={username}
                    onChangeText={(text: string) => {
                      setUsername(text);
                      clearError('username');
                    }}
                    error={errors.username}
                  />
                )}

                {/* Email */}
                <InputField
                  icon="mail-outline"
                  placeholder="Email"
                  value={email}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    clearError('email');
                  }}
                  error={errors.email}
                  keyboardType="email-address"
                />

                {/* Password */}
                <InputField
                  icon="lock-closed-outline"
                  placeholder="Password"
                  value={password}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={styles.submitButton}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#3B82F6', '#4F46E5']}
                    style={styles.submitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <View style={styles.submitContent}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.submitText}>Processing...</Text>
                      </View>
                    ) : (
                      <View style={styles.submitContent}>
                        <Text style={styles.submitText}>
                          {isLogin ? 'Login' : 'Create Account'}
                        </Text>
                        <Ionicons name="sparkles" size={20} color="white" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.footerLink}>
                      {isLogin ? 'Sign up' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  glassCard: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 25,
    margin: 20,
    padding: 4,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggleButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  toggleGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  toggleTextActive: {
    color: 'white',
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  errorLabel: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  footerLink: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AuthScreen;