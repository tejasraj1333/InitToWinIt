import React from 'react';
import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import ForumThread from '@/components/ForumThread';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Mock data for the home page
const featuredNews = {
  id: '1',
  title: 'New Community Center Opening This Weekend',
  summary: 'The long-awaited North District Community Center will finally open its doors this Saturday with a day-long celebration featuring local musicians, food trucks, and activities for all ages.',
  category: 'Local News',
  image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  source: 'Citywide Chronicle',
  publishedAt: '2 hours ago',
  commentsCount: 24,
  likesCount: 87,
  url: 'https://example.com/news/community-center',
};

const recentNews = [
  {
    id: '2',
    title: 'Farmers Market Expanding Hours Starting Next Month',
    summary: 'The downtown farmers market will be open on Wednesday evenings in addition to its regular weekend schedule.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'Local Times',
    publishedAt: '4 hours ago',
    commentsCount: 12,
    likesCount: 45,
    url: 'https://example.com/news/farmers-market',
  },
  {
    id: '3',
    title: 'School Board Approves Budget for Playground Renovations',
    summary: 'Elementary schools across the district will receive funding for updated playground equipment.',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'Education Daily',
    publishedAt: '7 hours ago',
    commentsCount: 8,
    likesCount: 32,
    url: 'https://example.com/news/school-board',
  },
  {
    id: '4',
    title: 'Traffic Advisory: Main Street Construction Begins Monday',
    summary: "Drivers should expect delays and consider alternate routes as repaving work begins on the city's main thoroughfare.",
    category: 'Transportation',
    image: 'https://images.unsplash.com/photo-1566995541428-70832a1c07cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'City Updates',
    publishedAt: '9 hours ago',
    commentsCount: 32,
    likesCount: 12,
    url: 'https://example.com/news/traffic-advisory',
  },
];

const trendingThreads = [
  {
    id: '1',
    title: 'Ideas for Improving the West Side Park',
    preview: "I've noticed the west side park has been getting a bit run down. Does anyone have ideas for community-led improvements?",
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    pinned: true,
    category: 'Community',
    lastActivity: 'Today at 10:34 AM',
    viewsCount: 278,
    repliesCount: 42,
  },
  {
    id: '2',
    title: 'Recommendations for Local Plumbers?',
    preview: 'I need a good plumber for a bathroom renovation. Anyone had good experiences with local services?',
    author: {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    category: 'Services',
    lastActivity: 'Yesterday',
    viewsCount: 143,
    repliesCount: 18,
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Summer Festival in the Park',
    description: 'Annual celebration with live music, food vendors, and activities for the whole family.',
    image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 15',
    time: '12:00 PM - 8:00 PM',
    location: 'Central Park',
    attendees: 245,
    category: 'Festival',
  },
  {
    id: '2',
    title: 'Local Business Networking Breakfast',
    description: 'Connect with other small business owners and entrepreneurs in our community.',
    image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 17',
    time: '7:30 AM - 9:00 AM',
    location: 'Downtown Cafe',
    attendees: 53,
    category: 'Business',
  },
  {
    id: '3',
    title: 'Neighborhood Cleanup Day',
    description: 'Join your neighbors to help clean up our streets and parks. Equipment provided.',
    image: 'https://images.unsplash.com/photo-1594283994791-87b9f8acb600?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 22',
    time: '9:00 AM - 12:00 PM',
    location: 'Various Locations',
    attendees: 78,
    category: 'Volunteer',
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-12 animate-slide-down">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Your Local Community
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            Stay connected with your <span className="text-primary">neighborhood</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Discover hyperlocal news, connect with neighbors in community forums, and find exciting local events happening around you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="rounded-full">
              Explore News
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Join Forums
            </Button>
          </div>
        </section>
        
        {/* Featured News */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-semibold">Latest News</h2>
            <Link to="/news" className="text-primary flex items-center hover:underline">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewsCard {...featuredNews} variant="featured" />
            {recentNews.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
        </section>
        
        {/* Trending Discussions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-semibold">Trending Discussions</h2>
            <Link to="/forums" className="text-primary flex items-center hover:underline">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trendingThreads.map((thread) => (
              <ForumThread key={thread.id} {...thread} />
            ))}
          </div>
        </section>
        
        {/* Upcoming Events */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-semibold">Upcoming Events</h2>
            <Link to="/events" className="text-primary flex items-center hover:underline">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="rounded-3xl bg-primary/5 border border-primary/10 p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">Join Your Community Today</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Create an account to participate in discussions, receive personalized news updates, and connect with your neighbors.
          </p>
          <Button size="lg" className="rounded-full">
            Sign Up Now
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
