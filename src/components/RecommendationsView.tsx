import React, { useState } from 'react';
import { MediaItem, MediaType, MoodType } from '../types';
import { Music, Theater, Tv, Film, Sparkles, Filter, Bookmark, Check, RefreshCw, Send, SlidersHorizontal, Search } from 'lucide-react';

interface RecommendationsViewProps {
  mediaItems: MediaItem[];
  onOpenMedia: (item: MediaItem) => void;
  bookmarkedIds: string[];
  watchedIds: string[];
  onToggleBookmark: (id: string) => void;
  onToggleWatched: (id: string) => void;
  onSearchGlobal: (query: string) => void;
  onAddCustomRecommendations: (items: MediaItem[]) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  mediaItems,
  onOpenMedia,
  bookmarkedIds,
  watchedIds,
  onToggleBookmark,
  onToggleWatched,
  onSearchGlobal,
  onAddCustomRecommendations,
}) => {
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom AI Recommender state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const moodOptions: MoodType[] = [
    'Reflective & Introspective',
    'Euphoric & Energized',
    'Deep Focus & Flow',
    'Cathartic & Emotional',
    'Cozy & Comforting',
    'Curious & Mind-Expanding',
  ];

  const handleGenerateAiRecs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood !== 'all' ? selectedMood : userPrompt,
          mediaType: selectedType !== 'all' ? selectedType : 'All Formats',
          preferences: userPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        onAddCustomRecommendations(data.recommendations);
        setUserPrompt('');
        setIsAiDrawerOpen(false);
      } else {
        setAiError('No specific matches found. Try broadening your prompt description.');
      }
    } catch (err: unknown) {
      console.error(err);
      setAiError('Could not connect to recommendation engine. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter items
  const filteredItems = mediaItems.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesMood = selectedMood === 'all' || item.moodTag === selectedMood;
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creatorOrDirector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.themes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesMood && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <span>Tailored Entertainment Curation</span>
            <span aria-hidden="true">·</span>
            <span>Music, Stage, Cinema &amp; Series</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-sans">
            Personalised Repertoire
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Thoughtfully curated works designed to elevate mental clarity, inspire emotional catharsis, and nourish your daily headspace.
          </p>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-sm self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isAiDrawerOpen ? 'Close AI Curator' : 'Ask AI for Custom Curation'}</span>
        </button>
      </div>

      {/* AI Tailored Prompt Drawer */}
      {isAiDrawerOpen && (
        <div className="p-6 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">AI Personal Curation Partner</h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">Gemini 3.8 Flash</span>
          </div>
          <p className="text-xs text-stone-300">
            Tell us about your day, how you feel, or what kind of narrative/sonic world you want to step into tonight.
          </p>

          <form onSubmit={handleGenerateAiRecs} className="space-y-3">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g., 'I’ve had an intense week of technical problems and want something visually serene with gentle acoustic guitar or a theatre play that reminds me why human connection matters...'"
              rows={3}
              className="w-full p-3.5 rounded-xl bg-stone-800 border border-stone-700 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Tailor for:</span>
                <span className="text-amber-300 font-medium capitalize">{selectedType}</span>
                <span>·</span>
                <span className="text-amber-300 font-medium">{selectedMood}</span>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !userPrompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs tracking-wide transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Curating Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Tailored Suggestions</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <p className="text-xs text-rose-400 pt-1">{aiError}</p>
            )}
          </form>
        </div>
      )}

      {/* Filter Bar Controls */}
      <div className="space-y-4">
        {/* Format Selector (Functional Segmented Control) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedType('music')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'music'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Music className="w-3 h-3 text-amber-600" />
              <span>Music</span>
            </button>
            <button
              onClick={() => setSelectedType('theatre')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'theatre'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Theater className="w-3 h-3 text-rose-600" />
              <span>Theatre Productions</span>
            </button>
            <button
              onClick={() => setSelectedType('web_series')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'web_series'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tv className="w-3 h-3 text-teal-600" />
              <span>Web Series</span>
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'movie'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Film className="w-3 h-3 text-indigo-600" />
              <span>Movies</span>
            </button>
          </div>

          {/* Quick Search in catalogue */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search genre, theme, title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Mood Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-medium shrink-0">Mood:</span>
          <button
            onClick={() => setSelectedMood('all')}
            className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              selectedMood === 'all'
                ? 'bg-stone-900 text-white font-medium'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            All Moods
          </button>
          {moodOptions.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                selectedMood === mood
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
        <span>Showing <strong className="text-stone-800 font-mono tabular-nums">{filteredItems.length}</strong> tailored recommendations</span>
        {(selectedType !== 'all' || selectedMood !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedMood('all');
              setSearchQuery('');
            }}
            className="text-stone-900 font-medium hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Media Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isWatched = watchedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Artwork Banner (CSS gradient with Zero-Broken-Image guarantee) */}
                  <div
                    onClick={() => onOpenMedia(item)}
                    className={`h-44 bg-gradient-to-br ${item.gradientTheme} p-5 flex flex-col justify-between text-white cursor-pointer group relative`}
                  >
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="capitalize font-medium">{item.type.replace('_', ' ')}</span>
                      <span className="font-mono tabular-nums">{item.runtimeOrLength}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:underline underline-offset-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-200 font-serif italic">
                        {item.creatorOrDirector} ({item.year})
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Unboxed Metadata Line with · separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-stone-800">{item.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.moodTag}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Why It Fits Callout */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-700 leading-snug">
                      <strong className="text-stone-900 block font-medium mb-0.5">Why it fits your state:</strong>
                      {item.whyItFits}
                    </div>

                    <div className="text-[11px] text-stone-500 truncate">
                      Venue / Stream: <span className="font-medium text-stone-700">{item.streamingOrVenue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`p-1.5 rounded-md border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                      title={isBookmarked ? 'Remove from plan' : 'Save to weekend plan'}
                      aria-label="Save to plan"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => onToggleWatched(item.id)}
                      className={`p-1.5 rounded-md border transition-colors ${
                        isWatched
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                      title={isWatched ? 'Completed' : 'Mark as experienced'}
                      aria-label="Mark experienced"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenMedia(item)}
                    className="font-semibold text-stone-900 hover:text-amber-800 transition-colors"
                  >
                    Details &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 space-y-4">
          <Filter className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No matching recommendations found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your genre or mood filter, or ask our AI Curation partner to generate new custom suggestions for your scenario.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedMood('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
