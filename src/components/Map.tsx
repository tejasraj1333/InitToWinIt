
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

// Component to set the map center/view
const SetViewOnLoad = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const Map: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    news: true,
    event: true,
    discussion: true
  });

  const toggleFilter = (type: 'news' | 'event' | 'discussion') => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const filteredPoints = demoPoints.filter(point => 
    activeFilters[point.type]
  );

  // Custom marker component
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${
                  color === '#F97316' ? '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>' : 
                  color === '#8B5CF6' ? '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>' : 
                  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
                }
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-16rem)] min-h-[400px] rounded-lg overflow-hidden border border-border">
      {/* Map Container */}
      <MapContainer 
        center={[37.7749, -122.4194]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnLoad center={[37.7749, -122.4194]} zoom={13} />
        
        {filteredPoints.map((point) => (
          <Marker 
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.color || '#8B5CF6')}
            eventHandlers={{
              click: () => {
                setSelectedPoint(point);
              }
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{point.title}</h3>
                <p className="text-sm">{point.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Filters */}
      <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={activeFilters.news ? "default" : "outline"} 
            className="flex items-center gap-1" 
            onClick={() => toggleFilter('news')}
          >
            <div className="w-3 h-3 rounded-full bg-[#F97316]" />
            News
          </Button>
          <Button 
            size="sm" 
            variant={activeFilters.event ? "default" : "outline"} 
            className="flex items-center gap-1" 
            onClick={() => toggleFilter('event')}
          >
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            Events
          </Button>
          <Button 
            size="sm" 
            variant={activeFilters.discussion ? "default" : "outline"} 
            className="flex items-center gap-1" 
            onClick={() => toggleFilter('discussion')}
          >
            <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
            Discussions
          </Button>
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="flex items-center justify-center h-8 w-8 p-0">+</Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center h-8 w-8 p-0">-</Button>
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
