import React, { useState } from 'react';
import { Mic, Plus } from 'lucide-react';

interface FloatingRecordButtonProps {
  onStartRecording: () => void;
}

export const FloatingRecordButton: React.FC<FloatingRecordButtonProps> = ({ onStartRecording }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onStartRecording}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full shadow-2xl hover:shadow-orange-200 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40 group"
      title="Record New Note"
    >
      <div className="relative">
        <Mic className={`w-6 h-6 text-white transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} />
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Record New Note
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </button>
  );
};