import React, { useState } from 'react';
import { Sparkles, Compass, BookOpen, Heart, Volume2, VolumeX, Search } from 'lucide-react';
import { soundscapeEngine } from '../utils/soundscapes';

interface NavbarProps {
  activeTab: 'dashboard' | 'recommendations' | 'search' | 'learning' | 'wellness';
  setActiveTab: (tab: 'dashboard' | 'recommendations' | 'search' | 'learning' | 'wellness') => void;
  onOpenCheckIn: () => void;
  onToggleSoundscapes: () => void;
  isAudioPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckIn,
  onToggleSoundscapes,
  isAudioPlaying,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-amber-100 shadow-sm transition-transform group-hover:scale-105">
              <span className="font-serif italic font-bold text-lg leading-none">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-stone-900 font-sans whitespace-nowrap">
                Shilp
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'dashboard'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                  : 'hover:text-stone-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'recommendations'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                  : 'hover:text-stone-900'
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'search'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                  : 'hover:text-stone-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              World Search
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'learning'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                  : 'hover:text-stone-900'
              }`}
            >
              Learning Hub
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'wellness'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-950'
                  : 'hover:text-stone-900'
              }`}
            >
              Mindset &amp; Habits
            </button>
          </nav>

          {/* Zone 3: 1 primary action & ambient audio toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleSoundscapes}
              title={isAudioPlaying ? 'Mute ambient soundscape' : 'Play calming soundscape'}
              className={`p-2 rounded-lg border transition-all ${
                isAudioPlaying
                  ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                  : 'bg-stone-100/80 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
              aria-label="Toggle ambient soundscapes"
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenCheckIn}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shadow-sm hover:shadow"
            >
              Daily Check-In
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 flex flex-col gap-2 text-sm font-medium text-stone-700">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-stone-200/70 text-stone-950 font-semibold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('recommendations');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md ${activeTab === 'recommendations' ? 'bg-stone-200/70 text-stone-950 font-semibold' : ''}`}
            >
              Recommendations
            </button>
            <button
              onClick={() => {
                setActiveTab('search');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md ${activeTab === 'search' ? 'bg-stone-200/70 text-stone-950 font-semibold' : ''}`}
            >
              World Search
            </button>
            <button
              onClick={() => {
                setActiveTab('learning');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md ${activeTab === 'learning' ? 'bg-stone-200/70 text-stone-950 font-semibold' : ''}`}
            >
              Learning Hub
            </button>
            <button
              onClick={() => {
                setActiveTab('wellness');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md ${activeTab === 'wellness' ? 'bg-stone-200/70 text-stone-950 font-semibold' : ''}`}
            >
              Mindset &amp; Habits
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
