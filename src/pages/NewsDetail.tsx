
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkPlus, Clock, Globe, Share2, ThumbsUp, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useNews } from '@/services/newsService';

// Comment type
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// Get stored comments or empty object if none
const getStoredComments = (): Record<string, Comment[]> => {
  try {
    const stored = localStorage.getItem('newsComments');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error parsing stored comments:', error);
    return {};
  }
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError } = useNews('');
  const [article, setArticle] = useState<any>(null);
  const [savedArticles, setSavedArticles] = useLocalStorage<string[]>('savedArticles', []);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showAuthorInput, setShowAuthorInput] = useState(true);
  
  // Check if article is saved
  const isSaved = id ? savedArticles.includes(id) : false;
  
  // Find the article in the data
  useEffect(() => {
    if (data?.articles && id) {
      const index = parseInt(id, 10);
      if (!isNaN(index) && index >= 0 && index < data.articles.length) {
        setArticle(data.articles[index]);
      } else {
        // Article not found, go back to news list
        navigate('/news');
        toast({
          title: "Article not found",
          description: "The article you're looking for doesn't exist.",
          variant: "destructive",
        });
      }
    }
  }, [data, id, navigate, toast]);
  
  // Load comments for this article
  useEffect(() => {
    if (id) {
      const allComments = getStoredComments();
      setComments(allComments[id] || []);
    }
  }, [id]);
  
  // Save comments to localStorage
  const saveComments = (articleId: string, newComments: Comment[]) => {
    try {
      const allComments = getStoredComments();
      allComments[articleId] = newComments;
      localStorage.setItem('newsComments', JSON.stringify(allComments));
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  };
  
  // Toggle save article
  const toggleSaveArticle = () => {
    if (!id) return;
    
    if (isSaved) {
      setSavedArticles(savedArticles.filter(articleId => articleId !== id));
      toast({
        title: "Article removed",
        description: "The article has been removed from your saved list.",
      });
    } else {
      setSavedArticles([...savedArticles, id]);
      toast({
        title: "Article saved",
        description: "The article has been added to your saved list.",
      });
    }
  };
  
  // Add a new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !id) return;
    
    // Use provided name or Anonymous
    const author = commentAuthor.trim() || 'Anonymous';
    
    // If this is first time commenting, remember the name
    if (showAuthorInput && commentAuthor.trim()) {
      setShowAuthorInput(false);
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author,
      content: commentText.trim(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveComments(id, updatedComments);
    setCommentText('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added.",
    });
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (isError || !article) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => navigate('/news')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate('/news')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
        </Button>
        
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              <span>{article.source.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          {/* Article Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" onClick={toggleSaveArticle} className="flex items-center gap-2">
              {isSaved ? (
                <>
                  <Bookmark className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description: "Article link has been copied to clipboard.",
                });
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open(article.url, '_blank')}
            >
              <Globe className="h-4 w-4" />
              Original Source
            </Button>
          </div>
        </div>
        
        {/* Featured Image */}
        {article.urlToImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614028674426-a2db91152aa8?q=80&w=600';
              }}
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl leading-relaxed mb-6">
            {article.description}
          </p>
          <p className="leading-relaxed">
            {article.content || "Full content not available. Please visit the original source for the complete article."}
          </p>
        </div>
        
        {/* Comments Section */}
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="font-display text-2xl font-semibold mb-6">Comments ({comments.length})</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            {showAuthorInput && (
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">Post</Button>
            </div>
          </form>
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {comment.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{comment.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
