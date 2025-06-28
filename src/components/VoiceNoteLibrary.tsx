import React, { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { VoiceNote } from '../types';
import { VoiceNoteCard } from './VoiceNoteCard';

interface VoiceNoteLibraryProps {
  notes: VoiceNote[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, updates: Partial<VoiceNote>) => void;
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
}

export const VoiceNoteLibrary: React.FC<VoiceNoteLibraryProps> = ({
  notes,
  onDeleteNote,
  onUpdateNote,
  onToggleFavorite,
  isLoading
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Voice Notes</h2>
        <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {notes.map(note => (
          <VoiceNoteCard
            key={note.id}
            note={note}
            viewMode={viewMode}
            onDelete={() => onDeleteNote(note.id)}
            onUpdate={(updates) => onUpdateNote(note.id, updates)}
            onToggleFavorite={() => onToggleFavorite(note.id)}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-white/20">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No voice notes yet</h3>
            <p className="text-gray-500">Start recording to capture your first thought!</p>
          </div>
        </div>
      )}
    </div>
  );
};