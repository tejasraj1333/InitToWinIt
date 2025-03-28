
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fix the missing leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define the location type
export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  name?: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

interface MapProps {
  locations: MapLocation[];
  height?: string;
  width?: string;
  onMarkerClick?: (location: MapLocation) => void;
}

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // Center of India

const Map: React.FC<MapProps> = ({
  locations = [],
  height = '500px',
  width = '100%',
  onMarkerClick
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Center map on locations if available
  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations]);

  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  const handleOpenArticle = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <MapContainer
          style={{ height, width }}
          center={DEFAULT_CENTER}
          zoom={5}
          zoomControl={true}
          scrollWheelZoom={true}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <div className="max-w-[250px]">
                  {location.imageUrl && (
                    <img 
                      src={location.imageUrl} 
                      alt={location.title} 
                      className="w-full h-32 object-cover mb-2 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  )}
                  <h3 className="font-semibold text-base mb-1">{location.title}</h3>
                  <p className="text-xs mb-2 line-clamp-3">{location.description}</p>
                  {location.url && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs" 
                      onClick={() => handleOpenArticle(location.url)}
                    >
                      Read Article
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default Map;
