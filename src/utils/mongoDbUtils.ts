
/**
 * MongoDB Integration Utility
 * 
 * This file provides guidance on how to integrate MongoDB with your React application
 * for storing user-specific saved news articles.
 * 
 * STEP-BY-STEP GUIDE:
 * 
 * 1. BACKEND SETUP (Not implemented in this frontend-only template)
 * 
 *    a) Create a Node.js/Express backend with MongoDB connection:
 *       - Install: express, mongoose, cors, dotenv, jsonwebtoken
 *       - Set up MongoDB connection (Atlas or local)
 *       - Create models for User and SavedArticle
 *       - Implement authentication (JWT or session-based)
 *       - Create RESTful API endpoints for news operations
 * 
 *    b) Recommended folder structure for backend:
 *       /backend
 *       ├── /controllers  - Logic for handling requests
 *       ├── /models       - MongoDB schemas
 *       ├── /routes       - API endpoint definitions
 *       ├── /middleware   - Auth, validation, etc.
 *       ├── /config       - Configuration files
 *       ├── /utils        - Helper functions
 *       └── server.js     - Main application file
 * 
 * 2. MONGODB MODELS EXAMPLE:
 * 
 *    ```javascript
 *    // User Model
 *    const mongoose = require('mongoose');
 *    
 *    const UserSchema = new mongoose.Schema({
 *      email: {
 *        type: String,
 *        required: true,
 *        unique: true,
 *        trim: true,
 *        lowercase: true
 *      },
 *      password: {
 *        type: String,
 *        required: true
 *      },
 *      name: {
 *        type: String,
 *        required: true
 *      },
 *      createdAt: {
 *        type: Date,
 *        default: Date.now
 *      }
 *    });
 *    
 *    module.exports = mongoose.model('User', UserSchema);
 *    ```
 * 
 *    ```javascript
 *    // SavedArticle Model
 *    const mongoose = require('mongoose');
 *    
 *    const SavedArticleSchema = new mongoose.Schema({
 *      userId: {
 *        type: mongoose.Schema.Types.ObjectId,
 *        ref: 'User',
 *        required: true,
 *        index: true
 *      },
 *      articleId: {
 *        type: String,
 *        required: true
 *      },
 *      title: {
 *        type: String,
 *        required: true
 *      },
 *      description: {
 *        type: String
 *      },
 *      url: {
 *        type: String,
 *        required: true
 *      },
 *      urlToImage: {
 *        type: String
 *      },
 *      publishedAt: {
 *        type: Date
 *      },
 *      source: {
 *        id: String,
 *        name: String
 *      },
 *      savedAt: {
 *        type: Date,
 *        default: Date.now
 *      }
 *    });
 *    
 *    // Compound index to ensure a user doesn't save the same article twice
 *    SavedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });
 *    
 *    module.exports = mongoose.model('SavedArticle', SavedArticleSchema);
 *    ```
 * 
 * 3. API ENDPOINTS EXAMPLE:
 * 
 *    ```javascript
 *    // News routes
 *    const express = require('express');
 *    const router = express.Router();
 *    const authMiddleware = require('../middleware/auth');
 *    const NewsController = require('../controllers/news.controller');
 *    
 *    // Get all news (proxy to News API)
 *    router.get('/', NewsController.getNews);
 *    
 *    // Get news by search term (proxy to News API)
 *    router.get('/search', NewsController.searchNews);
 *    
 *    // Protected routes (require authentication)
 *    router.get('/saved', authMiddleware, NewsController.getSavedArticles);
 *    router.post('/save', authMiddleware, NewsController.saveArticle);
 *    router.delete('/saved/:id', authMiddleware, NewsController.removeSavedArticle);
 *    
 *    module.exports = router;
 *    ```
 * 
 * 4. CONTROLLER EXAMPLE FOR NEWS:
 * 
 *    ```javascript
 *    const SavedArticle = require('../models/SavedArticle');
 *    const axios = require('axios');
 *    
 *    // News API configuration
 *    const NEWS_API_KEY = process.env.NEWS_API_KEY;
 *    const NEWS_API_URL = 'https://newsapi.org/v2/everything';
 *    
 *    // Get news (proxy to News API)
 *    exports.getNews = async (req, res) => {
 *      try {
 *        const { q = 'India' } = req.query;
 *        const response = await axios.get(NEWS_API_URL, {
 *          params: {
 *            q,
 *            apiKey: NEWS_API_KEY,
 *            pageSize: 20
 *          }
 *        });
 *        
 *        res.json(response.data);
 *      } catch (error) {
 *        res.status(500).json({ 
 *          message: 'Error fetching news', 
 *          error: error.message 
 *        });
 *      }
 *    };
 *    
 *    // Get saved articles for the current user
 *    exports.getSavedArticles = async (req, res) => {
 *      try {
 *        const userId = req.user.id;
 *        const savedArticles = await SavedArticle.find({ userId }).sort({ savedAt: -1 });
 *        
 *        res.json(savedArticles);
 *      } catch (error) {
 *        res.status(500).json({ 
 *          message: 'Error fetching saved articles', 
 *          error: error.message 
 *        });
 *      }
 *    };
 *    
 *    // Save an article for the current user
 *    exports.saveArticle = async (req, res) => {
 *      try {
 *        const { 
 *          title, description, url, urlToImage, 
 *          publishedAt, source, articleId 
 *        } = req.body;
 *        
 *        const userId = req.user.id;
 *        
 *        // Check if article is already saved
 *        const existingArticle = await SavedArticle.findOne({ 
 *          userId, 
 *          articleId 
 *        });
 *        
 *        if (existingArticle) {
 *          return res.status(400).json({ 
 *            message: 'Article already saved' 
 *          });
 *        }
 *        
 *        // Create new saved article
 *        const savedArticle = new SavedArticle({
 *          userId,
 *          articleId,
 *          title,
 *          description,
 *          url,
 *          urlToImage,
 *          publishedAt: new Date(publishedAt),
 *          source
 *        });
 *        
 *        await savedArticle.save();
 *        
 *        res.status(201).json(savedArticle);
 *      } catch (error) {
 *        res.status(500).json({ 
 *          message: 'Error saving article', 
 *          error: error.message 
 *        });
 *      }
 *    };
 *    
 *    // Remove a saved article
 *    exports.removeSavedArticle = async (req, res) => {
 *      try {
 *        const { id } = req.params;
 *        const userId = req.user.id;
 *        
 *        const result = await SavedArticle.findOneAndDelete({ 
 *          _id: id, 
 *          userId 
 *        });
 *        
 *        if (!result) {
 *          return res.status(404).json({ 
 *            message: 'Saved article not found' 
 *          });
 *        }
 *        
 *        res.json({ message: 'Article removed successfully' });
 *      } catch (error) {
 *        res.status(500).json({ 
 *          message: 'Error removing article', 
 *          error: error.message 
 *        });
 *      }
 *    };
 *    ```
 */

/**
 * FRONTEND INTEGRATION WITH MONGODB BACKEND
 * 
 * Once your backend is set up, you'll need to modify the React frontend to use it.
 * Here's a guide on what changes you'd need to make:
 * 
 * 1. Create an API client for your backend
 * 2. Update the useNews hook to fetch from your backend instead of directly from NewsAPI
 * 3. Update the save article functionality to use your backend
 * 
 * Example implementation flow:
 * 
 * 1. User logs in (authentication)
 * 2. Frontend fetches news from your backend API
 * 3. User saves an article -> Frontend calls your backend API
 * 4. Backend saves the article to MongoDB
 * 5. User views saved articles -> Frontend fetches from your backend API
 */

// API base URL - change this to your backend URL when deployed
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';

// Example API client structure
export const apiClient = {
  // Fetch news from your backend (which proxies to News API)
  fetchNews: async (query: string = '') => {
    const response = await fetch(`${API_BASE_URL}/news?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },
  
  // Fetch user's saved articles
  fetchSavedArticles: async () => {
    const response = await fetch(`${API_BASE_URL}/news/saved`, {
      credentials: 'include' // Send cookies for authentication
    });
    if (!response.ok) throw new Error('Failed to fetch saved articles');
    return response.json();
  },
  
  // Save an article
  saveArticle: async (article: any) => {
    const response = await fetch(`${API_BASE_URL}/news/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(article)
    });
    if (!response.ok) throw new Error('Failed to save article');
    return response.json();
  },
  
  // Remove a saved article
  removeSavedArticle: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/news/saved/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to remove article');
    return response.json();
  }
};

export default apiClient;
