import React from 'react';

interface WaveformVisualizerProps {
  waveformData: number[];
  audioLevel: number;
  isRecording: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  waveformData, 
  audioLevel, 
  isRecording 
}) => {
  // Generate bars for visualization
  const bars = waveformData.length > 0 ? waveformData : Array.from({ length: 50 }, () => 0);
  
  return (
    <div className="flex items-center justify-center space-x-1 h-full">
      {bars.map((amplitude, index) => {
        const height = Math.max(2, amplitude * 60); // Min height of 2px, max of 60px
        const opacity = isRecording ? 0.8 + (amplitude * 0.2) : 0.3;
        
        return (
          <div
            key={index}
            className={`bg-gradient-to-t from-orange-500 to-pink-500 rounded-full transition-all duration-100 ${
              isRecording ? 'animate-pulse' : ''
            }`}
            style={{
              width: '3px',
              height: `${height}px`,
              opacity,
              animationDelay: `${index * 20}ms`
            }}
          />
        );
      })}
      
      {/* Live audio level indicator */}
      {isRecording && (
        <div className="ml-4 flex flex-col items-center space-y-1">
          <div 
            className="w-2 bg-gradient-to-t from-green-400 to-green-600 rounded-full transition-all duration-100"
            style={{ height: `${Math.max(4, audioLevel * 40)}px` }}
          />
          <div className="text-xs text-gray-500">Live</div>
        </div>
      )}
    </div>
  );
};