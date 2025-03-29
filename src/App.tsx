
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import News from "./pages/News";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
import NewsDetail from "./pages/NewsDetail";
import { NavigationMenuProvider } from "@radix-ui/react-navigation-menu";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NavigationMenuProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/news" replace />} />
            <Route path="/news" element={<News />} />
            <Route path="/map" element={<Map />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NavigationMenuProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
