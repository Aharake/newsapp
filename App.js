import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import NewsCard from './src/components/NewsCard';
import SearchBar from './src/components/SearchBar';
import { 
  fetchNewsArticles, 
  findArticleByTitleOrAuthor, 
  searchByKeywords 
} from './src/services/newsService';

function AppContent() {
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [numberOfArticles, setNumberOfArticles] = useState(10);
  const [searchType, setSearchType] = useState('title');
  const [dateFilter, setDateFilter] = useState('all');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [tabAnimation] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 30, 120],
    outputRange: [1, 0.9, 0],
    extrapolate: 'clamp'
  });
  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 60, 180],
    outputRange: [1, 0.95, 0],
    extrapolate: 'clamp'
  });
  const [headerH, setHeaderH] = useState(0);
  const [tabsH, setTabsH] = useState(0);
  const [tabContentH, setTabContentH] = useState(0);
  const topHeight = headerH + tabsH + tabContentH;
  const translateY = scrollY.interpolate({
    inputRange: [0, Math.max(topHeight, 1)],
    outputRange: [0, -Math.max(topHeight, 1)],
    extrapolate: 'clamp'
  });
  const spacerTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(topHeight, 1)],
    outputRange: [0, -Math.max(topHeight, 1)],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    loadInitialArticles();
  }, []);

  const filterArticlesByDate = (articles, filter) => {
    if (filter === 'all') return articles;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    return articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      
      switch (filter) {
        case 'today':
          return articleDate >= todayStart;
        case 'week':
          return articleDate >= weekStart;
        case 'year':
          return articleDate >= yearStart;
        default:
          return true;
      }
    });
  };

  const loadInitialArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsArticles(10);
      const filtered = filterArticlesByDate(data, dateFilter);
      setArticles(filtered);
    } catch (error) {
      Alert.alert('Error', 'Failed to load articles. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsArticles(numberOfArticles);
      const filtered = filterArticlesByDate(data, dateFilter);
      setArticles(filtered);
      Alert.alert('Success', `Fetched ${filtered.length} articles`);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }
    
    setLoading(true);
    try {
      const data = await searchByKeywords(searchQuery, 10);
      const filtered = filterArticlesByDate(data, dateFilter);
      setArticles(filtered);
      if (filtered.length === 0) {
        Alert.alert('No Results', 'No articles found for your search');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search articles');
    } finally {
      setLoading(false);
    }
  };

  const handleFindArticle = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }
    
    setLoading(true);
    try {
      const article = await findArticleByTitleOrAuthor(searchQuery, searchType);
      if (article) {
        const filtered = filterArticlesByDate([article], dateFilter);
        setArticles(filtered);
        if (filtered.length > 0) {
          Alert.alert('Found', 'Article found!');
        } else {
          Alert.alert('Not Found', `Article found but doesn't match date filter`);
        }
      } else {
        setArticles([]);
        Alert.alert('Not Found', `No article found with ${searchType}: "${searchQuery}"`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find article');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <Animatable.View 
            animation="fadeInRight" 
            duration={400}
            style={styles.tabContent}
          >
            <Text style={styles.label}>Number of Articles:</Text>
            <View style={styles.numberSelector}>
              {[5, 10, 20, 50].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberButton,
                    numberOfArticles === num && styles.numberButtonActive
                  ]}
                  onPress={() => setNumberOfArticles(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.numberButtonText,
                    numberOfArticles === num && styles.numberButtonTextActive
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>📅 Filter by Date:</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setDateDropdownOpen(!dateDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownHeaderText}>
                  {
                    dateFilter === 'all' ? '📰 All Time' :
                    dateFilter === 'today' ? '📆 Today' :
                    dateFilter === 'week' ? '📅 This Week' :
                    '🗓️ This Year'
                  }
                </Text>
                <Text style={styles.dropdownArrow}>
                  {dateDropdownOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {dateDropdownOpen && (
                <Animatable.View 
                  animation="fadeInDown" 
                  duration={300}
                  style={styles.dropdownList}
                >
                  {[
                    { value: 'all', label: 'All Time', icon: '📰' },
                    { value: 'today', label: 'Today', icon: '📆' },
                    { value: 'week', label: 'This Week', icon: '📅' },
                    { value: 'year', label: 'This Year', icon: '🗓️' }
                  ].map((filter) => (
                    <TouchableOpacity
                      key={filter.value}
                      style={[
                        styles.dropdownItem,
                        dateFilter === filter.value && styles.dropdownItemActive
                      ]}
                      onPress={() => {
                        setDateFilter(filter.value);
                        setDateDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        dateFilter === filter.value && styles.dropdownItemTextActive
                      ]}>
                        {filter.icon} {filter.label}
                      </Text>
                      {dateFilter === filter.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </Animatable.View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleFetchArticles}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>✨ Fetch Articles</Text>
            </TouchableOpacity>
          </Animatable.View>
        );
      
      case 'search':
        return (
          <Animatable.View 
            animation="fadeInRight" 
            duration={400}
            style={styles.tabContent}
          >
            <Text style={styles.label}>🔍 Search by Keywords:</Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleKeywordSearch}
              placeholder="Enter keywords..."
            />
          </Animatable.View>
        );
      
      case 'find':
        return (
          <Animatable.View 
            animation="fadeInRight" 
            duration={400}
            style={styles.tabContent}
          >
            <Text style={styles.label}>🎯 Find by Title or Author:</Text>
            <View style={styles.searchTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.searchTypeButton,
                  searchType === 'title' && styles.searchTypeButtonActive
                ]}
                onPress={() => setSearchType('title')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.searchTypeButtonText,
                  searchType === 'title' && styles.searchTypeButtonTextActive
                ]}>
                  📰 Title
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.searchTypeButton,
                  searchType === 'author' && styles.searchTypeButtonActive
                ]}
                onPress={() => setSearchType('author')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.searchTypeButtonText,
                  searchType === 'author' && styles.searchTypeButtonTextActive
                ]}>
                  ✍️ Author
                </Text>
              </TouchableOpacity>
            </View>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleFindArticle}
              placeholder={`Enter ${searchType}...`}
            />
          </Animatable.View>
        );
      
      default:
        return null;
    }
  };

  return (
      <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Collapsing top area (header + tabs + tab content) */}
  <Animated.View style={[styles.topContainer, { transform: [{ translateY }], opacity: headerOpacity }]}>
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          style={[styles.header, { paddingTop: 15 + Math.max(insets.top, 10) }]}
          onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>📰</Text>
            <Text style={styles.headerTitle}>News Hub</Text>
          </View>
        </Animatable.View>

        <Animated.View
          style={[styles.tabs, { opacity: headerOpacity.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }]}
          onLayout={(e) => setTabsH(e.nativeEvent.layout.height)}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'browse' && styles.tabActive]}
            onPress={() => setActiveTab('browse')}
          >
            <Text style={[styles.tabText, activeTab === 'browse' && styles.tabTextActive]}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.tabActive]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'find' && styles.tabActive]}
            onPress={() => setActiveTab('find')}
          >
            <Text style={[styles.tabText, activeTab === 'find' && styles.tabTextActive]}>Find</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{ opacity: contentOpacity }}
          onLayout={(e) => setTabContentH(e.nativeEvent.layout.height)}
        >
          {renderTabContent()}
        </Animated.View>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite"
            duration={1500}
          >
            <ActivityIndicator size="large" color="#4A90E2" />
          </Animatable.View>
          <Animatable.Text 
            animation="fadeIn"
            style={styles.loadingText}
          >
            Loading articles...
          </Animatable.Text>
        </View>
      ) : (
        <Animated.FlatList
          data={articles}
          renderItem={({ item, index }) => <NewsCard article={item} index={index} />}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          contentContainerStyle={[styles.list, { paddingBottom: 24 }]}
          ListHeaderComponent={() => (
            <Animated.View style={{ height: topHeight, transform: [{ translateY: spacerTranslateY }] }} />
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <Animatable.View 
              animation="fadeIn"
              duration={800}
              style={styles.emptyContainer}
            >
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No articles to display</Text>
              <Text style={styles.emptySubtext}>
                Try fetching or searching for articles
              </Text>
            </Animatable.View>
          }
        />
      )}
      </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A3A52',
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 15,
    color: '#90A4AE',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContent: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1A3A52',
  },
  numberSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  numberButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#B3E5FC',
    minWidth: 65,
    alignItems: 'center',
  },
  numberButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  numberButtonText: {
    fontSize: 16,
    color: '#5A7A94',
    fontWeight: '600',
  },
  numberButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B3E5FC',
  },
  searchTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchTypeButtonText: {
    fontSize: 15,
    color: '#5A7A94',
    fontWeight: '600',
  },
  searchTypeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  list: {
    padding: 18,
    paddingTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4F8',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: '#5A7A94',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#5A7A94',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#90A4AE',
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 18,
    position: 'relative',
    zIndex: 1000,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#B3E5FC',
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#1A3A52',
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '700',
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B3E5FC',
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  dropdownItemActive: {
    backgroundColor: '#E3F2FD',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#5A7A94',
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '700',
  },
});
