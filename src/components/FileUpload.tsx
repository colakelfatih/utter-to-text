import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onClearFile }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm'],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (selectedFile) {
    return (
      <Card className="p-6 border-2 border-dashed border-accent bg-gradient-to-br from-accent/5 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
              <FileAudio className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFile}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300
        border-2 border-dashed rounded-xl p-8 text-center
        ${isDragActive 
          ? 'border-primary bg-gradient-primary/10 shadow-glow' 
          : 'border-border bg-gradient-bg hover:border-primary/50 hover:bg-gradient-primary/5'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="relative z-10 space-y-4">
        <div className={`
          w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300
          ${isDragActive 
            ? 'bg-gradient-primary shadow-glow animate-pulse-glow' 
            : 'bg-gradient-to-br from-muted to-secondary'
          }
        `}>
          <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragActive ? 'Dosyayı buraya bırakın' : 'Ses dosyası yükleyin'}
          </p>
          <p className="text-sm text-muted-foreground">
            MP3, WAV, M4A formatları desteklenir (Maks. 100MB)
          </p>
        </div>
        
        <Button variant="outline" className="mt-4">
          Dosya Seç
        </Button>
      </div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-accent rounded-full animate-pulse delay-150" />
        <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
}