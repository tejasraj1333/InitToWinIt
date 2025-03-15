
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock news data
const newsItems = [
  {
    id: '1',
    title: 'New Community Center Opening This Weekend',
    summary: 'The long-awaited North District Community Center will finally open its doors this Saturday with a day-long celebration featuring local musicians, food trucks, and activities for all ages.',
    category: 'Local News',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    source: 'Citywide Chronicle',
    publishedAt: '2 hours ago',
    commentsCount: 24,
    likesCount: 87,
  },
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
  },
  {
    id: '5',
    title: 'New Art Installation Coming to Riverfront Park',
    summary: "Local artist Maria Chen's sculpture series \"Urban Nature\" will be installed along the river walk next month.",
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'Arts Monthly',
    publishedAt: '10 hours ago',
    commentsCount: 5,
    likesCount: 28,
  },
  {
    id: '6',
    title: 'City Council Votes on New Bike Lane Proposal Tonight',
    summary: 'The hotly debated plan to add protected bike lanes to downtown streets goes to vote this evening.',
    category: 'Politics',
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'City Observer',
    publishedAt: '12 hours ago',
    commentsCount: 67,
    likesCount: 29,
  },
  {
    id: '7',
    title: 'Local Restaurant Wins Regional Culinary Award',
    summary: 'Farm & Table has been recognized for its farm-to-table cuisine and commitment to supporting local producers.',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'Food & Dining',
    publishedAt: '1 day ago',
    commentsCount: 15,
    likesCount: 72,
  },
  {
    id: '8',
    title: 'Library Announces Summer Reading Program for Children',
    summary: 'Registration opens next week for the popular program featuring prizes, events, and reading challenges.',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    source: 'Education Daily',
    publishedAt: '1 day ago',
    commentsCount: 3,
    likesCount: 19,
  },
];

const categories = [
  'All',
  'Local News',
  'Business',
  'Education',
  'Transportation',
  'Arts & Culture',
  'Politics',
  'Food',
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredNews = newsItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Hyperlocal News
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with the latest news and updates from your community
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search news articles..."
              className="pl-10 pr-4 py-3 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Categories Tabs */}
        <Tabs defaultValue="All" className="w-full mb-8">
          <TabsList className="flex flex-wrap justify-center p-1 bg-transparent mb-6">
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
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((item) => (
                    <NewsCard key={item.id} {...item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No news articles found matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default News;
