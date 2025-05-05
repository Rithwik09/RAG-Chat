
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSearch } from '@/contexts/SearchContext';
import { processFile, formatFileSize, getFileIcon } from '@/utils/fileUtils';
import { useToast } from "@/hooks/use-toast";

const FileUploader: React.FC = () => {
  const { files, addFile, removeFile } = useSearch();
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validTypes = [
      'text/plain',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  
    for (const file of acceptedFiles) {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} has an unsupported format. Please upload PDF, image, or text files.`,
          variant: "destructive"
        });
        continue;
      }
  
      const tempId = `temp-${Date.now()}-${file.name}`;
      setProcessing(prev => ({ ...prev, [tempId]: true }));
      setProgress(prev => ({ ...prev, [tempId]: 0 }));
  
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const currentProgress = prev[tempId] || 0;
          if (currentProgress >= 90) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [tempId]: currentProgress + 10 };
        });
      }, 300);
  
      try {
        // Upload to backend
        const formData = new FormData();
        formData.append("title", file.name);
        formData.append("file", file);
  
        const response = await fetch("http://127.0.0.1:8000/documents", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
  
        const result = await response.json();
  
        // Complete the progress
        clearInterval(interval);
        setProgress(prev => ({ ...prev, [tempId]: 100 }));
  
        setTimeout(() => {
          setProcessing(prev => {
            const newProcessing = { ...prev };
            delete newProcessing[tempId];
            return newProcessing;
          });
  
          addFile({
            id: tempId,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            content: result, // optional: depends on backend response
          });
  
          toast({
            title: "File uploaded successfully",
            description: `${file.name} has been uploaded and processed.`,
            variant: "default"
          });
        }, 500);
  
      } catch (error) {
        clearInterval(interval);
        setProcessing(prev => {
          const newProcessing = { ...prev };
          delete newProcessing[tempId];
          return newProcessing;
        });
  
        toast({
          title: "Error uploading file",
          description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }
  }, [addFile, toast]);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-brand-500 bg-brand-50' 
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-brand-600" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & drop files here, or click to select files</p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF, images (JPG, PNG, GIF), and text documents
            </p>
          </div>
          <Button variant="outline" className="mt-2">
            Select Files
          </Button>
        </div>
      </div>

      {/* Processing Files */}
      {Object.keys(processing).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Processing Files</h3>
          <div className="space-y-3">
            {Object.keys(processing).map(id => (
              <div key={id} className="flex items-center bg-gray-50 p-3 rounded-md">
                <Loader2 className="h-5 w-5 text-brand-500 animate-spin mr-3" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{id.split('-').slice(2).join('-')}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full"
                      style={{ width: `${progress[id]}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Files */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Processed Files ({files.length})</h3>
          </div>
          <div className="space-y-3">
            {files.map(file => {
              const FileIcon = (() => {
                const iconName = getFileIcon(file.type);
                if (iconName === 'file-text') return FileText;
                if (iconName === 'image') return FileText;
                return FileText;
              })();

              return (
                <Card key={file.id} className="p-3 flex items-center">
                  <div className="w-10 h-10 bg-brand-50 rounded-md flex items-center justify-center mr-3">
                    <FileIcon className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)} · {file.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                      toast({
                        title: "File removed",
                        description: `${file.name} has been removed.`,
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
