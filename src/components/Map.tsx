
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for the default icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Types
interface Location {
  lat: number;
  lng: number;
  name: string;
  articleIndex: number;
  title: string;
  description: string;
}

interface MapProps {
  locations: Location[];
  isLoading: boolean;
}

const Map: React.FC<MapProps> = ({ locations, isLoading }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  
  // Center map on India
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  // When a location is selected, center the map on it
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.setView(
        [selectedLocation.lat, selectedLocation.lng],
        10,
        { animate: true }
      );
    }
  }, [selectedLocation]);

  const handleViewArticle = (articleIndex: number) => {
    navigate(`/news/${articleIndex}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {isLoading ? (
        <Skeleton className="w-full h-[60vh]" />
      ) : (
        <div className="grid md:grid-cols-3 h-[60vh]">
          <div className="md:col-span-2 h-full">
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              center={defaultCenter}
              zoom={defaultZoom}
              zoomControl={true}
              scrollWheelZoom={false}
              whenCreated={(map) => {
                mapRef.current = map;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {locations.map((location, idx) => (
                <Marker
                  key={`${location.name}-${idx}`}
                  position={[location.lat, location.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedLocation(location),
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-medium text-sm">{location.name}</h3>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="p-4 overflow-y-auto">
            {selectedLocation ? (
              <div className="space-y-4">
                <div>
                  <Badge className="mb-2">{selectedLocation.name}</Badge>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {selectedLocation.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {selectedLocation.description}
                  </p>
                  <Button 
                    onClick={() => handleViewArticle(selectedLocation.articleIndex)}
                    className="w-full justify-between"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Other Locations</h4>
                  <div className="space-y-2">
                    {locations.slice(0, 5).filter(loc => 
                      loc.lat !== selectedLocation.lat || loc.lng !== selectedLocation.lng
                    ).map((loc, idx) => (
                      <div 
                        key={idx}
                        className="p-2 hover:bg-muted rounded-md cursor-pointer flex items-center gap-2"
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">{loc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-4">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Select a location</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any pin on the map to view news from that location.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
