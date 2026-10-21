import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Sparkles, RefreshCw, Compass, ArrowRight, BookOpen, Film, Heart } from 'lucide-react';
import { SearchResult, MediaItem, Course } from '../types';

interface GlobalSearchViewProps {
  onOpenMedia: (item: MediaItem) => void;
  onOpenCourse: (course: Course) => void;
  mediaItems: MediaItem[];
  courses: Course[];
  initialQuery?: string;
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({
  onOpenMedia,
  onOpenCourse,
  mediaItems,
  courses,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const suggestedQueries = [
    'Best acclaimed theatre productions in London and Broadway right now',
    'Neuroscience behind binaural beats and vagus nerve calm',
    'Auteur films and cinema masterpieces similar to Perfect Days',
    'Stoic principles for managing overwhelm in the digital age',
    'Minimalist ambient music compositions for deep focus',
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery !== undefined ? customQuery : query;
    if (!targetQuery.trim()) return;

    setIsLoading(true);
    setSearchError(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResult = await res.json();
      setSearchResult(data);
    } catch (err: unknown) {
      console.error(err);
      setSearchError('Unable to complete global search at this moment. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find matches from internal catalogue to show alongside
  const matchedMedia = searchResult
    ? mediaItems.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.genre.toLowerCase().includes(query.toLowerCase()) ||
          m.creatorOrDirector.toLowerCase().includes(query.toLowerCase()) ||
          m.themes.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 2)
    : [];

  const matchedCourses = searchResult
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 1)
    : [];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-600 mb-1">
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          <span>Live World Search Engine · Grounded by Google</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-sans">
          Search Anything Across the World
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          Query live web knowledge, cultural archives, scientific studies, theatre reviews, and wellness neuroscience in one integrated search.
        </p>
      </div>

      {/* Main Google-Style Search Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-2xl border-2 border-stone-300 focus-within:border-stone-900 shadow-md hover:shadow-lg transition-all overflow-hidden p-2">
            <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything across the world just like Google..."
              className="w-full px-4 py-2.5 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-600 text-xs px-2"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search World</span>
              )}
            </button>
          </div>
        </form>

        {/* Category Pills & Suggested Queries */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-stone-400 font-medium">Domain:</span>
            {['All', 'Entertainment & Theatre', 'Mind & Philosophy', 'Science & Health', 'Arts & Culture'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="text-stone-400 hidden sm:block">
            Powered by Google Search Grounding
          </div>
        </div>

        {/* Suggested Queries */}
        {!searchResult && !isLoading && (
          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Suggested Curations &amp; Discoveries
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(sug);
                    handleSearch(undefined, sug);
                  }}
                  className="text-xs text-left px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/70 text-stone-700 transition-colors"
                >
                  {sug} &rarr;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error state */}
      {searchError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
          {searchError}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 bg-white rounded-3xl border border-stone-200 space-y-4 animate-pulse">
          <div className="h-4 bg-stone-200 rounded-md w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-stone-200 rounded-md w-full"></div>
            <div className="h-4 bg-stone-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-stone-200 rounded-md w-4/6"></div>
          </div>
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="h-16 bg-stone-100 rounded-xl"></div>
            <div className="h-16 bg-stone-100 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {searchResult && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Answer Card */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs text-stone-500">
              <span className="font-semibold text-stone-800">
                Grounded Global Synthesis for "{searchResult.query}"
              </span>
              <span className="font-mono tabular-nums">
                {new Date(searchResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Synthesized Markdown Body */}
            <div className="prose prose-stone text-stone-800 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
              {searchResult.summary}
            </div>

            {/* Live Web Sources */}
            {searchResult.sources && searchResult.sources.length > 0 && (
              <div className="pt-6 border-t border-stone-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verified Grounding Sources ({searchResult.sources.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResult.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-colors flex items-center justify-between group text-xs text-stone-700"
                    >
                      <div className="truncate pr-2">
                        <p className="font-medium text-stone-900 truncate group-hover:underline">
                          {src.title}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {new URL(src.uri).hostname}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Queries */}
            {searchResult.webQueries && searchResult.webQueries.length > 0 && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium">Related searches:</span>
                {searchResult.webQueries.map((wq, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(wq);
                      handleSearch(undefined, wq);
                    }}
                    className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {wq} &rarr;
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Integrated Catalogue Discoveries (if related to query) */}
          {(matchedMedia.length > 0 || matchedCourses.length > 0) && (
            <div className="p-6 bg-stone-100/70 rounded-3xl border border-stone-200/80 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Related Items in Your Shilp Hub
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenMedia(item)}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs cursor-pointer hover:border-stone-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-stone-500 uppercase">
                        {item.type.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 mt-1">{item.title}</h4>
                      <p className="text-xs text-stone-600 font-serif italic">{item.creatorOrDirector}</p>
                    </div>
                    <span className="text-xs text-stone-900 font-medium mt-3">View Details &rarr;</span>
                  </div>
                ))}

                {matchedCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenCourse(c)}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs cursor-pointer hover:border-stone-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-700 uppercase">
                        Course Module
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 mt-1">{c.title}</h4>
                      <p className="text-xs text-stone-600">Led by {c.instructor}</p>
                    </div>
                    <span className="text-xs text-stone-900 font-medium mt-3">Open Course &rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
