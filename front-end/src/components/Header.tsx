
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-brand-600">Chat Assistant</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Button
            variant={isHome ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <Upload size={16} />
              <span>Upload</span>
            </Link>
          </Button>
          
          <Button
            variant={!isHome ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link to="/search" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Chat</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
