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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
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
  const [availableSources, setAvailableSources] = useState<NewsSource[]>([
    { id: 'the-times-of-india', name: 'The Times of India' },
    { id: 'the-hindu', name: 'The Hindu' },
    { id: 'india-today', name: 'India Today' },
    { id: 'ndtv', name: 'NDTV' },
    { id: 'hindustan-times', name: 'Hindustan Times' },
    { id: 'bbc-news', name: 'BBC News' },
    { id: 'cnn', name: 'CNN' },
    { id: 'reuters', name: 'Reuters' },
  ]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceId, setNewSourceId] = useState('');
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data, isLoading, isError, error } = useNews(searchQuery, activeSource);
  const { toast } = useToast();
  
  const [storedSources, setStoredSources] = useLocalStorage<NewsSource[]>('subscribedNewsSources', []);
  
  useEffect(() => {
    if (storedSources && storedSources.length > 0) {
      setSubscribedSources(storedSources);
    }
  }, [storedSources]);
  
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

  const handleSubscribe = (source: NewsSource) => {
    const updatedSources = [...subscribedSources, source];
    setSubscribedSources(updatedSources);
    setStoredSources(updatedSources);
    
    toast({
      title: "Subscribed",
      description: `You're now subscribed to ${source.name}`,
      duration: 3000,
    });
  };

  const handleUnsubscribe = (sourceId: string) => {
    const updatedSources = subscribedSources.filter(s => s.id !== sourceId);
    setSubscribedSources(updatedSources);
    setStoredSources(updatedSources);
    
    if (activeSource === sourceId) {
      setActiveSource(null);
    }
    
    toast({
      title: "Unsubscribed",
      description: `You've unsubscribed from ${subscribedSources.find(s => s.id === sourceId)?.name}`,
      duration: 3000,
    });
  };

  const handleAddCustomSource = () => {
    if (!newSourceName.trim() || !newSourceId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both name and ID for the custom source",
        duration: 3000,
      });
      return;
    }
    
    const newSource: NewsSource = {
      id: newSourceId.trim().toLowerCase(),
      name: newSourceName.trim()
    };
    
    setAvailableSources([...availableSources, newSource]);
    
    handleSubscribe(newSource);
    
    setNewSourceName('');
    setNewSourceId('');
  };

  const categories = [
    "General", "Business", "Technology", "Entertainment", "Sports", "Science", "Health"
  ];

  return (
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage Subscriptions</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage News Sources</DialogTitle>
                  <DialogDescription>
                    Subscribe to news sources to see their content in your feed.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Your Subscriptions</h3>
                  {subscribedSources.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {subscribedSources.map(source => (
                        <div key={source.id} className="flex items-center">
                          <Badge variant="outline" className="mr-1">{source.name}</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 rounded-full"
                            onClick={() => handleUnsubscribe(source.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subscriptions yet</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Available Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSources
                      .filter(source => !subscribedSources.some(s => s.id === source.id))
                      .map(source => (
                        <Badge 
                          key={source.id} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSubscribe(source)}
                        >
                          + {source.name}
                        </Badge>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Add Custom Source</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Source Name" 
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                    <Input 
                      placeholder="Source ID" 
                      value={newSourceId}
                      onChange={(e) => setNewSourceId(e.target.value)}
                    />
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleAddCustomSource}>
                    Add Source
                  </Button>
                </div>
                
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button>Close</Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
        ) : data?.articles && data.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.articles.map((article, index) => (
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
  );
};

export default News;
