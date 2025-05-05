
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Image, File, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { highlightText } from '@/utils/fileUtils';

const SearchResults: React.FC = () => {
  const { searchResults, searchQuery } = useSearch();

  const getFileIcon = (fileType: string) => {
    if (fileType === 'text/plain') return <FileText className="h-5 w-5 text-blue-500" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  if (searchResults.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">No results found</h3>
        <p className="text-gray-500 mt-1">Try a different search term or upload more files</p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-medium">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
        </h2>
      </div>
      
      <div className="space-y-4">
        {searchResults.map((result, index) => (
          <Card key={`${result.fileId}-${index}`} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                {getFileIcon(result.fileType)}
              </div>
              
              <div>
                <h3 className="font-medium text-lg">{result.fileName}</h3>
                <p className="text-sm text-gray-500 mb-2">{result.fileType}</p>
                
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                  {highlightText(result.snippet, searchQuery)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
