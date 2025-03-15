
import React from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Settings, Bell, MapPin, Bookmark, User, ThumbsUp } from 'lucide-react';
import ForumThread from '@/components/ForumThread';
import EventCard from '@/components/EventCard';
import { Badge } from '@/components/ui/badge';

// Mock user data
const userData = {
  id: '1',
  name: 'Sarah Johnson',
  username: '@sarahj',
  bio: 'Community organizer and local business supporter. Passionate about improving our neighborhood and connecting with neighbors.',
  avatar: 'https://i.pravatar.cc/150?img=1',
  location: 'West District',
  memberSince: 'May 2023',
  badges: ['Top Contributor', 'Event Organizer', 'Verified Resident'],
  stats: {
    threads: 24,
    comments: 187,
    likes: 392,
    events: 8,
  },
};

// Mock user's threads
const userThreads = [
  {
    id: '1',
    title: 'Ideas for Improving the West Side Park',
    preview: 'I've noticed the west side park has been getting a bit run down. Does anyone have ideas for community-led improvements?',
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
    title: 'Monthly Neighborhood Clean-up Initiative',
    preview: 'I\'d like to organize a monthly clean-up day for our neighborhood. Looking for volunteers and suggestions on how to get started.',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    category: 'Volunteer',
    lastActivity: '2 days ago',
    viewsCount: 94,
    repliesCount: 27,
  },
];

// Mock user's events
const userEvents = [
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

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl overflow-hidden mb-8">
          <div className="pt-12 pb-8 px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white shadow-md">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-2xl">
                  {userData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold">{userData.name}</h1>
                  <span className="text-muted-foreground">{userData.username}</span>
                </div>
                <p className="text-muted-foreground max-w-lg mb-4">{userData.bio}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {userData.memberSince}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {userData.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 md:self-start">
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Follow
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="flex items-center justify-center mb-2 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl font-bold">{userData.stats.threads}</div>
            <div className="text-sm text-muted-foreground">Threads</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="flex items-center justify-center mb-2 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl font-bold">{userData.stats.comments}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="flex items-center justify-center mb-2 text-primary">
              <ThumbsUp className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl font-bold">{userData.stats.likes}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="flex items-center justify-center mb-2 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl font-bold">{userData.stats.events}</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </div>
        </div>
        
        {/* Activity Tabs */}
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="threads" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <MessageSquare className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">Threads</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Calendar className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Bookmark className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Settings className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="threads" className="mt-0">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold mb-4">Discussion Threads</h2>
              {userThreads.map((thread) => (
                <ForumThread key={thread.id} {...thread} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold mb-4">Organized Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            <div className="text-center py-12">
              <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No saved items yet</h3>
              <p className="text-muted-foreground">
                Items you save will appear here for easy access.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-xl font-semibold mb-6">Profile Settings</h2>
              <p className="text-muted-foreground mb-4">
                Settings will be implemented in a future update.
              </p>
              <Button disabled>Update Profile</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
