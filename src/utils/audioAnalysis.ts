export const generateWaveformData = (audioBuffer: AudioBuffer, samples: number = 100): number[] => {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData: number[] = [];

  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[blockStart + j]);
    }
    filteredData.push(sum / blockSize);
  }

  // Normalize the data
  const max = Math.max(...filteredData);
  return filteredData.map(point => max > 0 ? point / max : 0);
};

export const formatDuration = (seconds: number): string => {
  // Handle invalid durations
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const createAudioBuffer = async (audioBlob: Blob): Promise<AudioBuffer> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

export const calculateAudioLevel = (analyser: AnalyserNode): number => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  const sum = dataArray.reduce((acc, value) => acc + value, 0);
  return sum / bufferLength / 255; // Normalize to 0-1
};

export const generateLiveWaveform = (analyser: AnalyserNode, samples: number = 50): number[] => {
  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  
  const waveform: number[] = [];
  const step = Math.floor(bufferLength / samples);
  
  for (let i = 0; i < samples; i++) {
    const value = Math.abs((dataArray[i * step] - 128) / 128);
    waveform.push(value);
  }
  
  return waveform;
};