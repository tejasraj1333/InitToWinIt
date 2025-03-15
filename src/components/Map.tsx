
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Types for our map points
interface MapPoint {
  id: string;
  type: 'news' | 'event' | 'discussion';
  title: string;
  description: string;
  lat: number;
  lng: number;
  color?: string;
}

// Demo data
const demoPoints: MapPoint[] = [
  {
    id: '1',
    type: 'news',
    title: 'New Community Center',
    description: 'Grand opening this weekend with activities for all ages.',
    lat: 37.7749,
    lng: -122.4194,
    color: '#F97316' // Orange for news
  },
  {
    id: '2',
    type: 'event',
    title: 'Farmers Market',
    description: 'Local produce and handcrafted goods every Saturday.',
    lat: 37.7848,
    lng: -122.4294,
    color: '#8B5CF6' // Purple for events
  },
  {
    id: '3',
    type: 'discussion',
    title: 'Park Improvements',
    description: 'Community discussion about West Side Park renovations.',
    lat: 37.7648,
    lng: -122.4144,
    color: '#0EA5E9' // Blue for discussions
  }
];

interface MapProps {
  mapboxToken?: string;
}

const Map: React.FC<MapProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(mapboxToken || '');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(!mapboxToken);
  
  // Setup map when component mounts or token changes
  useEffect(() => {
    if (!token || !mapContainer.current || map.current) return;
    
    // Initialize map
    mapboxgl.accessToken = token;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.4194, 37.7749], // San Francisco coordinates for demo
      zoom: 12,
      pitch: 45,
    });
    
    map.current = newMap;
    
    // Add navigation controls
    newMap.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Add atmosphere and fog effects
    newMap.on('style.load', () => {
      // Add map points once style is loaded
      demoPoints.forEach((point) => {
        // Create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.backgroundColor = point.color || '#8B5CF6';
        
        // Add the appropriate icon based on type
        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${point.type === 'news' ? 
            '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>' : 
            point.type === 'event' ? 
            '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>' : 
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
          }
        </svg>`;
        el.appendChild(icon);
        
        // Add click event
        el.addEventListener('click', () => {
          setSelectedPoint(point);
        });
        
        // Add to map
        new mapboxgl.Marker(el)
          .setLngLat([point.lng, point.lat])
          .addTo(newMap);
      });
    });
    
    return () => {
      newMap.remove();
      map.current = null;
    };
  }, [token, mapboxToken]);
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTokenModalOpen(false);
  };
  
  if (isTokenModalOpen) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 max-w-md mx-auto mt-12">
        <h3 className="text-lg font-semibold mb-4">Mapbox Token Required</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To view the map, please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
        </p>
        <form onSubmit={handleTokenSubmit}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox public token"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          />
          <Button type="submit" disabled={!token.trim()}>
            Submit
          </Button>
        </form>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-[calc(100vh-16rem)] min-h-[400px] rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Filters */}
      <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1 bg-background text-foreground">
            <div className="w-3 h-3 rounded-full bg-[#F97316]" />
            News
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1 bg-background text-foreground">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            Events
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1 bg-background text-foreground">
            <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
            Discussions
          </Button>
        </div>
      </div>
      
      {/* Selected Point Info */}
      {selectedPoint && (
        <Card className="absolute bottom-4 left-4 z-10 w-64 p-4 shadow-lg animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedPoint.color }} />
              <span className="text-xs font-medium uppercase">{selectedPoint.type}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setSelectedPoint(null)}
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
          <h4 className="font-medium">{selectedPoint.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{selectedPoint.description}</p>
          <Button variant="link" size="sm" className="mt-2 h-auto p-0 ml-auto block">
            View Details
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Map;
