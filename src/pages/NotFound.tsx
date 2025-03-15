
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { FolderX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 animate-fade-in">
        <div className="bg-primary/10 p-6 rounded-full inline-flex mb-6">
          <FolderX className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Button asChild size="lg" className="rounded-full">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
