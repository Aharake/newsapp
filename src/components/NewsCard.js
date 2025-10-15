import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const NewsCard = ({ article, index }) => {
  const handlePress = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      useNativeDriver
    >
      <TouchableOpacity 
        style={styles.card} 
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {article.image && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: article.image }} 
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(74,144,226,0.25)", "rgba(74,144,226,0.4)"]}
              style={styles.imageOverlay}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
          <View style={styles.footer}>
            <View style={styles.sourceBadge}>
              <Text style={styles.source}>{article.source.name}</Text>
            </View>
            <Text style={styles.date}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  content: {
    padding: 16,
    backgroundColor: '#FAFCFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1A3A52',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#5A7A94',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sourceBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  source: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: '#90A4AE',
    fontWeight: '500',
  },
});

export default NewsCard;
