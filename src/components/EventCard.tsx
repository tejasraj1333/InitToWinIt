
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  variant?: 'default' | 'compact';
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  image,
  date,
  time,
  location,
  attendees,
  category,
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';
  
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/events/${id}`} className="block h-full">
        <div className="flex flex-col h-full">
          {image && !isCompact && (
            <div className="relative h-48">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
                  {category}
                </span>
              </div>
            </div>
          )}
          
          <div className={cn(
            "flex flex-col gap-3 p-5",
            isCompact ? "flex-row items-start" : ""
          )}>
            {isCompact && (
              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg p-3 w-16 h-16">
                <CalendarDays className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{date.split(' ')[0]}</span>
              </div>
            )}
            
            <div className="flex-1">
              {!isCompact && (
                <div className="flex items-center mb-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span className="font-medium">{date}</span>
                </div>
              )}
              
              <h3 className={cn(
                "font-display font-semibold tracking-tight hover:text-primary transition-colors line-clamp-2",
                isCompact ? "text-base" : "text-xl mb-2"
              )}>
                {title}
              </h3>
              
              {!isCompact && (
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {description}
                </p>
              )}
              
              <div className={cn(
                "grid gap-2 text-sm text-muted-foreground",
                isCompact ? "grid-cols-1" : "grid-cols-2"
              )}>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{time}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="truncate">{location}</span>
                </div>
                
                {!isCompact && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary/70" />
                    <span>{attendees} attending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
