import { useState } from 'react';
import { Mic, Waves } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { TranscriptionSettings, TranscriptionOptions } from './TranscriptionSettings';
import { TranscriptDisplay, TranscriptSegment } from './TranscriptDisplay';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const mockSegments: TranscriptSegment[] = [
  {
    speaker: "Speaker 1",
    start: "00:00:05",
    end: "00:00:12", 
    text: "Merhaba, toplantıya hoş geldiniz. Bugün önemli konuları ele alacağız."
  },
  {
    speaker: "Speaker 2", 
    start: "00:00:13",
    end: "00:00:18",
    text: "Teşekkürler. Öncelikle proje güncellemelerini konuşalım."
  },
  {
    speaker: "Speaker 1",
    start: "00:00:19", 
    end: "00:00:28",
    text: "Tabii ki. İlk olarak geliştiriciler ekibinden son hafta yapılan çalışmaları dinleyelim."
  }
];

export function VoiceTranscriptionApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [options, setOptions] = useState<TranscriptionOptions>({
    language: 'auto',
    removeFiller: true,
    speakerDiarization: true,
    maxSegmentLength: 5,
  });
  
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTranscriptSegments([]); // Clear previous results
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setTranscriptSegments([]);
  };

  const handleStartTranscription = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, use mock data
      setTranscriptSegments(mockSegments);
      
      toast({
        title: "Transkripsiyon Tamamlandı",
        description: `${selectedFile.name} başarıyla işlendi`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Transkripsiyon sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Mic className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-soft">
              <Waves className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ses Transkripsiyon
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ses dosyalarınızı hızlı ve doğru bir şekilde metne dönüştürün. 
            Konuşmacı ayırma ve çok dilli destek ile profesyonel transkripsiyon.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClearFile={handleClearFile}
            />
            
            <TranscriptionSettings
              options={options}
              onOptionsChange={setOptions}
              onStartTranscription={handleStartTranscription}
              isProcessing={isProcessing}
              hasFile={!!selectedFile}
            />
          </div>

          {/* Right Column - Transcript Display */}
          <div className="lg:col-span-2">
            <Card className="p-6 min-h-[600px]">
              <TranscriptDisplay 
                segments={transcriptSegments}
                isLoading={isProcessing}
              />
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-foreground mb-8">
            Özellikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-primary/20 hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Çok Dilli Destek</h3>
              <p className="text-sm text-muted-foreground">
                Türkçe, İngilizce ve diğer dillerde otomatik transkripsiyon
              </p>
            </Card>
            
            <Card className="p-6 text-center border-accent/20 hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Waves className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Konuşmacı Ayırma</h3>
              <p className="text-sm text-muted-foreground">
                Farklı konuşmacıları otomatik olarak tanıma ve ayırma
              </p>
            </Card>
            
            <Card className="p-6 text-center border-border hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-muted to-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Export Seçenekleri</h3>
              <p className="text-sm text-muted-foreground">
                JSON ve TXT formatında transkript dışa aktarma
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}