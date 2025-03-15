
import React from 'react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import { MapPin, Navigation, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Community Map</h1>
          <p className="text-muted-foreground">
            Explore your neighborhood's news, events, and community discussions visually.
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search locations..." 
              className="pl-9 w-full" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span>Near Me</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        {/* Map Component */}
        <Map />
        
        {/* Legend and Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">Map Legend</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]" />
                <span>News and Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span>Community Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                <span>Discussion Topics</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">How to Use</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Click on any pin to view details</li>
              <li>Use filters to focus on specific types</li>
              <li>Search for locations or addresses</li>
              <li>Click "Near Me" to find closest activities</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold">Report an Issue</h3>
            <p className="text-sm text-muted-foreground">
              Spotted something that needs attention in your community? 
              Report it directly on the map for others to see.
            </p>
            <Button size="sm" variant="outline">
              Report Community Issue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
