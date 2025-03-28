
/**
 * MongoDB Integration Service
 * 
 * This service provides a template for integrating with a MongoDB backend
 * after you set up the backend described in mongoDbUtils.ts
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

/**
 * Hook to fetch news from your backend API (which proxies to NewsAPI)
 * 
 * This is a direct replacement for the existing useNews hook
 */
export const useMongoNews = (query: string = '') => {
  return useQuery({
    queryKey: ['mongoNews', query],
    queryFn: () => apiClient.fetchNews(query),
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
 * IMPLEMENTATION PLAN:
 * 
 * 1. BACKEND SETUP (3-5 days)
 *    - Set up Node.js/Express server
 *    - Configure MongoDB connection
 *    - Create user authentication system
 *    - Create news API routes
 *    - Test API endpoints
 * 
 * 2. FRONTEND INTEGRATION (2-3 days)
 *    - Create authentication UI (login/register)
 *    - Update news fetching to use backend API
 *    - Modify saved articles to use MongoDB
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
 * 3. Create backend structure following the examples in mongoDbUtils.ts
 * 
 * 4. Replace localStorage in the React app with MongoDB service:
 *    - Update NewsCard.tsx to use useSaveArticle() and useRemoveSavedArticle()
 *    - Update pages to use useMongoNews() instead of useNews()
 *    - Create a SavedNews.tsx page that uses useSavedArticles()
 * 
 * 5. Add authentication to protect saved articles
 */
