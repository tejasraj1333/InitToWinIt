
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/utils/locationUtils';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create custom marker icon
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
    className: `marker-icon-${color}`,
  });
};

interface MapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  showPopupOnHover?: boolean;
  height?: string;
  onMarkerClick?: (location: Location) => void;
}

// Component to update map view when props change
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

const MapComponent: React.FC<MapProps> = ({
  locations = [],
  center = defaultCenter,
  zoom = 5,
  showPopupOnHover = false,
  height = '500px',
  onMarkerClick
}) => {
  const navigate = useNavigate();
  const mapCenter = center || defaultCenter;

  // Set up map container style
  const mapContainerStyle = {
    height: height,
    width: '100%',
  };

  // Define different marker colors based on location type or other criteria
  const getMarkerIcon = (location: Location) => {
    // Here you can customize icon based on location attributes
    return createCustomIcon('blue');
  };

  return (
    <MapContainer
      style={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      
      {locations.map((location, index) => (
        <Marker 
          key={`${location.name}-${index}`}
          position={[location.lat, location.lng]}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) {
                onMarkerClick(location);
              } else if (location.articleIndex !== undefined) {
                navigate(`/news/${location.articleIndex}`);
              }
            },
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-medium text-base mb-1">{location.name}</h3>
              {location.description && (
                <p className="text-sm mb-2">{location.description}</p>
              )}
              {location.articleIndex !== undefined && (
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => navigate(`/news/${location.articleIndex}`)}
                >
                  Read Related News
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
