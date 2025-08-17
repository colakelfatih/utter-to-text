import { useState } from 'react';
import { Settings, Languages, Eraser, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export interface TranscriptionOptions {
  language: string;
  removeFiller: boolean;
  speakerDiarization: boolean;
  maxSegmentLength: number;
}

interface TranscriptionSettingsProps {
  options: TranscriptionOptions;
  onOptionsChange: (options: TranscriptionOptions) => void;
  onStartTranscription: () => void;
  isProcessing: boolean;
  hasFile: boolean;
}

const languages = [
  { value: 'auto', label: 'Otomatik Algıla' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'İngilizce' },
  { value: 'de', label: 'Almanca' },
  { value: 'fr', label: 'Fransızca' },
  { value: 'es', label: 'İspanyolca' },
];

export function TranscriptionSettings({ 
  options, 
  onOptionsChange, 
  onStartTranscription, 
  isProcessing, 
  hasFile 
}: TranscriptionSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = (key: keyof TranscriptionOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Ayarlar</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            {isExpanded ? 'Gizle' : 'Detay'}
          </Button>
        </div>

        {/* Basic settings - always visible */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Dil
            </Label>
            <Select
              value={options.language}
              onValueChange={(value) => updateOption('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dil seçin" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced settings - expandable */}
        {isExpanded && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Konuşmacı Ayırma
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Farklı konuşmacıları otomatik olarak ayır
                  </p>
                </div>
                <Switch
                  checked={options.speakerDiarization}
                  onCheckedChange={(checked) => updateOption('speakerDiarization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Eraser className="w-4 h-4" />
                    Dolgu Kelimeleri Temizle
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    "Iıı", "şey" gibi kelimeleri temizle
                  </p>
                </div>
                <Switch
                  checked={options.removeFiller}
                  onCheckedChange={(checked) => updateOption('removeFiller', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Maksimum Segment Süresi (dakika)</Label>
                <Select
                  value={options.maxSegmentLength.toString()}
                  onValueChange={(value) => updateOption('maxSegmentLength', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 dakika</SelectItem>
                    <SelectItem value="5">5 dakika</SelectItem>
                    <SelectItem value="10">10 dakika</SelectItem>
                    <SelectItem value="15">15 dakika</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Start button */}
        <Button 
          onClick={onStartTranscription}
          disabled={!hasFile || isProcessing}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              İşleniyor...
            </div>
          ) : (
            'Transkripsiyon Başlat'
          )}
        </Button>
      </div>
    </Card>
  );
}