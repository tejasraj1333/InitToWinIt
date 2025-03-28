
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, X, Newspaper } from 'lucide-react';
import L from 'leaflet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LocationPoint } from '@/utils/locationUtils';

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

// Component to recenter map when locations change
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 5);
  return null;
};

interface MapProps {
  locations: LocationPoint[];
  isLoading?: boolean;
}

const Map: React.FC<MapProps> = ({ locations, isLoading = false }) => {
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India

  // Custom marker component
  const createCustomIcon = () => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #F97316; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const handlePointClick = (point: LocationPoint) => {
    setSelectedPoint(point);
    if (window.innerWidth < 768) { // For mobile devices, open modal
      setIsModalOpen(true);
    }
  };

  const handleViewDetails = () => {
    if (selectedPoint) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-[calc(100vh-16rem)] min-h-[400px] rounded-lg overflow-hidden border border-border">
      {/* Map Container */}
      <MapContainer 
        style={{ height: '100%', width: '100%' }}
        center={mapCenter}
        zoom={5}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController center={mapCenter} />
        
        {!isLoading && locations.map((point) => (
          <Marker 
            key={point.id}
            position={[point.lat, point.lng] as [number, number]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => handlePointClick(point)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{point.title}</h3>
                <p className="text-sm line-clamp-2">{point.description}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 mt-1"
                  onClick={() => handlePointClick(point)}
                >
                  Read more
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-[400] bg-background/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm">
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-center h-8 w-8 p-0"
            onClick={() => {
              const map = document.querySelector('.leaflet-container')?._leaflet_map;
              if (map) map.zoomIn();
            }}
          >+</Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-center h-8 w-8 p-0"
            onClick={() => {
              const map = document.querySelector('.leaflet-container')?._leaflet_map;
              if (map) map.zoomOut();
            }}
          >-</Button>
        </div>
      </div>
      
      {/* Selected Point Info */}
      {selectedPoint && !isModalOpen && (
        <Card className="absolute bottom-4 left-4 z-[400] w-64 p-4 shadow-lg animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F97316]" />
              <span className="text-xs font-medium uppercase">News</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setSelectedPoint(null)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <h4 className="font-medium line-clamp-2">{selectedPoint.title}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{selectedPoint.description}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{new Date(selectedPoint.publishedAt).toLocaleDateString()}</span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </Card>
      )}
      
      {/* News Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedPoint?.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedPoint?.source} • {selectedPoint ? new Date(selectedPoint.publishedAt).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoint?.imageUrl && (
            <div className="h-48 w-full rounded-md overflow-hidden">
              <img 
                src={selectedPoint.imageUrl} 
                alt={selectedPoint.title}
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614028674426-a2db91152aa8?q=80&w=600';
                }}
              />
            </div>
          )}
          
          <div className="space-y-4">
            <p>{selectedPoint?.description}</p>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => selectedPoint?.url && window.open(selectedPoint.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Read Full Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
