import axios from 'axios';

const API_KEY =
  
  '964d599a44aebd5b93e0f85a97166a8b';
const BASE_URL = 'https://gnews.io/api/v4';

export const fetchNewsArticles = async (maxArticles = 10, category = 'general') => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        token: API_KEY,
        lang: 'en',
        max: Math.min(Number(maxArticles) || 10, 10),
        category: category
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }
};

export const findArticleByTitleOrAuthor = async (searchTerm, searchType = 'title') => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        token: API_KEY,
        q: searchTerm,
        lang: 'en',
        max: 10,
        in: searchType === 'title' ? 'title' : 'source'
      }
    });
    
    const articles = response.data.articles;
    
    if (searchType === 'title') {
      return articles.find(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType === 'author') {
      return articles.find(article => 
        (article.source?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return null;
  } catch (error) {
    console.error('Error finding article:', error);
    throw error;
  }
};

export const searchByKeywords = async (keywords, maxResults = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        token: API_KEY,
        q: keywords,
        lang: 'en',
        max: Math.min(Number(maxResults) || 10, 10)
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};
