
import React from 'react';
import { MessageSquare, ThumbsUp, Share2, Clock, ExternalLink, BookmarkPlus, Bookmark, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  image?: string;
  source: string;
  publishedAt: string;
  commentsCount: number;
  likesCount: number;
  variant?: 'default' | 'featured';
  url: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  summary,
  category,
  image,
  source,
  publishedAt,
  commentsCount,
  likesCount,
  variant = 'default',
  url
}) => {
  const isFeatured = variant === 'featured';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedArticles, setSavedArticles] = useLocalStorage<string[]>('savedArticles', []);
  const isSaved = savedArticles.includes(id);
  
  const handleOpenArticle = () => {
    window.open(url, '_blank');
  };

  const handleViewDetails = () => {
    navigate(`/news/${id}`);
  };

  const toggleSaveArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSaved) {
      // Remove the article from saved articles
      const updatedSavedArticles = savedArticles.filter(articleId => articleId !== id);
      setSavedArticles(updatedSavedArticles);
      toast({
        title: "Article removed",
        description: "The article has been removed from your saved list.",
      });
    } else {
      // Add the article to saved articles
      const updatedSavedArticles = [...savedArticles, id];
      setSavedArticles(updatedSavedArticles);
      toast({
        title: "Article saved",
        description: "The article has been added to your saved list.",
      });
    }
  };

  return (
    <div 
      className={cn(
        "overflow-hidden rounded-2xl card-hover glass-card cursor-pointer",
        isFeatured ? "col-span-full md:col-span-2 md:row-span-2" : ""
      )}
      onClick={handleViewDetails}
    >
      <div className="block h-full">
        <div className="flex flex-col h-full">
          {image && (
            <div className={cn("relative", isFeatured ? "h-64" : "h-48")}>
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614028674426-a2db91152aa8?q=80&w=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
                  {category}
                </span>
              </div>
            </div>
          )}
          <div className="flex-1 p-5">
            <h3 className={cn(
              "font-display font-semibold tracking-tight hover:text-primary transition-colors",
              isFeatured ? "text-2xl mb-3" : "text-lg mb-2"
            )}>
              {title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {summary}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{commentsCount}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{likesCount}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{publishedAt}</span>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 bg-muted/50 border-t border-border flex justify-between items-center">
            <span className="text-sm font-medium">{source}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-1" onClick={(e) => {
                e.stopPropagation();
                handleOpenArticle();
              }}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open Article</span>
              </Button>
              <Button variant="ghost" size="sm" className="p-1" onClick={toggleSaveArticle}>
                {isSaved ? (
                  <Bookmark className="h-4 w-4 text-primary" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )}
                <span className="sr-only">{isSaved ? 'Unsave' : 'Save'}</span>
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
