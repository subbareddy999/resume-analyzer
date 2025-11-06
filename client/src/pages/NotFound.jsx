import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl md:text-3xl font-light text-foreground mt-4">
          Oops! Page not found
        </p>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
