
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

export const fetchNews = async (query: string = ''): Promise<NewsResponse> => {
  const searchQuery = query ? query : 'India';
  const response = await fetch(
    `${NEWS_API_URL}?q=${encodeURIComponent(searchQuery + ' India')}&apiKey=${NEWS_API_KEY}&pageSize=20`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  return response.json();
};

// Custom hook for fetching news
export const useNews = (query: string = '') => {
  return useQuery({
    queryKey: ['news', query],
    queryFn: () => fetchNews(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
