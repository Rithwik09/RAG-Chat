
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FileContent {
  id: string;
  name: string;
  type: string;
  content: string;
  size: number;
  lastModified: number;
}

interface SearchContextType {
  files: FileContent[];
  addFile: (file: FileContent) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{
    fileId: string;
    fileName: string;
    fileType: string;
    snippet: string;
    matchIndex: number;
  }>;
  performSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileContent[]>(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    fileId: string;
    fileName: string;
    fileType: string;
    snippet: string;
    matchIndex: number;
  }>>([]);

  const addFile = (file: FileContent) => {
    setFiles(prevFiles => {
      // Check if file with same ID already exists
      const fileExists = prevFiles.some(f => f.id === file.id);
      if (fileExists) {
        return prevFiles.map(f => f.id === file.id ? file : f);
      }
      const newFiles = [...prevFiles, file];
      localStorage.setItem('uploadedFiles', JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.id !== id);
      localStorage.setItem('uploadedFiles', JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const clearFiles = () => {
    setFiles([]);
    localStorage.removeItem('uploadedFiles');
  };

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: Array<{
      fileId: string;
      fileName: string;
      fileType: string;
      snippet: string;
      matchIndex: number;
    }> = [];

    files.forEach(file => {
      const content = file.content.toLowerCase();
      const query = searchQuery.toLowerCase();
      let lastIndex = 0;
      
      while (true) {
        const matchIndex = content.indexOf(query, lastIndex);
        if (matchIndex === -1) break;
        
        // Create a snippet around the matched text
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(content.length, matchIndex + query.length + 50);
        let snippet = content.substring(start, end);
        
        // Add ellipsis if the snippet doesn't start at the beginning or end at the end
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        results.push({
          fileId: file.id,
          fileName: file.name,
          fileType: file.type,
          snippet,
          matchIndex: matchIndex
        });
        
        lastIndex = matchIndex + query.length;
      }
    });

    setSearchResults(results);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        files, 
        addFile, 
        removeFile, 
        clearFiles, 
        searchQuery, 
        setSearchQuery, 
        searchResults, 
        performSearch 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
