import React, { useState, useEffect } from 'react';
import { Mic, Square, Pause, Play, X } from 'lucide-react';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { formatDuration } from '../utils/audioAnalysis';
import { WaveformVisualizer } from './WaveformVisualizer';

interface RecordingInterfaceProps {
  onNoteAdded: (audioBlob: Blob) => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const RecordingInterface: React.FC<RecordingInterfaceProps> = ({ 
  onNoteAdded, 
  isVisible,
  onVisibilityChange 
}) => {
  const { recordingState, startRecording, pauseRecording, resumeRecording, stopRecording } = useAudioRecording();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (!success) {
      setShowPermissionPrompt(true);
    }
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      await onNoteAdded(audioBlob);
    }
  };

  const handlePauseResume = () => {
    if (recordingState.isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const handleClose = () => {
    if (recordingState.isRecording) {
      // If currently recording, stop first
      stopRecording();
    }
    onVisibilityChange(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl mx-auto relative">
      {/* Close button - only show when there are other notes */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
        title="Close recording interface"
      >
        <X className="w-5 h-5" />
      </button>

      {showPermissionPrompt && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">
            Please allow microphone access to record voice notes. Click the microphone icon in your browser's address bar.
          </p>
        </div>
      )}

      <div className="text-center space-y-6">
        {/* Recording Status */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {recordingState.isRecording 
              ? (recordingState.isPaused ? 'Recording Paused' : 'Recording...') 
              : 'Ready to Record'
            }
          </h2>
          
          {recordingState.isRecording && (
            <div className="text-3xl font-mono text-gray-600">
              {formatDuration(recordingState.duration)}
            </div>
          )}
        </div>

        {/* Waveform Visualization */}
        <div className="h-24 flex items-center justify-center">
          <WaveformVisualizer 
            waveformData={recordingState.waveformData}
            audioLevel={recordingState.audioLevel}
            isRecording={recordingState.isRecording && !recordingState.isPaused}
          />
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!recordingState.isRecording ? (
            <button
              onClick={handleStartRecording}
              className="group relative w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-200 hover:scale-110 transition-all duration-300"
            >
              <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
              >
                {recordingState.isPaused ? (
                  <Play className="w-6 h-6 text-white ml-1" />
                ) : (
                  <Pause className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={handleStopRecording}
                className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Square className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500 space-y-1">
          {!recordingState.isRecording ? (
            <>
              <p>Click the microphone to start recording</p>
              <p>Your voice will be automatically categorized</p>
            </>
          ) : (
            <>
              <p>Speak clearly for best results</p>
              <p>Maximum recording length: 5 minutes</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};