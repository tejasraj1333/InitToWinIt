import { useQuery } from '@tanstack/react-query';

// Define interface for news article
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Define interface for news response
interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// NewsAPI key
const API_KEY = '7f380ba838a34cbb93f4f080babb5e8f';
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Fetch news from NewsAPI
 * 
 * Note: Direct browser requests to NewsAPI are not allowed in production
 * due to CORS restrictions. In production, you should use a proxy server.
 */
const fetchNews = async (query: string = '', source: string | null = null): Promise<NewsResponse> => {
  try {
    // Build the URL based on parameters
    let url;
    let params = new URLSearchParams();
    
    // Always add API key
    params.append('apiKey', API_KEY);
    params.append('pageSize', '20');
    
    if (source) {
      // If we have a specific source, use the everything endpoint with source filter
      url = `${BASE_URL}/everything`;
      params.append('sources', source);
      
      // Add India as default query if no query provided for context
      params.append('q', query || 'India');
    } else {
      // Otherwise, use the everything endpoint with India context
      url = `${BASE_URL}/everything`;
      params.append('q', query ? `${query} India` : 'India India');
    }
    
    // Check if we're in production (not localhost)
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
      // In production, we need to use a proxy server
      throw new Error("NewsAPI requires a backend proxy for production use due to CORS restrictions");
    }
    
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();
    
    // Handle API errors
    if (data.status === 'error') {
      throw new Error(data.message || 'Error fetching news');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

/**
 * Hook to fetch news with React Query
 */
export const useNews = (query: string = '', source: string | null = null) => {
  return useQuery({
    queryKey: ['news', query, source],
    queryFn: () => fetchNews(query, source),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Mock data to use when API fails or for development
export const getMockNewsData = (): NewsResponse => {
  return {
    status: "ok",
    totalResults: 5,
    articles: [
      {
        source: { id: "the-times-of-india", name: "The Times of India" },
        author: "Times News Network",
        title: "India's Economic Growth Surpasses Expectations in Q2",
        description: "India's GDP grew by 7.8% in the second quarter, beating analyst expectations of 7.2%, thanks to strong performance in manufacturing and services sectors.",
        url: "https://example.com/india-economy-growth",
        urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&fit=crop",
        publishedAt: "2023-07-15T09:45:00Z",
        content: "NEW DELHI: India's economy grew by 7.8% in the April-June quarter, exceeding analyst expectations...",
      },
      {
        source: { id: "the-hindu", name: "The Hindu" },
        author: "Staff Reporter",
        title: "New Delhi Announces Major Infrastructure Project",
        description: "The government has approved a $5 billion infrastructure project to improve transportation in the national capital region, expected to create over 50,000 jobs.",
        url: "https://example.com/delhi-infrastructure-project",
        urlToImage: "https://images.unsplash.com/photo-1598805657603-2071336a3c6a?q=80&w=1470&fit=crop",
        publishedAt: "2023-07-13T14:30:00Z",
        content: "The Union Cabinet has approved a major infrastructure project worth ₹42,000 crore to improve transportation in the Delhi-NCR region...",
      },
      {
        source: { id: "hindustan-times", name: "Hindustan Times" },
        title: "Indian Scientists Develop New Vaccine Technology",
        author: "Science Desk",
        description: "A team of scientists from the Indian Institute of Science has developed a new platform for faster vaccine development that could revolutionize responses to future pandemics.",
        url: "https://example.com/india-vaccine-technology",
        urlToImage: "https://images.unsplash.com/photo-1584118624012-df056829fbd0?q=80&w=1470&fit=crop",
        publishedAt: "2023-07-10T11:15:00Z",
        content: "BENGALURU: Scientists at the Indian Institute of Science (IISc) have developed a novel platform technology that could reduce vaccine development time...",
      },
      {
        source: { id: "ndtv", name: "NDTV" },
        author: "Sports Desk",
        title: "Indian Cricket Team Announces Squad for Upcoming Series",
        description: "The BCCI has announced a 15-member squad for the upcoming cricket series against Australia, with several surprise inclusions and exclusions.",
        url: "https://example.com/india-cricket-squad",
        urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&fit=crop",
        publishedAt: "2023-07-08T16:45:00Z",
        content: "The Board of Control for Cricket in India (BCCI) on Thursday announced the 15-member squad for the upcoming series against Australia...",
      },
      {
        source: { id: "india-today", name: "India Today" },
        author: "Environment Reporter",
        title: "Kerala Implements Ambitious Reforestation Plan",
        description: "Kerala state government has launched a comprehensive plan to increase forest cover by 15% over the next decade, focusing on native species and community involvement.",
        url: "https://example.com/kerala-reforestation",
        urlToImage: "https://images.unsplash.com/photo-1596392301391-8dac0bfb8dcc?q=80&w=1470&fit=crop",
        publishedAt: "2023-07-05T08:30:00Z",
        content: "THIRUVANANTHAPURAM: The Kerala government has unveiled an ambitious reforestation plan aimed at increasing the state's forest cover...",
      }
    ]
  };
};

// Export the fetchNews function and mock data for direct use
export { fetchNews, getMockNewsData as mockNewsData };
