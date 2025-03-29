
import React from 'react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NewsArticle } from '@/services/newsService';
import { mockPublishers } from '@/services/mongoDbNewsService';
import { Book, ExternalLink, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface PublisherSidebarProps {
  onSelectPublisher: (publisherId: string | null) => void;
  activePublisherId: string | null;
}

const PublisherSidebar: React.FC<PublisherSidebarProps> = ({ 
  onSelectPublisher,
  activePublisherId
}) => {
  const navigate = useNavigate();

  return (
    <Sidebar side="right" variant="floating" collapsible="none" className="fixed right-0 top-[73px] h-[calc(100vh-73px)]">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-base font-semibold">Publishers</h3>
          <Badge variant="outline">{mockPublishers.length}</Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>News Sources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activePublisherId === null}
                  onClick={() => onSelectPublisher(null)}
                >
                  <Newspaper className="h-4 w-4" />
                  <span>All Sources</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {mockPublishers.map((publisher) => (
                <SidebarMenuItem key={publisher.id}>
                  <SidebarMenuButton 
                    isActive={activePublisherId === publisher.id}
                    onClick={() => onSelectPublisher(publisher.id)}
                  >
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={publisher.logo} alt={publisher.name} />
                      <AvatarFallback>{publisher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{publisher.name}</span>
                    <Badge className="ml-auto" variant="outline">
                      {publisher.articles.length}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Latest Articles</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            {activePublisherId 
              ? mockPublishers
                  .find(pub => pub.id === activePublisherId)
                  ?.articles.slice(0, 3)
                  .map((article, idx) => (
                    <div key={idx} className="p-2 rounded-md hover:bg-muted text-sm">
                      <h4 className="font-medium line-clamp-2 mb-1">{article.title}</h4>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span>Read</span>
                        </a>
                      </div>
                    </div>
                  ))
              : mockPublishers
                  .flatMap(pub => pub.articles)
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                  .slice(0, 5)
                  .map((article, idx) => (
                    <div key={idx} className="p-2 rounded-md hover:bg-muted text-sm">
                      <h4 className="font-medium line-clamp-2 mb-1">{article.title}</h4>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{article.source.name}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
            }
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PublisherSidebar;
