
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { Loader2, X } from 'lucide-react';
import { useNews } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import PublisherSidebar from '@/components/PublisherSidebar';
import { mockPublishers } from '@/services/mongoDbNewsService';
import { Badge } from '@/components/ui/badge';

interface NewsSource {
  id: string;
  name: string;
}

const News = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [subscribedSources, setSubscribedSources] = useState<NewsSource[]>([]);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data, isLoading, isError, error } = useNews(searchQuery, activeSource);
  const { toast } = useToast();
  
  const [storedSources, setStoredSources] = useLocalStorage<NewsSource[]>('subscribedNewsSources', []);
  
  // Initialize subscribed sources from the mock publishers
  useEffect(() => {
    if (mockPublishers && mockPublishers.length > 0) {
      const initialSources = mockPublishers.map(pub => ({
        id: pub.id,
        name: pub.name
      }));
      setSubscribedSources(initialSources);
      setStoredSources(initialSources);
    } else if (storedSources && storedSources.length > 0) {
      setSubscribedSources(storedSources);
    }
  }, []);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error loading news",
        description: error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
      });
    }
  }, [isError, error, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Get articles from the selected publisher or all
  const getArticles = () => {
    if (activeSource && !isLoading) {
      const publisher = mockPublishers.find(pub => pub.id === activeSource);
      return publisher ? publisher.articles : [];
    }
    
    if (data?.articles && data.articles.length > 0) {
      return data.articles;
    }
    
    // Fallback to all mock articles from all publishers
    return mockPublishers.flatMap(pub => pub.articles);
  };

  const articles = getArticles();
  const categories = [
    "General", "Business", "Technology", "Entertainment", "Sports", "Science", "Health"
  ];

  return (
    <SidebarProvider>
      <PublisherSidebar
        onSelectPublisher={setActiveSource}
        activePublisherId={activeSource}
      />
      <SidebarInset>
        <Layout onSearch={handleSearch}>
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                India News
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Stay informed with the latest news and updates from India
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">News Sources</h2>
              </div>
              
              <div className="flex overflow-x-auto pb-2 space-x-2">
                <Button 
                  variant={activeSource === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSource(null)}
                >
                  All Sources
                </Button>
                
                {subscribedSources.map(source => (
                  <Button
                    key={source.id}
                    variant={activeSource === source.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSource(source.id)}
                  >
                    {source.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex overflow-x-auto pb-2 space-x-2">
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <NewsCard 
                    key={`${article.title}-${index}`}
                    id={`${index}`}
                    title={article.title}
                    summary={article.description || "No description available"}
                    category={article.source.name || "News"}
                    image={article.urlToImage || undefined}
                    source={article.source.name || "Unknown Source"}
                    publishedAt={new Date(article.publishedAt).toLocaleDateString()}
                    commentsCount={0}
                    likesCount={0}
                    url={article.url}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No news articles found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </Layout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default News;
