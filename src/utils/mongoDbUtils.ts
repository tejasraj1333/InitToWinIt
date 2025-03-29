
/**
 * MongoDB Utilities
 * 
 * This file contains utility functions for interacting with a MongoDB backend
 * and importing placeholder implementations that will be replaced when the 
 * actual backend is connected.
 */

import { NewsArticle } from "@/services/newsService";

// Interface for the API client
interface ApiClient {
  fetchNews: (query?: string, sourceId?: string | null) => Promise<any>;
  fetchSavedArticles: () => Promise<any>;
  saveArticle: (article: any) => Promise<any>;
  removeSavedArticle: (articleId: string) => Promise<any>;
  fetchNewsSourceSubscriptions: () => Promise<any>;
  subscribeToSource: (source: { id: string, name: string }) => Promise<any>;
  unsubscribeFromSource: (sourceId: string) => Promise<any>;
}

// Mock API client for development
const mockApiClient: ApiClient = {
  // Fetch news (will be replaced with actual API call)
  fetchNews: async (query = '', sourceId = null) => {
    console.log('Mock API: Fetching news', { query, sourceId });
    
    // This would be replaced with an actual API call to your backend
    // which would proxy the request to NewsAPI or another source
    const response = await fetch('https://newsapi.org/v2/everything?' + new URLSearchParams({
      q: query || 'India',
      ...(sourceId ? { sources: sourceId } : {}),
      apiKey: '7f380ba838a34cbb93f4f080babb5e8f',
      pageSize: '20'
    }));
    
    return response.json();
  },
  
  // Fetch saved articles (mock implementation)
  fetchSavedArticles: async () => {
    console.log('Mock API: Fetching saved articles');
    
    // Get saved articles from localStorage for now
    const saved = localStorage.getItem('savedArticles');
    const savedIds = saved ? JSON.parse(saved) : [];
    
    // In real implementation, this would fetch the full articles from MongoDB
    return { articles: savedIds.map((id: string) => ({ _id: id })) };
  },
  
  // Save an article (mock implementation)
  saveArticle: async (article: any) => {
    console.log('Mock API: Saving article', article);
    
    // Get current saved articles
    const saved = localStorage.getItem('savedArticles');
    const savedIds = saved ? JSON.parse(saved) : [];
    
    // Add the new article ID if not already saved
    if (!savedIds.includes(article.articleId)) {
      savedIds.push(article.articleId);
      localStorage.setItem('savedArticles', JSON.stringify(savedIds));
    }
    
    return { success: true, article };
  },
  
  // Remove a saved article (mock implementation)
  removeSavedArticle: async (articleId: string) => {
    console.log('Mock API: Removing article', articleId);
    
    // Get current saved articles
    const saved = localStorage.getItem('savedArticles');
    const savedIds = saved ? JSON.parse(saved) : [];
    
    // Remove the article ID
    const updatedIds = savedIds.filter((id: string) => id !== articleId);
    localStorage.setItem('savedArticles', JSON.stringify(updatedIds));
    
    return { success: true };
  },
  
  // Fetch news source subscriptions (mock implementation)
  fetchNewsSourceSubscriptions: async () => {
    console.log('Mock API: Fetching subscriptions');
    
    // Get subscriptions from localStorage for now
    const stored = localStorage.getItem('subscribedNewsSources');
    const sources = stored ? JSON.parse(stored) : [];
    
    return { subscriptions: sources };
  },
  
  // Subscribe to a news source (mock implementation)
  subscribeToSource: async (source: { id: string, name: string }) => {
    console.log('Mock API: Subscribing to source', source);
    
    // Get current subscriptions
    const stored = localStorage.getItem('subscribedNewsSources');
    const sources = stored ? JSON.parse(stored) : [];
    
    // Add the new source if not already subscribed
    if (!sources.some((s: any) => s.id === source.id)) {
      sources.push(source);
      localStorage.setItem('subscribedNewsSources', JSON.stringify(sources));
    }
    
    return { success: true, source };
  },
  
  // Unsubscribe from a news source (mock implementation)
  unsubscribeFromSource: async (sourceId: string) => {
    console.log('Mock API: Unsubscribing from source', sourceId);
    
    // Get current subscriptions
    const stored = localStorage.getItem('subscribedNewsSources');
    const sources = stored ? JSON.parse(stored) : [];
    
    // Remove the source
    const updatedSources = sources.filter((s: any) => s.id !== sourceId);
    localStorage.setItem('subscribedNewsSources', JSON.stringify(updatedSources));
    
    return { success: true };
  }
};

/**
 * BACKEND SETUP INSTRUCTIONS
 * 
 * To create a real backend for this application, follow these steps:
 * 
 * 1. Create a Node.js/Express server:
 *    ```
 *    mkdir news-backend
 *    cd news-backend
 *    npm init -y
 *    npm install express mongoose dotenv cors jsonwebtoken bcrypt axios
 *    ```
 * 
 * 2. Project structure:
 *    ```
 *    /news-backend
 *      /config
 *        - db.js (MongoDB connection)
 *      /controllers
 *        - authController.js
 *        - newsController.js
 *        - userController.js
 *      /middleware
 *        - auth.js (JWT authentication)
 *      /models
 *        - User.js
 *        - SavedArticle.js
 *        - SourceSubscription.js
 *      /routes
 *        - auth.js
 *        - news.js
 *        - user.js
 *      - server.js
 *      - .env (environment variables)
 *    ```
 * 
 * 3. Create a real API client that connects to your backend:
 *    ```typescript
 *    const API_BASE_URL = 'http://localhost:5000/api';
 *    
 *    const realApiClient: ApiClient = {
 *      fetchNews: async (query = '', sourceId = null) => {
 *        const params = new URLSearchParams();
 *        if (query) params.append('q', query);
 *        if (sourceId) params.append('sources', sourceId);
 *        
 *        const response = await fetch(`${API_BASE_URL}/news?${params.toString()}`, {
 *          headers: {
 *            'Authorization': `Bearer ${localStorage.getItem('token')}`
 *          }
 *        });
 *        
 *        return response.json();
 *      },
 *      
 *      // Implement other methods similarly
 *    };
 *    ```
 * 
 * 4. Switch from mock to real:
 *    ```typescript
 *    // Export the real client when connected to backend
 *    export const apiClient: ApiClient = mockApiClient;
 *    
 *    // When backend is ready, change to:
 *    // export const apiClient: ApiClient = realApiClient;
 *    ```
 */

// Export the mock client for now
export const apiClient: ApiClient = mockApiClient;
