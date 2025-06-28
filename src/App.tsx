import React, { useState, useEffect } from 'react';
import { FilterOptions } from './types';
import { useVoiceNotes } from './hooks/useVoiceNotes';
import { DEFAULT_CATEGORY } from './constants/categories';
import { Header } from './components/Header';
import { RecordingInterface } from './components/RecordingInterface';
import { VoiceNoteLibrary } from './components/VoiceNoteLibrary';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StatsPanel } from './components/StatsPanel';
import { WelcomeHero } from './components/WelcomeHero';
import { FloatingRecordButton } from './components/FloatingRecordButton';

function App() {
  const { voiceNotes, isLoading, addVoiceNote, deleteVoiceNote, updateVoiceNote, toggleFavorite, filterNotes, exportNotes, getStats } = useVoiceNotes();
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    searchQuery: '',
    sortBy: 'newest'
  });
  const [showStats, setShowStats] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const filteredNotes = filterNotes(voiceNotes, filters);
  const hasNotes = voiceNotes.length > 0;

  const handleNoteAdded = async (audioBlob: Blob) => {
    await addVoiceNote(audioBlob);
    setIsRecording(false);
  };

  const handleStartNewRecording = () => {
    setIsRecording(true);
    // Scroll to top to show recording interface
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your voice notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
      </div>

      <div className="relative z-10">
        <Header 
          totalNotes={voiceNotes.length}
          onShowStats={() => setShowStats(!showStats)}
          onExportAll={() => exportNotes()}
          onStartRecording={handleStartNewRecording}
          hasNotes={hasNotes}
        />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {!hasNotes && !isRecording && (
            <WelcomeHero onStartRecording={() => setIsRecording(true)} />
          )}

          {(isRecording || !hasNotes) && (
            <RecordingInterface 
              onNoteAdded={handleNoteAdded}
              isVisible={isRecording || !hasNotes}
              onVisibilityChange={setIsRecording}
            />
          )}

          {showStats && (
            <StatsPanel 
              stats={getStats()}
              onClose={() => setShowStats(false)}
            />
          )}

          {hasNotes && !isRecording && (
            <>
              <SearchAndFilter 
                filters={filters}
                onFiltersChange={setFilters}
                totalNotes={filteredNotes.length}
                onExport={() => exportNotes()}
              />

              <VoiceNoteLibrary 
                notes={filteredNotes}
                onDeleteNote={deleteVoiceNote}
                onUpdateNote={updateVoiceNote}
                onToggleFavorite={toggleFavorite}
                isLoading={false}
              />
            </>
          )}

          {hasNotes && filteredNotes.length === 0 && !isRecording && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-white/20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' })}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Floating Record Button - only show when there are notes and not currently recording */}
        {hasNotes && !isRecording && (
          <FloatingRecordButton onStartRecording={handleStartNewRecording} />
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
}

export default App;