import React from 'react';
import { Mic, Sparkles, Brain, Clock } from 'lucide-react';

interface WelcomeHeroProps {
  onStartRecording: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onStartRecording }) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Mic className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Capture Thoughts,
          </span>
          <br />
          <span className="text-gray-700">Organize Ideas</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform your voice into organized, searchable notes with smart categorization. 
          Never lose a brilliant idea again.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartRecording}
          className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-orange-200 hover:scale-105 transition-all duration-300 mb-16"
        >
          <div className="flex items-center space-x-3">
            <Mic className="w-6 h-6 group-hover:animate-pulse" />
            <span>Start Recording</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Categories</h3>
            <p className="text-gray-600 text-sm">AI-powered categorization organizes your thoughts automatically</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Capture ideas in under 2 seconds with one-tap recording</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Visual Audio</h3>
            <p className="text-gray-600 text-sm">See your thoughts with beautiful waveform visualizations</p>
          </div>
        </div>
      </div>
    </div>
  );
};