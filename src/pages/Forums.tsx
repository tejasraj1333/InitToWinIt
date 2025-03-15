
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ForumThread from '@/components/ForumThread';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Mock forum threads data
const forumThreads = [
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
  {
    id: '3',
    title: 'Monthly Neighborhood Clean-up Initiative',
    preview: "I'd like to organize a monthly clean-up day for our neighborhood. Looking for volunteers and suggestions on how to get started.",
    author: {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    pinned: true,
    category: 'Volunteer',
    lastActivity: '2 days ago',
    viewsCount: 94,
    repliesCount: 27,
  },
  {
    id: '4',
    title: 'New Thai Restaurant Opening - First Impressions?',
    preview: 'Has anyone tried the new Thai place on Oak Street? Curious about the food and service before I check it out.',
    author: {
      id: '4',
      name: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    category: 'Food & Dining',
    lastActivity: '3 days ago',
    viewsCount: 213,
    repliesCount: 34,
  },
  {
    id: '5',
    title: 'School District Budget Meeting Summary',
    preview: "I attended the school board meeting last night. Here's a summary of the proposed budget changes and key decisions.",
    author: {
      id: '5',
      name: 'David Park',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    category: 'Education',
    lastActivity: '3 days ago',
    viewsCount: 122,
    repliesCount: 15,
  },
  {
    id: '6',
    title: 'Lost Cat - Orange Tabby in Maple Heights Area',
    preview: "Our cat Rusty went missing yesterday around Maple Heights. He's an orange tabby with a white collar. Please contact me if you see him!",
    author: {
      id: '6',
      name: 'Lisa Thompson',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    category: 'Lost & Found',
    lastActivity: '4 days ago',
    viewsCount: 187,
    repliesCount: 23,
  },
  {
    id: '7',
    title: 'Power Outage in Downtown Area?',
    preview: 'Is anyone else experiencing a power outage downtown? Any information on when it might be restored?',
    author: {
      id: '7',
      name: 'Robert Garcia',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    category: 'Local Issues',
    lastActivity: '5 days ago',
    viewsCount: 311,
    repliesCount: 47,
  },
  {
    id: '8',
    title: 'Farmers Market Vendor Applications Now Open',
    preview: "The summer farmers market is accepting vendor applications. I've included details on how to apply and deadlines in this post.",
    author: {
      id: '8',
      name: 'Nicole Lewis',
      avatar: 'https://i.pravatar.cc/150?img=13',
    },
    category: 'Business',
    lastActivity: '6 days ago',
    viewsCount: 89,
    repliesCount: 12,
  },
];

const categories = [
  'All Categories',
  'Community',
  'Services',
  'Volunteer',
  'Food & Dining',
  'Education',
  'Lost & Found',
  'Local Issues',
  'Business',
];

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Most Replies', value: 'replies' },
];

const Forums = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('recent');
  
  const filteredThreads = forumThreads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          thread.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Categories' || thread.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort the filtered threads
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    // Always show pinned threads first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort by the selected criteria
    switch (sortBy) {
      case 'popular':
        return b.viewsCount - a.viewsCount;
      case 'replies':
        return b.repliesCount - a.repliesCount;
      case 'recent':
      default:
        // This is a simplistic approach since we don't have actual dates
        // In a real app, we'd compare actual date objects
        return a.lastActivity < b.lastActivity ? 1 : -1;
    }
  });

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Community Forums
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join conversations with your neighbors and discuss local topics
          </p>
        </div>
        
        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search discussions..."
              className="pl-10 pr-4 py-3 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Thread
            </Button>
          </div>
        </div>
        
        {/* Categories Tabs */}
        <Tabs defaultValue="All Categories" className="w-full mb-8">
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
              {sortedThreads.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {sortedThreads.map((thread) => (
                    <ForumThread key={thread.id} {...thread} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No discussions found matching your criteria.
                  </p>
                  <Button className="mt-4">
                    Start a new thread
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

export default Forums;
