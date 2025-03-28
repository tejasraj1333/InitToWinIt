
import { NewsArticle } from '@/services/newsService';

// Common Indian cities to look for in news articles
const INDIAN_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723 }
];

// States of India to look for in news articles
const INDIAN_STATES = [
  { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  { name: 'Telangana', lat: 18.1124, lng: 79.0193 },
  { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
  { name: 'West Bengal', lat: 22.9868, lng: 87.8550 },
  { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
  { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 },
  { name: 'Bihar', lat: 25.0961, lng: 85.3131 },
  { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { name: 'Jammu and Kashmir', lat: 33.7782, lng: 76.5762 },
  { name: 'Assam', lat: 26.2006, lng: 92.9376 }
];

export interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
}

// This interface matches what our Map component expects
export interface Location {
  id: string;
  lat: number;
  lng: number;
  name: string;
  articleIndex: number;
  title: string;
  description: string;
}

export const extractLocationsFromNews = (articles: NewsArticle[]): Location[] => {
  const locations: Location[] = [];
  
  articles.forEach((article, index) => {
    // Concatenate title and description to search for locations
    const content = `${article.title} ${article.description}`.toLowerCase();
    
    // First check for cities
    for (const city of INDIAN_CITIES) {
      if (content.includes(city.name.toLowerCase())) {
        locations.push({
          id: `news-${index}-${city.name}`,
          lat: city.lat,
          lng: city.lng,
          name: city.name,
          articleIndex: index,
          title: article.title,
          description: article.description || 'No description available'
        });
        break; // Only add one location per article
      }
    }
    
    // If no city was found, check for states
    if (!locations.some(loc => loc.id.includes(`news-${index}`))) {
      for (const state of INDIAN_STATES) {
        if (content.includes(state.name.toLowerCase())) {
          locations.push({
            id: `news-${index}-${state.name}`,
            lat: state.lat,
            lng: state.lng,
            name: state.name,
            articleIndex: index,
            title: article.title,
            description: article.description || 'No description available'
          });
          break; // Only add one location per article
        }
      }
    }
  });
  
  return locations;
};
