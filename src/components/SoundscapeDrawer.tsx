import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Sparkles, Bell, X } from 'lucide-react';
import { soundscapeEngine } from '../utils/soundscapes';

interface SoundscapeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
}

export const SoundscapeDrawer: React.FC<SoundscapeDrawerProps> = ({
  isOpen,
  onClose,
  isAudioPlaying,
  setIsAudioPlaying,
}) => {
  const [currentMode, setCurrentMode] = useState<string>(soundscapeEngine.getMode());
  const [volume, setVolume] = useState<number>(soundscapeEngine.getVolume());

  useEffect(() => {
    setCurrentMode(soundscapeEngine.getMode());
  }, [isOpen, isAudioPlaying]);

  const handleSelectMode = (mode: 'rain' | 'ocean' | 'drone' | 'bowl') => {
    soundscapeEngine.playSoundscape(mode);
    setCurrentMode(mode);
    setIsAudioPlaying(true);
  };

  const handleStop = () => {
    soundscapeEngine.stop();
    setCurrentMode('off');
    setIsAudioPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundscapeEngine.setVolume(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-stone-900 text-stone-100 rounded-2xl shadow-2xl border border-stone-800 p-5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold tracking-wide text-stone-100">Ambient Soundscape</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-200 p-1 rounded-md transition-colors"
          aria-label="Close soundscape settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-stone-400 mt-2 mb-4">
        Pure browser-synthesized acoustic environments to deepen focus, calm the mind, and accompany your reading.
      </p>

      {/* Preset Soundscapes */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleSelectMode('rain')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
            currentMode === 'rain' && isAudioPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
              : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>Gentle Rain</span>
        </button>

        <button
          onClick={() => handleSelectMode('ocean')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
            currentMode === 'ocean' && isAudioPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
              : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-teal-400" />
          <span>Ocean Tide</span>
        </button>

        <button
          onClick={() => handleSelectMode('drone')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
            currentMode === 'drone' && isAudioPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
              : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sacred Drone</span>
        </button>

        <button
          onClick={() => handleSelectMode('bowl')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
            currentMode === 'bowl' && isAudioPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
              : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-rose-400" />
          <span>Singing Bowl</span>
        </button>
      </div>

      {/* Volume slider */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs text-stone-400">
          <span>Acoustic Volume</span>
          <span className="font-mono tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        {isAudioPlaying ? (
          <button
            onClick={handleStop}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700/90 rounded-lg transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            <span>Mute Soundscape</span>
          </button>
        ) : (
          <button
            onClick={() => handleSelectMode('rain')}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Start Calming Rain</span>
          </button>
        )}
      </div>
    </div>
  );
};
