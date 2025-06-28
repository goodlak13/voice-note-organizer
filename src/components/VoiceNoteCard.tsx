import React, { useState } from 'react';
import { Play, Pause, Heart, Trash2, Edit3, Download, Share } from 'lucide-react';
import { VoiceNote } from '../types';
import { formatDuration } from '../utils/audioAnalysis';
import { getCategoryColor, getCategoryEmoji } from '../utils/categorization';
import { AudioPlayer } from './AudioPlayer';
import { WaveformPreview } from './WaveformPreview';

interface VoiceNoteCardProps {
  note: VoiceNote;
  viewMode: 'grid' | 'list';
  onDelete: () => void;
  onUpdate: (updates: Partial<VoiceNote>) => void;
  onToggleFavorite: () => void;
}

export const VoiceNoteCard: React.FC<VoiceNoteCardProps> = ({
  note,
  viewMode,
  onDelete,
  onUpdate,
  onToggleFavorite
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== note.title) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = note.audioUrl;
    link.download = `${note.title}.webm`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `Check out my voice note: ${note.title}`,
          url: note.audioUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${note.title} - ${note.audioUrl}`);
    }
  };

  const categoryColor = getCategoryColor(note.category);
  const categoryEmoji = getCategoryEmoji(note.category);

  const cardClasses = viewMode === 'grid'
    ? 'bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300'
    : 'bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 flex items-center space-x-4';

  return (
    <div className={cardClasses}>
      {viewMode === 'grid' ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  autoFocus
                />
              ) : (
                <h3 
                  className="font-semibold text-gray-800 text-sm line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  {note.title}
                </h3>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs">{categoryEmoji}</span>
                <span className="text-xs text-gray-500">{formatDuration(note.duration)}</span>
                <span className="text-xs text-gray-400">
                  {note.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={onToggleFavorite}
              className={`p-1 rounded-full transition-all duration-200 ${
                note.isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Waveform */}
          <div className="h-16">
            <WaveformPreview 
              waveformData={note.waveformData}
              isPlaying={isPlaying}
              duration={note.duration}
            />
          </div>

          {/* Audio Player */}
          <AudioPlayer
            audioUrl={note.audioUrl}
            onPlayStateChange={setIsPlaying}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className={`px-2 py-1 bg-gradient-to-r ${categoryColor} text-white text-xs rounded-full font-medium`}>
              {categoryEmoji} {note.category}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Edit title"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Share"
              >
                <Share className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <>
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center text-white text-lg font-semibold`}>
              {categoryEmoji}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                autoFocus
              />
            ) : (
              <h3 
                className="font-semibold text-gray-800 truncate cursor-pointer hover:text-orange-600 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
              >
                {note.title}
              </h3>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{formatDuration(note.duration)}</span>
              <span>{note.createdAt.toLocaleDateString()}</span>
            </div>
            
            <div className="h-8">
              <WaveformPreview 
                waveformData={note.waveformData}
                isPlaying={isPlaying}
                duration={note.duration}
                compact
              />
            </div>
          </div>

          <div className="flex-shrink-0">
            <AudioPlayer
              audioUrl={note.audioUrl}
              onPlayStateChange={setIsPlaying}
              compact
            />
          </div>

          <div className="flex-shrink-0 flex items-center space-x-1">
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-lg transition-all duration-200 ${
                note.isFavorite 
                  ? 'text-red-500 hover:text-red-600 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};