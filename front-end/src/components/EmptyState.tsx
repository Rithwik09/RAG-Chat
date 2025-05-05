
import React from 'react';
import { FileSearch, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';

interface EmptyStateProps {
  type: 'upload' | 'search';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const { files } = useSearch();
  
  if (type === 'upload') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
          <Upload className="h-8 w-8 text-brand-600" />
        </div>
        <h3 className="text-xl font-medium">Upload your first file</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Upload PDFs, images, and text documents to extract and search through their contents
        </p>
      </div>
    );
  }

  if (type === 'search' && files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
          <FileSearch className="h-8 w-8 text-brand-600" />
        </div>
        <h3 className="text-xl font-medium">No files to search</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          You need to upload files before you can search through them
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Upload Files</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
        <FileSearch className="h-8 w-8 text-brand-600" />
      </div>
      <h3 className="text-xl font-medium">Search your files</h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        Enter a search term to find matches in your {files.length} uploaded file{files.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default EmptyState;
