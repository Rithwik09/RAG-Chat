
import React from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';
import { useSearch } from '@/contexts/SearchContext';
import EmptyState from '@/components/EmptyState';

const Index = () => {
  const { files } = useSearch();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
            <p className="text-gray-600 mt-2">
              Upload your files to extract text and make them searchable
            </p>
          </div>

          {files.length === 0 && <EmptyState type="upload" />}
          
          <FileUploader />
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          File Find Finesse &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
