import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Newspaper, Bookmark, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/services/newsService';
import { Input } from '@/components/ui/input';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedArticles, setSavedArticles] = useLocalStorage<string[]>('savedArticles', []);
  const { data } = useNews('');
  
  const navLinks = [
    { path: '/news', icon: <Newspaper className="h-5 w-5" /> },
    { path: '/map', icon: <LocationOnIcon fontSize="large" /> },  
    { path: '/publisher',icon: <RecordVoiceOverIcon fontSize="large" /> },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleSavedArticlesClick = () => {
    if (savedArticles.length === 0) {
      toast({
        title: "No saved articles",
        description: "You haven't saved any articles yet.",
        duration: 3000,
      });
      return;
    }
    
    if (data?.articles) {
      // Find the first saved article and navigate to it
      const savedArticleIds = savedArticles.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      
      if (savedArticleIds.length > 0) {
        toast({
          title: `${savedArticles.length} articles saved`,
          description: "Showing your saved articles.",
          duration: 3000,
        });
        
        // Navigate to the first saved article
        navigate(`/news/${savedArticleIds[0]}`);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchText);
    } else {
      navigate(`/news?q=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-4 p-2 rounded-full hover:bg-muted transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link to="/" className="flex items-center">
              <img src="/logo3.png" alt="logo" height={60} width={198} />
            </Link>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-auto px-4">
            <div className="relative flex w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search news articles..."
                className="pl-9 pr-4 py-2 w-full"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" size="sm" className="ml-2">
                Search
              </Button>
            </div>
          </form>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "nav-link",
                  location.pathname === link.path && "active"
                )}
              >
                {link.icon}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
              onClick={handleSavedArticlesClick}
            >
              <Bookmark style={{ height: '24px', width: '24px' }} />
              {savedArticles.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {savedArticles.length}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-slide-down">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2 bg-background border-t border-border">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-2">
                <div className="relative flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search news articles..."
                    className="pl-9 pr-4 py-2 w-full"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="ml-2">
                    Search
                  </Button>
                </div>
              </form>
              
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-2 p-3 rounded-md",
                    location.pathname === link.path 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
