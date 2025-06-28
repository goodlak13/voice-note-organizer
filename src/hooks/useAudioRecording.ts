import { useState, useRef, useCallback, useEffect } from 'react';
import { RecordingState } from '../types';
import { calculateAudioLevel, generateLiveWaveform } from '../utils/audioAnalysis';
import { MAX_RECORDING_LENGTH } from '../constants/categories';

export const useAudioRecording = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    waveformData: []
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isRecordingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);

  const updateAudioVisualization = useCallback(() => {
    if (!analyserRef.current || !isRecordingRef.current || isPausedRef.current) {
      return;
    }

    const audioLevel = calculateAudioLevel(analyserRef.current);
    const waveformData = generateLiveWaveform(analyserRef.current);

    setRecordingState(prev => ({
      ...prev,
      audioLevel,
      waveformData
    }));

    animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      
      // Reset timing variables
      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      isRecordingRef.current = true;
      isPausedRef.current = false;

      setRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioLevel: 0,
        waveformData: []
      });

      // Start duration timer
      intervalRef.current = setInterval(() => {
        if (!isRecordingRef.current || isPausedRef.current) return;
        
        const now = Date.now();
        const elapsed = (now - startTimeRef.current - pausedDurationRef.current) / 1000;
        
        setRecordingState(prev => ({
          ...prev,
          duration: elapsed
        }));

        // Stop recording if max length reached
        if (elapsed >= MAX_RECORDING_LENGTH) {
          stopRecording();
        }
      }, 100);
      
      // Start audio visualization
      updateAudioVisualization();
      
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }, [updateAudioVisualization]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current && !isPausedRef.current) {
      mediaRecorderRef.current.pause();
      isPausedRef.current = true;
      
      setRecordingState(prev => ({
        ...prev,
        isPaused: true
      }));

      // Clear animation frame but keep interval running
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current && isPausedRef.current) {
      mediaRecorderRef.current.resume();
      
      // Adjust pause duration tracking
      const pauseEndTime = Date.now();
      const currentDuration = recordingState.duration * 1000;
      const expectedTime = startTimeRef.current + currentDuration + pausedDurationRef.current;
      pausedDurationRef.current += pauseEndTime - expectedTime;
      
      isPausedRef.current = false;
      
      setRecordingState(prev => ({
        ...prev,
        isPaused: false
      }));

      // Restart audio visualization
      updateAudioVisualization();
    }
  }, [recordingState.duration, updateAudioVisualization]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
      
      // Update refs
      isRecordingRef.current = false;
      isPausedRef.current = false;
      
      // Clean up timers
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioLevel: 0,
        waveformData: []
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    recordingState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording
  };
};