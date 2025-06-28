import React from 'react';

interface WaveformPreviewProps {
  waveformData: number[];
  isPlaying: boolean;
  duration: number;
  compact?: boolean;
}

export const WaveformPreview: React.FC<WaveformPreviewProps> = ({ 
  waveformData, 
  isPlaying, 
  duration,
  compact = false 
}) => {
  const bars = waveformData.length > 0 ? waveformData : Array.from({ length: compact ? 20 : 50 }, () => Math.random() * 0.3);
  const maxHeight = compact ? 24 : 48;
  
  return (
    <div className="flex items-center justify-center space-x-1 h-full">
      {bars.map((amplitude, index) => {
        const height = Math.max(2, amplitude * maxHeight);
        const isActive = isPlaying && index % 3 === (Date.now() / 200) % 3;
        
        return (
          <div
            key={index}
            className={`bg-gradient-to-t from-orange-400 to-pink-400 rounded-full transition-all duration-200 ${
              isActive ? 'opacity-100' : 'opacity-60'
            }`}
            style={{
              width: compact ? '2px' : '3px',
              height: `${height}px`,
              transform: isActive ? 'scaleY(1.2)' : 'scaleY(1)'
            }}
          />
        );
      })}
    </div>
  );
};