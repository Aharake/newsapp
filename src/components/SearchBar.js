import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';

const SearchBar = ({ 
  value, 
  onChangeText, 
  onSearch, 
  placeholder = 'Search news...',
  searchType = 'keywords'
}) => {
  const [focusAnim] = useState(new Animated.Value(0));

  const handleFocus = () => {
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B3E5FC', '#4A90E2'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
            shadowOpacity: shadowOpacity,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#90CAF9"
          returnKeyType="search"
          onSubmitEditing={onSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onSearch}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#1A3A52',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4A90E2',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default SearchBar;
