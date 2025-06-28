import React from 'react';
import { Mic, BarChart3, Download, Sparkles, Plus } from 'lucide-react';

interface HeaderProps {
  totalNotes: number;
  onShowStats: () => void;
  onExportAll: () => void;
  onStartRecording: () => void;
  hasNotes: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  totalNotes, 
  onShowStats, 
  onExportAll, 
  onStartRecording,
  hasNotes 
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Voice Note Organizer
              </h1>
              {totalNotes > 0 && (
                <p className="text-sm text-gray-500">
                  {totalNotes} {totalNotes === 1 ? 'note' : 'notes'} captured
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* New Recording Button in Header */}
            {hasNotes && (
              <button
                onClick={onStartRecording}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                title="Record New Note"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Note</span>
              </button>
            )}

            {totalNotes > 0 && (
              <>
                <button
                  onClick={onShowStats}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="View Statistics"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Stats</span>
                </button>
                
                <button
                  onClick={onExportAll}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Export All Notes"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Export</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};