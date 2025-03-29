
/**
 * MongoDB Integration Service
 * 
 * This service provides a template for integrating with a MongoDB backend
 * and supports news subscriptions and saved articles.
 * 
 * To use this service:
 * 1. Set up the MongoDB backend as described in mongoDbUtils.ts
 * 2. Update the API_BASE_URL with your backend URL
 * 3. Implement authentication (JWT recommended)
 * 4. Replace the localStorage implementation with these MongoDB services
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsArticle } from './newsService';
import { apiClient } from '@/utils/mongoDbUtils';

// Interface for saved article from MongoDB
export interface SavedArticleDocument {
  _id: string;
  userId: string;
  articleId: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  savedAt: string;
}

// Interface for news source subscription
export interface NewsSourceSubscription {
  _id: string;
  userId: string;
  sourceId: string;
  sourceName: string;
  subscribed: boolean;
  subscribedAt: string;
}

/**
 * Hook to fetch news from your backend API (which proxies to NewsAPI)
 * 
 * This is a direct replacement for the existing useNews hook
 */
export const useMongoNews = (query: string = '', sourceId: string | null = null) => {
  return useQuery({
    queryKey: ['mongoNews', query, sourceId],
    queryFn: () => apiClient.fetchNews(query, sourceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user's saved articles from MongoDB
 */
export const useSavedArticles = () => {
  return useQuery({
    queryKey: ['savedArticles'],
    queryFn: apiClient.fetchSavedArticles,
    // Only fetch if user is authenticated
    enabled: false, // Set to true when authentication is implemented
  });
};

/**
 * Hook to save an article to MongoDB
 */
export const useSaveArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (article: NewsArticle) => {
      // Format the article for saving
      const saveData = {
        articleId: article.url, // Use URL as unique identifier
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source
      };
      
      return apiClient.saveArticle(saveData);
    },
    onSuccess: () => {
      // Invalidate saved articles query to refetch
      queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
    },
  });
};

/**
 * Hook to remove a saved article from MongoDB
 */
export const useRemoveSavedArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (articleId: string) => {
      return apiClient.removeSavedArticle(articleId);
    },
    onSuccess: () => {
      // Invalidate saved articles query to refetch
      queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
    },
  });
};

/**
 * Hook to fetch user's news source subscriptions
 */
export const useNewsSourceSubscriptions = () => {
  return useQuery({
    queryKey: ['newsSourceSubscriptions'],
    queryFn: apiClient.fetchNewsSourceSubscriptions,
    // Only fetch if user is authenticated
    enabled: false, // Set to true when authentication is implemented
  });
};

/**
 * Hook to subscribe to a news source
 */
export const useSubscribeToSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (source: { id: string, name: string }) => {
      return apiClient.subscribeToSource(source);
    },
    onSuccess: () => {
      // Invalidate subscriptions query to refetch
      queryClient.invalidateQueries({ queryKey: ['newsSourceSubscriptions'] });
    },
  });
};

/**
 * Hook to unsubscribe from a news source
 */
export const useUnsubscribeFromSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sourceId: string) => {
      return apiClient.unsubscribeFromSource(sourceId);
    },
    onSuccess: () => {
      // Invalidate subscriptions query to refetch
      queryClient.invalidateQueries({ queryKey: ['newsSourceSubscriptions'] });
    },
  });
};

/**
 * IMPLEMENTATION PLAN:
 * 
 * 1. BACKEND SETUP (3-5 days)
 *    - Set up Node.js/Express server
 *    - Configure MongoDB connection
 *    - Create user authentication system
 *    - Create news API routes
 *    - Create subscription management routes
 *    - Test API endpoints
 * 
 * 2. FRONTEND INTEGRATION (2-3 days)
 *    - Create authentication UI (login/register)
 *    - Update news fetching to use backend API
 *    - Modify saved articles to use MongoDB
 *    - Implement subscription management
 *    - Test integration
 * 
 * 3. DEPLOYMENT (1-2 days)
 *    - Deploy backend to hosting provider (Heroku, Vercel, etc.)
 *    - Configure environment variables
 *    - Update frontend with production API URL
 *    - Deploy frontend
 * 
 * TOTAL ESTIMATED TIME: 6-10 days depending on experience level
 */

/**
 * QUICK IMPLEMENTATION GUIDE:
 * 
 * 1. Create backend project:
 *    ```
 *    mkdir news-backend
 *    cd news-backend
 *    npm init -y
 *    npm install express mongoose dotenv cors jsonwebtoken bcrypt
 *    ```
 * 
 * 2. Set up MongoDB:
 *    - Create account on MongoDB Atlas (or use local MongoDB)
 *    - Create a cluster and database
 *    - Get connection string
 * 
 * 3. Create backend structure:
 *    - Create models for User, SavedArticle, and SourceSubscription
 *    - Create routes for auth, news, saved articles, and subscriptions
 *    - Implement controllers for each route
 *    - Set up middleware for authentication
 * 
 * 4. Backend routes to implement:
 *    - POST /api/auth/register - Register a new user
 *    - POST /api/auth/login - Login user
 *    - GET /api/news - Get news (proxy to NewsAPI)
 *    - GET /api/news/sources - Get available news sources
 *    - GET /api/user/saved - Get user's saved articles
 *    - POST /api/user/saved - Save an article
 *    - DELETE /api/user/saved/:id - Remove a saved article
 *    - GET /api/user/subscriptions - Get user's subscriptions
 *    - POST /api/user/subscriptions - Subscribe to a source
 *    - DELETE /api/user/subscriptions/:id - Unsubscribe from a source
 * 
 * 5. Replace localStorage in the React app with MongoDB service:
 *    - Update NewsCard.tsx to use useSaveArticle() and useRemoveSavedArticle()
 *    - Update News.tsx to use useMongoNews() and useNewsSourceSubscriptions()
 *    - Create a SavedNews.tsx page that uses useSavedArticles()
 *    - Create subscription management in the UI
 * 
 * 6. Add authentication to protect saved articles and subscriptions
 */

/**
 * MONGODB SCHEMAS:
 * 
 * User Schema:
 * ```javascript
 * const userSchema = new mongoose.Schema({
 *   username: { type: String, required: true, unique: true },
 *   email: { type: String, required: true, unique: true },
 *   password: { type: String, required: true },
 *   createdAt: { type: Date, default: Date.now }
 * });
 * ```
 * 
 * SavedArticle Schema:
 * ```javascript
 * const savedArticleSchema = new mongoose.Schema({
 *   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 *   articleId: { type: String, required: true },
 *   title: { type: String, required: true },
 *   description: { type: String },
 *   url: { type: String, required: true },
 *   urlToImage: { type: String },
 *   publishedAt: { type: String, required: true },
 *   source: {
 *     id: { type: String },
 *     name: { type: String }
 *   },
 *   savedAt: { type: Date, default: Date.now }
 * });
 * ```
 * 
 * SourceSubscription Schema:
 * ```javascript
 * const sourceSubscriptionSchema = new mongoose.Schema({
 *   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 *   sourceId: { type: String, required: true },
 *   sourceName: { type: String, required: true },
 *   subscribed: { type: Boolean, default: true },
 *   subscribedAt: { type: Date, default: Date.now }
 * });
 * ```
 */

/**
 * EXAMPLE BACKEND CODE:
 * 
 * Express Server Setup:
 * ```javascript
 * const express = require('express');
 * const mongoose = require('mongoose');
 * const cors = require('cors');
 * const dotenv = require('dotenv');
 * const axios = require('axios');
 * 
 * dotenv.config();
 * const app = express();
 * 
 * // Middleware
 * app.use(cors());
 * app.use(express.json());
 * 
 * // Connect to MongoDB
 * mongoose.connect(process.env.MONGODB_URI)
 *   .then(() => console.log('Connected to MongoDB'))
 *   .catch(err => console.error('MongoDB connection error:', err));
 * 
 * // Routes
 * app.use('/api/auth', require('./routes/auth'));
 * app.use('/api/news', require('./routes/news'));
 * app.use('/api/user', require('./routes/user'));
 * 
 * // Start server
 * const PORT = process.env.PORT || 5000;
 * app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 * ```
 * 
 * News API Proxy Route:
 * ```javascript
 * const express = require('express');
 * const router = express.Router();
 * const axios = require('axios');
 * const auth = require('../middleware/auth');
 * 
 * // GET /api/news
 * router.get('/', auth, async (req, res) => {
 *   try {
 *     const { q, sources } = req.query;
 *     const response = await axios.get('https://newsapi.org/v2/everything', {
 *       params: {
 *         q: q || 'India',
 *         sources: sources || '',
 *         apiKey: process.env.NEWS_API_KEY,
 *         pageSize: 20
 *       }
 *     });
 *     
 *     res.json(response.data);
 *   } catch (error) {
 *     console.error('Error fetching news:', error.response?.data || error.message);
 *     res.status(500).json({ message: 'Error fetching news' });
 *   }
 * });
 * 
 * module.exports = router;
 * ```
 */

