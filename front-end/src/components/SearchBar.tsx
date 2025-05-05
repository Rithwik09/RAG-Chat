
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, performSearch, files } = useSearch();
  const [localQuery, setLocalQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    performSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={`Search across ${files.length} file${files.length !== 1 ? 's' : ''}...`}
            className="pl-10 py-6"
          />
        </div>
        <Button type="submit" disabled={!localQuery.trim()} className="px-4 py-6 opacity-100">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
