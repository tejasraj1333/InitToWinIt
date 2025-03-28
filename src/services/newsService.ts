import { useQuery } from '@tanstack/react-query';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const NEWS_API_KEY = '7f380ba838a34cbb93f4f080babb5e8f';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Fetches news from the News API
 * 
 * NOTE FOR PRODUCTION:
 * Due to CORS restrictions in NewsAPI's developer plan, this should be 
 * called from a backend service in production environments.
 * 
 * To implement with MongoDB:
 * 1. Create a backend API route (Node.js/Express)
 * 2. Call NewsAPI from the backend
 * 3. Store results in MongoDB
 * 4. Return results to frontend
 * 
 * @param query Search query, defaults to India news
 * @returns Promise with news response
 */
export const fetchNews = async (query: string = ''): Promise<NewsResponse> => {
  const searchQuery = query ? query : 'India';
  
  try {
    // IMPORTANT: In production, move this API call to your backend
    // This direct fetch will only work on localhost due to CORS restrictions
    const response = await fetch(
      `${NEWS_API_URL}?q=${encodeURIComponent(searchQuery + ' India')}&apiKey=${NEWS_API_KEY}&pageSize=20`
    );
    
    if (!response.ok) {
      // For NewsAPI CORS issues in development
      if (response.status === 426) {
        throw new Error('NewsAPI requires a backend proxy for production use due to CORS restrictions');
      }
      
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return mock data in development or throw in production
    if (process.env.NODE_ENV === 'development') {
      return {
        status: 'ok',
        totalResults: 5,
        articles: getMockIndiaNews(searchQuery)
      };
    }
    throw error;
  }
};

// Mock data function for development purposes
function getMockIndiaNews(query: string = ''): NewsArticle[] {
  const baseNews = [
    {
      source: { id: 'india-times', name: 'India Times' },
      author: 'Rahul Sharma',
      title: 'India announces new education policy for 2023',
      description: 'The Indian government has announced a comprehensive new education policy aimed at transforming the education system.',
      url: 'https://example.com/india-education-policy',
      urlToImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
      publishedAt: new Date().toISOString(),
      content: 'The Indian government has announced a comprehensive new education policy aimed at transforming the education system with focus on technology and skill development.'
    },
    {
      source: { id: 'delhi-news', name: 'Delhi News' },
      author: 'Priya Patel',
      title: 'Delhi pollution levels reach alarming heights',
      description: 'Air quality in Delhi has deteriorated to hazardous levels as winter approaches.',
      url: 'https://example.com/delhi-pollution',
      urlToImage: 'https://images.unsplash.com/photo-1506893337-4ac7c0b6a48c',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      content: 'Air quality in Delhi has deteriorated to hazardous levels as winter approaches, forcing schools to close and outdoor activities to be restricted.'
    },
    {
      source: { id: 'mumbai-herald', name: 'Mumbai Herald' },
      author: 'Amit Singh',
      title: 'Mumbai launches new coastal road project',
      description: 'The Mumbai coastal road project aims to ease traffic congestion along the western coastline.',
      url: 'https://example.com/mumbai-coastal-road',
      urlToImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      content: 'The Mumbai coastal road project aims to ease traffic congestion along the western coastline, connecting Marine Drive to the southern end of the Bandra-Worli Sea Link.'
    },
    {
      source: { id: 'tech-india', name: 'Tech India' },
      author: 'Vikram Mehta',
      title: 'Indian tech startups attract record funding',
      description: 'Indian technology startups have raised over $10 billion in funding this year.',
      url: 'https://example.com/india-tech-funding',
      urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      content: 'Indian technology startups have raised over $10 billion in funding this year, with fintech and e-commerce sectors leading the way.'
    },
    {
      source: { id: 'sports-chronicle', name: 'Sports Chronicle' },
      author: 'Ravi Kumar',
      title: 'Indian cricket team prepares for upcoming world cup',
      description: 'The Indian cricket team has begun intensive training for the upcoming world cup tournament.',
      url: 'https://example.com/india-cricket-worldcup',
      urlToImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      content: 'The Indian cricket team has begun intensive training for the upcoming world cup tournament, with new strategies being developed by the coaching staff.'
    }
  ];
  
  // If there's a search query, filter the mock data
  if (query && query !== 'India') {
    const lowerQuery = query.toLowerCase();
    return baseNews.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.description.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
    );
  }
  
  return baseNews;
}

/**
 * HOW TO INTEGRATE WITH MONGODB:
 * 
 * 1. BACKEND SETUP (Node.js/Express/MongoDB):
 * 
 * a) Create a backend API with the following routes:
 *    - GET /api/news - Fetch news from MongoDB or NewsAPI
 *    - POST /api/news/save - Save article to user's collection
 *    - GET /api/news/saved - Get user's saved articles
 *    - DELETE /api/news/saved/:id - Remove article from saved
 * 
 * b) MongoDB Schema Example:
 *    ```
 *    // User Schema
 *    const UserSchema = new mongoose.Schema({
 *      email: { type: String, required: true, unique: true },
 *      name: { type: String, required: true },
 *      // other user fields
 *    });
 * 
 *    // Saved Article Schema
 *    const SavedArticleSchema = new mongoose.Schema({
 *      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 *      articleData: {
 *        title: { type: String, required: true },
 *        description: { type: String },
 *        url: { type: String, required: true },
 *        urlToImage: { type: String },
 *        publishedAt: { type: Date },
 *        source: {
 *          id: { type: String },
 *          name: { type: String }
 *        },
 *        // other article fields
 *      },
 *      savedAt: { type: Date, default: Date.now }
 *    });
 *    ```
 * 
 * c) Example backend route to save an article:
 *    ```
 *    app.post('/api/news/save', authMiddleware, async (req, res) => {
 *      try {
 *        const { articleData } = req.body;
 *        const userId = req.user.id;
 *        
 *        const savedArticle = new SavedArticleModel({
 *          userId,
 *          articleData
 *        });
 *        
 *        await savedArticle.save();
 *        res.status(200).json({ success: true, savedArticle });
 *      } catch (error) {
 *        res.status(500).json({ success: false, error: error.message });
 *      }
 *    });
 *    ```
 */

/**
 * Custom hook for fetching news
 * 
 * In a production app with MongoDB:
 * - Replace the direct NewsAPI call with your backend API
 * - Add authentication for user-specific saved articles
 */
export const useNews = (query: string = '') => {
  return useQuery({
    queryKey: ['news', query],
    queryFn: () => fetchNews(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * TO IMPLEMENT MONGODB INTEGRATION:
 * 
 * 1. Create these additional hooks for saved articles:
 * 
 * // Hook to save an article
 * export const useSaveArticle = () => {
 *   const queryClient = useQueryClient();
 *   
 *   return useMutation({
 *     mutationFn: (article: NewsArticle) => {
 *       // In production, call your backend API
 *       return fetch('/api/news/save', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ articleData: article }),
 *         credentials: 'include'
 *       }).then(res => res.json());
 *     },
 *     onSuccess: () => {
 *       // Invalidate saved articles query to refetch
 *       queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
 *     }
 *   });
 * };
 * 
 * // Hook to get user's saved articles
 * export const useSavedArticles = () => {
 *   return useQuery({
 *     queryKey: ['savedArticles'],
 *     queryFn: () => {
 *       // In production, call your backend API
 *       return fetch('/api/news/saved', {
 *         credentials: 'include'
 *       }).then(res => res.json());
 *     }
 *   });
 * };
 * 
 * // Hook to remove a saved article
 * export const useRemoveSavedArticle = () => {
 *   const queryClient = useQueryClient();
 *   
 *   return useMutation({
 *     mutationFn: (articleId: string) => {
 *       // In production, call your backend API
 *       return fetch(`/api/news/saved/${articleId}`, {
 *         method: 'DELETE',
 *         credentials: 'include'
 *       }).then(res => res.json());
 *     },
 *     onSuccess: () => {
 *       // Invalidate saved articles query to refetch
 *       queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
 *     }
 *   });
 * };
 */
