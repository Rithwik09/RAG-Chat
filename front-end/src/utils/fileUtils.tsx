import React from 'react';
import { FileContent } from '@/contexts/SearchContext';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Extract plain text files
export const extractTextFromTxt = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Function to extract text from PDF (simplified)
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Minimal PDF extraction
    return 'PDF text extraction is currently disabled.';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Function to extract text from image (simplified)
export const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    // Minimal image OCR
    return 'Image text extraction is currently disabled.';
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return `Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Function to extract text from Word document
export const extractTextFromDoc = async (file: File): Promise<string> => {
  try {
    // For .doc and .docx files, we'd normally use a library like mammoth.js
    // For simplicity, let's assume we can't fully extract text from these formats
    return `Text extraction from ${file.type} is not fully supported in the browser. Please upload a PDF or text file for better results.`;
  } catch (error) {
    console.error('Error extracting text from doc/docx:', error);
    return `Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Function to process a file and extract its content
export const processFile = async (file: File): Promise<FileContent> => {
  let content = '';
  
  // Extract content based on file type
  if (file.type === 'text/plain') {
    content = await extractTextFromTxt(file);
  } else if (file.type === 'application/pdf') {
    content = await extractTextFromPDF(file);
  } else if (file.type.startsWith('image/')) {
    content = await extractTextFromImage(file);
  } else if (
    file.type === 'application/msword' || 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    content = await extractTextFromDoc(file);
  } else {
    // For other file types, we'll just include the name as content
    content = `File name: ${file.name}`;
  }
  
  return {
    id: generateId(),
    name: file.name,
    type: file.type,
    content,
    size: file.size,
    lastModified: file.lastModified
  };
};

// Helper to get file icon based on type
export const getFileIcon = (fileType: string): string => {
  if (fileType === 'text/plain') return 'file-text';
  if (fileType === 'application/pdf') return 'file-text';
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.includes('word') || fileType.includes('document')) return 'file';
  return 'file';
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Highlight text in a given string
export const highlightText = (text: string, query: string): JSX.Element => {
  if (!query.trim()) return <>{text}</>;
  
  // Escape special regex characters in the query string to prevent errors
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : 
          <span key={i}>{part}</span>
      )}
    </>
  );
};
