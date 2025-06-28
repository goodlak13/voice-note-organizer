import { useState, useEffect, useCallback } from 'react';
import { VoiceNote, FilterOptions, CategoryType } from '../types';
import { analyzeAudioForCategory, generateTitle } from '../utils/categorization';
import { generateWaveformData, createAudioBuffer } from '../utils/audioAnalysis';

const STORAGE_KEY = 'voice-notes-organizer';

export const useVoiceNotes = () => {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          // Convert date strings back to Date objects
          const notesWithDates = parsedNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt)
          }));
          setVoiceNotes(notesWithDates);
        }
      } catch (error) {
        console.error('Failed to load voice notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voiceNotes));
    }
  }, [voiceNotes, isLoading]);

  const addVoiceNote = useCallback(async (audioBlob: Blob): Promise<string> => {
    const id = crypto.randomUUID();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Get duration from audio blob
    const duration = await getAudioDuration(audioBlob);
    
    // Analyze audio for categorization
    const category = await analyzeAudioForCategory(audioBlob);
    const title = generateTitle(duration, category);
    
    // Generate waveform data
    let waveformData: number[] = [];
    try {
      const audioBuffer = await createAudioBuffer(audioBlob);
      waveformData = generateWaveformData(audioBuffer);
    } catch (error) {
      console.error('Failed to generate waveform:', error);
      // Create dummy waveform data
      waveformData = Array.from({ length: 100 }, () => Math.random() * 0.8);
    }

    const newNote: VoiceNote = {
      id,
      audioUrl,
      audioBlob,
      title,
      category,
      duration,
      createdAt: new Date(),
      waveformData,
      tags: [],
      isFavorite: false
    };

    setVoiceNotes(prev => [newNote, ...prev]);
    return id;
  }, []);

  const deleteVoiceNote = useCallback((id: string) => {
    setVoiceNotes(prev => {
      const noteToDelete = prev.find(note => note.id === id);
      if (noteToDelete?.audioUrl) {
        URL.revokeObjectURL(noteToDelete.audioUrl);
      }
      return prev.filter(note => note.id !== id);
    });
  }, []);

  const updateVoiceNote = useCallback((id: string, updates: Partial<VoiceNote>) => {
    setVoiceNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setVoiceNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  }, []);

  const filterNotes = useCallback((notes: VoiceNote[], filters: FilterOptions): VoiceNote[] => {
    let filtered = [...notes];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(note => note.category === filters.category);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter(note => 
        note.createdAt >= filters.dateRange!.start &&
        note.createdAt <= filters.dateRange!.end
      );
    }

    // Sort notes
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'duration':
        filtered.sort((a, b) => b.duration - a.duration);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, []);

  const exportNotes = useCallback((noteIds: string[] = []) => {
    const notesToExport = noteIds.length > 0 
      ? voiceNotes.filter(note => noteIds.includes(note.id))
      : voiceNotes;

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      notes: notesToExport.map(({ audioBlob, audioUrl, ...note }) => note)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-notes-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [voiceNotes]);

  const getStats = useCallback(() => {
    const totalNotes = voiceNotes.length;
    const totalDuration = voiceNotes.reduce((sum, note) => sum + note.duration, 0);
    const favoriteCount = voiceNotes.filter(note => note.isFavorite).length;
    
    const categoryStats = voiceNotes.reduce((stats, note) => {
      stats[note.category] = (stats[note.category] || 0) + 1;
      return stats;
    }, {} as Record<CategoryType, number>);

    return {
      totalNotes,
      totalDuration,
      favoriteCount,
      categoryStats
    };
  }, [voiceNotes]);

  return {
    voiceNotes,
    isLoading,
    addVoiceNote,
    deleteVoiceNote,
    updateVoiceNote,
    toggleFavorite,
    filterNotes,
    exportNotes,
    getStats
  };
};

// Helper function to get audio duration from blob
const getAudioDuration = (audioBlob: Blob): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.onloadedmetadata = () => {
      // Check if duration is valid
      if (isFinite(audio.duration) && !isNaN(audio.duration)) {
        resolve(audio.duration);
      } else {
        // Fallback: estimate duration from blob size (rough approximation)
        const estimatedDuration = audioBlob.size / 16000; // Rough estimate for webm audio
        resolve(Math.max(1, estimatedDuration)); // Minimum 1 second
      }
      URL.revokeObjectURL(audio.src);
    };
    
    audio.onerror = () => {
      // Fallback: estimate duration from blob size
      const estimatedDuration = audioBlob.size / 16000;
      resolve(Math.max(1, estimatedDuration));
      URL.revokeObjectURL(audio.src);
    };
    
    audio.onabort = () => {
      const estimatedDuration = audioBlob.size / 16000;
      resolve(Math.max(1, estimatedDuration));
      URL.revokeObjectURL(audio.src);
    };
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      if (audio.readyState === 0) {
        const estimatedDuration = audioBlob.size / 16000;
        resolve(Math.max(1, estimatedDuration));
        URL.revokeObjectURL(audio.src);
      }
    }, 3000);
    
    audio.src = URL.createObjectURL(audioBlob);
  });
};