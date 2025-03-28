
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useNews } from '@/services/newsService';
import { extractLocationsFromNews, Location } from '@/utils/locationUtils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const { data, isLoading, isError, error } = useNews(searchQuery);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  // Use useEffect to handle errors
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error loading map data",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }, [isError, error, toast]);

  // Extract locations from news data
  useEffect(() => {
    if (data?.articles) {
      const extractedLocations = extractLocationsFromNews(data.articles);
      setLocations(extractedLocations);
    }
  }, [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchText);
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            News Map
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore news stories from across India on the map
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for location-based news..."
              className="pl-10 pr-4 py-3 rounded-l-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="submit" className="rounded-r-full">
              Search
            </Button>
          </div>
        </form>
        
        {/* Map and Info Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-[500px] bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Map 
                locations={locations} 
                height="500px" 
                onMarkerClick={handleMarkerClick}
              />
            )}
          </div>
          
          {/* Info Panel */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {selectedLocation ? (
                  <div>
                    <h2 className="font-display text-xl font-bold mb-2">
                      {selectedLocation.name}
                    </h2>
                    <h3 className="font-medium text-lg mb-2">{selectedLocation.title}</h3>
                    <p className="text-muted-foreground mb-4">{selectedLocation.description}</p>
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = `/news/${selectedLocation.articleIndex}`}
                    >
                      Read Full Article
                    </Button>
                  </div>
                ) : locations.length > 0 ? (
                  <div>
                    <h2 className="font-display text-xl font-bold mb-4">News Locations</h2>
                    <p className="text-muted-foreground mb-4">
                      Found {locations.length} news stories with location information.
                    </p>
                    <p className="text-sm">Click on a marker to view details about the news story from that location.</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-display text-xl font-bold mb-4">No Locations Found</h2>
                    <p className="text-muted-foreground">
                      No news stories with location information were found. Try a different search term.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
