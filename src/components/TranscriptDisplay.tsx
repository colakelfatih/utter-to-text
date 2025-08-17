import { useState } from 'react';
import { Clock, User, Download, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export interface TranscriptSegment {
  speaker: string;
  start: string;
  end: string;
  text: string;
}

interface TranscriptDisplayProps {
  segments: TranscriptSegment[];
  isLoading?: boolean;
}

export function TranscriptDisplay({ segments, isLoading }: TranscriptDisplayProps) {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'txt'>('txt');
  const { toast } = useToast();

  const handleCopy = () => {
    const text = segments.map(segment => 
      `[${segment.start} - ${segment.end}] ${segment.speaker}: ${segment.text}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: "Transkript panoya kopyalandı",
    });
  };

  const handleDownload = () => {
    let content: string;
    let filename: string;
    
    if (selectedFormat === 'json') {
      content = JSON.stringify({ segments }, null, 2);
      filename = `transcript_${Date.now()}.json`;
    } else {
      content = segments.map(segment => 
        `[${segment.start} - ${segment.end}] ${segment.speaker}: ${segment.text}`
      ).join('\n\n');
      filename = `transcript_${Date.now()}.txt`;
    }
    
    const blob = new Blob([content], { type: selectedFormat === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "İndirildi",
      description: `${filename} başarıyla indirildi`,
    });
  };

  const formatDuration = (start: string, end: string) => {
    // Simple duration calculation for display
    const startSeconds = timeToSeconds(start);
    const endSeconds = timeToSeconds(end);
    const duration = endSeconds - startSeconds;
    return `${duration}s`;
  };

  const timeToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Transkripsiyon işleniyor...</span>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted/60 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (segments.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Henüz transkript yok
        </h3>
        <p className="text-sm text-muted-foreground">
          Ses dosyası yükleyip transkripsiyon başlatın
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Transkript</h2>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {segments.length} segment
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1 bg-muted/30">
            <Button
              size="sm"
              variant={selectedFormat === 'txt' ? 'default' : 'ghost'}
              onClick={() => setSelectedFormat('txt')}
              className="text-xs h-7"
            >
              TXT
            </Button>
            <Button
              size="sm"
              variant={selectedFormat === 'json' ? 'default' : 'ghost'}
              onClick={() => setSelectedFormat('json')}
              className="text-xs h-7"
            >
              JSON
            </Button>
          </div>
          
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Kopyala
          </Button>
          
          <Button size="sm" onClick={handleDownload} className="bg-gradient-accent">
            <Download className="w-4 h-4 mr-2" />
            İndir
          </Button>
        </div>
      </div>

      <Separator />

      {/* Transcript segments */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {segments.map((segment, index) => (
          <Card key={index} className="p-4 hover:shadow-soft transition-all duration-200 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="space-y-3">
              {/* Segment header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{segment.speaker}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatDuration(segment.start, segment.end)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{segment.start} - {segment.end}</span>
                </div>
              </div>
              
              {/* Segment text */}
              <p className="text-foreground leading-relaxed pl-11">
                {segment.text}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}