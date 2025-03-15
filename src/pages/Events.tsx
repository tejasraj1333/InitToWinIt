
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Calendar, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock events data
const eventsData = [
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
  {
    id: '4',
    title: 'Art Gallery Opening Night',
    description: 'Be among the first to see the new exhibition featuring works from local artists.',
    image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 23',
    time: '6:00 PM - 9:00 PM',
    location: 'Community Art Center',
    attendees: 112,
    category: 'Arts & Culture',
  },
  {
    id: '5',
    title: 'Farmers Market',
    description: 'Weekly market featuring fresh produce, baked goods, and crafts from local vendors.',
    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 25',
    time: '8:00 AM - 1:00 PM',
    location: 'Main Street Plaza',
    attendees: 320,
    category: 'Market',
  },
  {
    id: '6',
    title: 'Tech Workshop: Intro to Coding',
    description: 'Free workshop for beginners interested in learning the basics of computer programming.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 27',
    time: '6:30 PM - 8:30 PM',
    location: 'Public Library',
    attendees: 42,
    category: 'Education',
  },
  {
    id: '7',
    title: 'Community Garden Planting Day',
    description: 'Help plant summer vegetables and flowers in our neighborhood garden.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Jul 29',
    time: '10:00 AM - 2:00 PM',
    location: 'Elm Street Garden',
    attendees: 35,
    category: 'Volunteer',
  },
  {
    id: '8',
    title: 'Local Cinema Night: Classic Films',
    description: 'Outdoor screening of classic films. Bring your own blanket and snacks.',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: 'Aug 1',
    time: '8:30 PM - 11:00 PM',
    location: 'Memorial Park',
    attendees: 186,
    category: 'Entertainment',
  },
];

const categories = [
  'All Events',
  'Festival',
  'Business',
  'Volunteer',
  'Arts & Culture',
  'Market',
  'Education',
  'Entertainment',
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Events' || event.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Local Events
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover upcoming events and activities in your community
          </p>
        </div>
        
        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search events by name, description or location..."
              className="pl-10 pr-4 py-3 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="bg-secondary rounded-full p-1 flex items-center">
              <button 
                className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button 
                className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
        
        {/* Categories Tabs */}
        <Tabs defaultValue="All Events" className="w-full mb-8">
          <TabsList className="flex overflow-x-auto hide-scrollbar p-1 bg-transparent mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {filteredEvents.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} {...event} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} {...event} variant="compact" />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No events found matching your criteria.
                  </p>
                  <Button className="mt-4">
                    Create an event
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Events;
