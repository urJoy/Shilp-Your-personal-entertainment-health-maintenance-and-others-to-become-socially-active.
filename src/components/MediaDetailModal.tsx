import React from 'react';
import { MediaItem } from '../types';
import { X, Film, Music, Tv, Theater, Bookmark, Check, ExternalLink, Search } from 'lucide-react';

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  isWatched: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleWatched: (id: string) => void;
  onSearchGlobal: (query: string) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  isWatched,
  onToggleBookmark,
  onToggleWatched,
  onSearchGlobal,
}) => {
  if (!item) return null;

  const getTypeIcon = () => {
    switch (item.type) {
      case 'music':
        return <Music className="w-5 h-5 text-amber-200" />;
      case 'theatre':
        return <Theater className="w-5 h-5 text-rose-200" />;
      case 'web_series':
        return <Tv className="w-5 h-5 text-teal-200" />;
      case 'movie':
        return <Film className="w-5 h-5 text-indigo-200" />;
    }
  };

  const getTypeName = () => {
    switch (item.type) {
      case 'music':
        return 'Musical Composition / Album';
      case 'theatre':
        return 'Theatre Production';
      case 'web_series':
        return 'Web & Streaming Series';
      case 'movie':
        return 'Feature Film';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#FAF9F5] text-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Artwork Banner */}
        <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${item.gradientTheme} p-6 sm:p-8 flex flex-col justify-end text-white overflow-hidden`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-white/80 text-xs font-medium">
            {getTypeIcon()}
            <span>{getTypeName()}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{item.year}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{item.runtimeOrLength}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            {item.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-200 font-serif italic">
            by {item.creatorOrDirector}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Metadata Bar (Zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 pb-3 border-b border-stone-200/80">
            <span className="font-medium text-stone-800">{item.genre}</span>
            <span aria-hidden="true">·</span>
            <span>Mood: {item.moodTag}</span>
            <span aria-hidden="true">·</span>
            <span>Platform: {item.streamingOrVenue}</span>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Synopsis &amp; Artistic Essence
            </h4>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              {item.description}
            </p>
          </div>

          {/* Why It Fits & Wellness Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200/70">
              <h4 className="text-xs font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                Why It Fits Your Mindset
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.whyItFits}
              </p>
            </div>

            <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200/70">
              <h4 className="text-xs font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Holistic Wellness Impact
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.wellnessImpact}
              </p>
            </div>
          </div>

          {/* Thematic anchors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Thematic Resonance
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
              {item.themes.map((theme, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <span className="text-stone-400">#</span>
                  <span className="font-medium text-stone-700">{theme}</span>
                  {i < item.themes.length - 1 && <span className="text-stone-300 ml-1">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-100/80 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved in Plan' : 'Save to Plan'}</span>
              </button>

              <button
                onClick={() => onToggleWatched(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isWatched
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isWatched ? 'Completed' : 'Mark Experienced'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onSearchGlobal(`${item.title} ${item.creatorOrDirector} reviews analysis`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span>Explore on World Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
