# 🎤 Voice Note Organizer

A beautiful, intelligent voice note application that transforms your spoken thoughts into organized, searchable notes with smart categorization and visual waveform displays.

![Voice Note Organizer](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)
![Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF)

## ✨ Features

### 🎯 Smart Organization
- **AI-Powered Categorization**: Automatically categorizes voice notes into Ideas, Work, Shopping, Tasks, Goals, and Random thoughts
- **Intelligent Titles**: Generates meaningful titles based on recording duration and category
- **Advanced Search**: Search through your notes by title, content, or tags
- **Flexible Filtering**: Filter by category, date range, and sort by various criteria

### 🎨 Beautiful Interface
- **Modern Design**: Clean, gradient-rich interface with glassmorphism effects
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Visual Waveforms**: Beautiful waveform visualizations for each recording
- **Grid & List Views**: Switch between card grid and compact list layouts
- **Dark/Light Themes**: Automatic theme adaptation

### 🎵 Advanced Audio Features
- **High-Quality Recording**: WebM/Opus encoding for optimal quality and compression
- **Real-time Visualization**: Live waveform display during recording
- **Playback Controls**: Play, pause, seek, speed control (0.5x to 2x)
- **Audio Analysis**: Visual feedback with amplitude detection
- **Export Options**: Download individual notes or export all data

### 📊 Analytics & Insights
- **Usage Statistics**: Track total notes, duration, and favorites
- **Category Analytics**: Visual breakdown of note distribution
- **Performance Metrics**: Average duration, favorite rates, and more
- **Export Data**: JSON export for backup and data portability

## 🚀 Live Demo

Visit the live application: [Voice Note Organizer](https://superb-chebakia-f675eb.netlify.app)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API
- **Storage**: Browser LocalStorage
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/voice-note-organizer.git
   cd voice-note-organizer
Install dependencies


npm install
Start development server


npm run dev
Open your browser
Navigate to http://localhost:5173

🏗️ Project Structure

src/
├── components/           # React components
│   ├── AudioPlayer.tsx   # Audio playback controls
│   ├── Header.tsx        # Application header
│   ├── RecordingInterface.tsx  # Recording UI
│   ├── VoiceNoteCard.tsx # Individual note display
│   ├── VoiceNoteLibrary.tsx    # Notes collection
│   ├── SearchAndFilter.tsx     # Search/filter controls
│   ├── StatsPanel.tsx    # Analytics dashboard
│   ├── WaveformVisualizer.tsx  # Live recording waveform
│   ├── WaveformPreview.tsx     # Static waveform display
│   ├── WelcomeHero.tsx   # Landing page hero
│   ├── FloatingRecordButton.tsx # Quick record button
│   └── BoltBadge.tsx     # Powered by badge
├── hooks/                # Custom React hooks
│   ├── useAudioRecording.ts    # Recording logic
│   └── useVoiceNotes.ts  # Notes management
├── utils/                # Utility functions
│   ├── audioAnalysis.ts  # Audio processing
│   └── categorization.ts # Smart categorization
├── types/                # TypeScript definitions
│   └── index.ts          # Type definitions
├── constants/            # Application constants
│   └── categories.ts     # Category definitions
└── App.tsx              # Main application component


