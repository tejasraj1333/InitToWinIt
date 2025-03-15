
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ForumThreadProps {
  id: string;
  title: string;
  preview: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  pinned?: boolean;
  category: string;
  lastActivity: string;
  viewsCount: number;
  repliesCount: number;
}

const ForumThread: React.FC<ForumThreadProps> = ({
  id,
  title,
  preview,
  author,
  pinned = false,
  category,
  lastActivity,
  viewsCount,
  repliesCount,
}) => {
  return (
    <div className="rounded-xl border border-border hover:border-primary/20 bg-card shadow-sm hover:shadow transition-all duration-300">
      <Link to={`/forums/${id}`} className="block p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {pinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
              <span className="px-2 py-1 bg-secondary text-xs font-medium rounded-full">
                {category}
              </span>
            </div>
            
            <h3 className={cn(
              "font-display font-semibold text-lg tracking-tight mb-1 line-clamp-1",
              pinned && "text-primary"
            )}>
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {preview}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>By {author.name}</span>
              
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{lastActivity}</span>
              </div>
              
              <div className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>{viewsCount}</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span>{repliesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ForumThread;
