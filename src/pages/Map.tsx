
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MapComponent from '@/components/Map';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNews } from '@/services/newsService';
import { extractLocationsFromNews, Location } from '@/utils/locationUtils';
import { useToast } from '@/hooks/use-toast';

const MapPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError, error } = useNews(searchQuery);
  const { toast } = useToast();
  
  const locations: Location[] = data?.articles ? extractLocationsFromNews(data.articles) : [];
  
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
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">India News Map</h1>
          <p className="text-muted-foreground">
            Explore news articles across India visually on the map.
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search news locations..." 
              className="pl-9 w-full" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Search</span>
          </Button>
        </form>
        
        {/* Map Component */}
        <MapComponent locations={locations} isLoading={isLoading} />
        
        {/* Map Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">About This Map</h3>
            <p className="text-sm text-muted-foreground">
              This map displays news articles from across India. Each pin represents a news
              story related to that location. Click on a pin to read more about the story.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">How to Use</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Use the search bar to find news about specific topics in India</li>
              <li>Click on any pin to view news details</li>
              <li>Zoom in/out to explore different regions</li>
              <li>Click "View Details" to read the full article</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">Data Source</h3>
            <p className="text-sm text-muted-foreground">
              News data is provided by News API, filtered for India-related content.
              Locations are extracted from article content using natural language processing.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
