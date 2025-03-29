
import mongoose from 'mongoose';

// MongoDB Connection String
export const MONGODB_URI = `mongodb+srv://sneha251104:sSZy8pc1AOgxllhD@ac-iafgpi8-shard-00-00.xbmn3ku.mongodb.net:27017,ac-iafgpi8-shard-00-01.xbmn3ku.mongodb.net:27017,ac-iafgpi8-shard-00-02.xbmn3ku.mongodb.net:27017/?ssl=true&replicaSet=atlas-2lj571-shard-0&authSource=admin&retryWrites=true&w=majority&appName=news`;

// News Schema
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  }
});

// Initialize the model only if it hasn't been defined already
// This prevents the "Cannot overwrite model once compiled" error
let NewsModel: mongoose.Model<any>;

try {
  NewsModel = mongoose.model('news');
} catch (error) {
  NewsModel = mongoose.model('news', newsSchema);
}

// Mock data for publishers with their news
export const mockPublishers = [
  {
    id: 'the-times-of-india',
    name: 'The Times of India',
    logo: 'https://static.toiimg.com/photo/47529300.cms',
    description: 'India\'s most-read English newspaper',
    articles: [
      {
        title: 'India GDP Growth Surpasses Expectations in Q2',
        description: 'India\'s economy grew at 8.2% in the last quarter, exceeding analyst predictions.',
        author: 'Economic Bureau',
        url: 'https://timesofindia.indiatimes.com/business/india-business/india-gdp-growth-q2',
        publishedAt: '2023-10-15T08:30:00Z',
        source: { id: 'the-times-of-india', name: 'The Times of India' },
        urlToImage: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Cricket World Cup: India Dominates Australia in Opening Match',
        description: 'Indian team started their World Cup campaign with a convincing win against Australia.',
        author: 'Sports Desk',
        url: 'https://timesofindia.indiatimes.com/sports/cricket/world-cup/india-australia',
        publishedAt: '2023-10-14T15:45:00Z',
        source: { id: 'the-times-of-india', name: 'The Times of India' },
        urlToImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1505&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'the-hindu',
    name: 'The Hindu',
    logo: 'https://www.thehindu.com/theme/images/th-online/logo.png',
    description: 'One of India\'s national newspapers',
    articles: [
      {
        title: 'New Environmental Policy Announced by Government',
        description: 'The central government has unveiled a comprehensive environmental policy aimed at reducing carbon emissions.',
        author: 'Environment Correspondent',
        url: 'https://www.thehindu.com/sci-tech/energy-and-environment/new-policy',
        publishedAt: '2023-10-16T09:15:00Z',
        source: { id: 'the-hindu', name: 'The Hindu' },
        urlToImage: 'https://images.unsplash.com/photo-1498496294664-d9372eb521f3?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Literature Festival Returns to Delhi After Pandemic Hiatus',
        description: 'The annual Delhi Literature Festival is set to return this December after a three-year break.',
        author: 'Cultural Affairs',
        url: 'https://www.thehindu.com/entertainment/books/delhi-lit-fest',
        publishedAt: '2023-10-14T11:30:00Z',
        source: { id: 'the-hindu', name: 'The Hindu' },
        urlToImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1470&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'hindustan-times',
    name: 'Hindustan Times',
    logo: 'https://www.hindustantimes.com/res/images/ht-logo.svg',
    description: 'English-language daily newspaper from Delhi',
    articles: [
      {
        title: 'Delhi Air Quality Deteriorates as Winter Approaches',
        description: 'Air quality in the capital region has started to decline as temperatures drop and stubble burning increases.',
        author: 'Environment Desk',
        url: 'https://www.hindustantimes.com/cities/delhi-news/air-quality-worsens',
        publishedAt: '2023-10-17T07:45:00Z',
        source: { id: 'hindustan-times', name: 'Hindustan Times' },
        urlToImage: 'https://images.unsplash.com/photo-1573747806413-2ddd2f5972e7?q=80&w=1035&auto=format&fit=crop'
      },
      {
        title: 'New Metro Line to Connect South Delhi with Airport',
        description: 'The Delhi Metro Rail Corporation has announced plans for a new metro line connecting southern neighborhoods directly to the international airport.',
        author: 'City Desk',
        url: 'https://www.hindustantimes.com/cities/delhi-news/new-metro-line',
        publishedAt: '2023-10-16T16:20:00Z',
        source: { id: 'hindustan-times', name: 'Hindustan Times' },
        urlToImage: 'https://images.unsplash.com/photo-1550231827-bd0e354cc39a?q=80&w=1470&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'ndtv',
    name: 'NDTV',
    logo: 'https://drop.ndtv.com/homepage/ndtv-logo-black.png',
    description: 'Leading Indian television media company',
    articles: [
      {
        title: 'Stock Markets Hit New High on Foreign Investment',
        description: 'Indian stock markets reached record levels today as foreign institutional investors increased their holdings.',
        author: 'Business Team',
        url: 'https://www.ndtv.com/business/markets-new-high',
        publishedAt: '2023-10-18T10:00:00Z',
        source: { id: 'ndtv', name: 'NDTV' },
        urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Monsoon to Withdraw from Northwest India This Week',
        description: 'The India Meteorological Department has predicted that the monsoon will begin its withdrawal from northwestern regions this week.',
        author: 'Weather Desk',
        url: 'https://www.ndtv.com/india-news/monsoon-withdrawal',
        publishedAt: '2023-10-17T13:15:00Z',
        source: { id: 'ndtv', name: 'NDTV' },
        urlToImage: 'https://images.unsplash.com/photo-1514632595-4944383f2737?q=80&w=1470&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'india-today',
    name: 'India Today',
    logo: 'https://akm-img-a-in.tosshub.com/sites/all/themes/itg/logo.png',
    description: 'Leading Indian media house publishing news and current affairs',
    articles: [
      {
        title: 'New Education Policy Implementation to Begin Next Academic Year',
        description: 'The government has announced that the implementation of the new education policy will begin from the next academic session.',
        author: 'Education Reporter',
        url: 'https://www.indiatoday.in/education-today/news/new-policy-implementation',
        publishedAt: '2023-10-19T09:30:00Z',
        source: { id: 'india-today', name: 'India Today' },
        urlToImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop'
      },
      {
        title: 'Indian Space Agency Announces Plans for Venus Mission',
        description: 'ISRO has revealed plans for a new planetary exploration mission to Venus in the next five years.',
        author: 'Science Correspondent',
        url: 'https://www.indiatoday.in/science/space/isro-venus-mission',
        publishedAt: '2023-10-18T14:45:00Z',
        source: { id: 'india-today', name: 'India Today' },
        urlToImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1374&auto=format&fit=crop'
      }
    ]
  }
];

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Return mock data if connection fails
    return mockPublishers;
  }
};

// Function to get news by publisher
export const getNewsByPublisher = async (publisherId: string) => {
  try {
    await connectToMongoDB();
    const news = await NewsModel.find({ publisher: publisherId }).sort({ timestamp: -1 });
    return news;
  } catch (error) {
    console.error('Error fetching news by publisher:', error);
    // Return mock data for the specific publisher if database fetch fails
    const mockData = mockPublishers.find(pub => pub.id === publisherId);
    return mockData ? mockData.articles : [];
  }
};

// Function to get all publishers
export const getAllPublishers = async () => {
  try {
    await connectToMongoDB();
    const publishers = await NewsModel.distinct('publisher');
    
    // Map the publisher IDs to their full details if available
    return publishers.map(publisherId => {
      const mockPublisher = mockPublishers.find(pub => pub.id === publisherId);
      return mockPublisher || { id: publisherId, name: publisherId };
    });
  } catch (error) {
    console.error('Error fetching publishers:', error);
    // Return mock publishers if database fetch fails
    return mockPublishers;
  }
};

export default {
  NewsModel,
  connectToMongoDB,
  getNewsByPublisher,
  getAllPublishers,
  mockPublishers
};
