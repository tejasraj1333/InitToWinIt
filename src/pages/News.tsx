
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useNews } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const { data, isLoading, isError, error } = useNews(searchQuery);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchText);
  };

  // Use useEffect to show error toast only when error state changes
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error loading news",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }, [isError, error, toast]);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            India News
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with the latest news and updates from India
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search news articles..."
              className="pl-10 pr-4 py-3 rounded-l-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="submit" className="rounded-r-full">
              Search
            </Button>
          </div>
        </form>
        
        {/* News Grid */}
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
