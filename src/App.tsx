/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { RecommendationsView } from './components/RecommendationsView';
import { GlobalSearchView } from './components/GlobalSearchView';
import { LearningHubView } from './components/LearningHubView';
import { WellnessMindsetView } from './components/WellnessMindsetView';
import { MediaDetailModal } from './components/MediaDetailModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { SoundscapeDrawer } from './components/SoundscapeDrawer';
import {
  INITIAL_MEDIA_ITEMS,
  INITIAL_COURSES,
  INITIAL_WORKSHOPS,
  INITIAL_HABITS,
  DAILY_REFLECTIONS,
  INITIAL_JOURNAL_ENTRIES,
  COGNITIVE_REFRAMES,
} from './data/mockData';
import { MediaItem, Course, Workshop, Habit, JournalEntry, DailyReflectionData } from './types';
import { soundscapeEngine } from './utils/soundscapes';
import { Sparkles, Heart, Compass, BookOpen, Volume2, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommendations' | 'search' | 'learning' | 'wellness'>('dashboard');

  // Media & Recommendations State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('lumina_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_bookmarks');
    return saved ? JSON.parse(saved) : ['f1', 'm1'];
  });

  const [watchedIds, setWatchedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_watched');
    return saved ? JSON.parse(saved) : ['f3'];
  });

  // Courses & Learning State
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lumina_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const saved = localStorage.getItem('lumina_workshops');
    return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
  });

  const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('lumina_notes');
    return saved ? JSON.parse(saved) : { c1: 'Ultradian rest blocks work wonders when paired with panoramic gaze.' };
  });

  // Habits & Wellness State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('lumina_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('lumina_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  const [currentReflection, setCurrentReflection] = useState<DailyReflectionData>(DAILY_REFLECTIONS[0]);

  // Modals & Drawers
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [globalSearchPreQuery, setGlobalSearchPreQuery] = useState('');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('lumina_media', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('lumina_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('lumina_watched', JSON.stringify(watchedIds));
  }, [watchedIds]);

  useEffect(() => {
    localStorage.setItem('lumina_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lumina_workshops', JSON.stringify(workshops));
  }, [workshops]);

  useEffect(() => {
    localStorage.setItem('lumina_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lumina_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('lumina_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Handlers
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleWatched = (id: string) => {
    setWatchedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleWorkshopRsvp = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isRsvped: !w.isRsvped } : w))
    );
  };

  const handleToggleHabit = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const alreadyDone = h.completedDates.includes(todayStr);
        const newDates = alreadyDone
          ? h.completedDates.filter((d) => d !== todayStr)
          : [...h.completedDates, todayStr];
        const newStreak = alreadyDone ? Math.max(0, h.streakDays - 1) : h.streakDays + 1;
        return {
          ...h,
          completedDates: newDates,
          streakDays: newStreak,
        };
      })
    );
  };

  const handleToggleLesson = (courseId: string, lessonId: string) => {
    setCourses((prevCourses) => {
      return prevCourses.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) => {
          return {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, completed: !l.completed } : l
            ),
          };
        });

        // Recalculate percent
        const allLessons = updatedModules.flatMap((m) => m.lessons);
        const completedCount = allLessons.filter((l) => l.completed).length;
        const progressPercent = Math.round((completedCount / allLessons.length) * 100);

        return {
          ...c,
          modules: updatedModules,
          progressPercent,
        };
      });
    });

    // Update active modal course instance if open
    setSelectedCourse((prev) => {
      if (!prev || prev.id !== courseId) return prev;
      const updatedModules = prev.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l)),
      }));
      const allLessons = updatedModules.flatMap((m) => m.lessons);
      const completedCount = allLessons.filter((l) => l.completed).length;
      return {
        ...prev,
        modules: updatedModules,
        progressPercent: Math.round((completedCount / allLessons.length) * 100),
      };
    });
  };

  const handleSaveNote = (courseId: string, note: string) => {
    setSavedNotes((prev) => ({
      ...prev,
      [courseId]: note,
    }));
  };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setJournalEntries([newEntry, ...journalEntries]);
  };

  const handleAddCustomRecommendations = (newRecs: MediaItem[]) => {
    setMediaItems((prev) => [...newRecs, ...prev]);
  };

  const handleSearchGlobal = (searchQuery: string) => {
    setGlobalSearchPreQuery(searchQuery);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Strict 3-Zone Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckIn={() => setIsCheckInModalOpen(true)}
        onToggleSoundscapes={() => setIsSoundscapeOpen(!isSoundscapeOpen)}
        isAudioPlaying={isAudioPlaying}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            reflection={currentReflection}
            mediaItems={mediaItems}
            courses={courses}
            workshops={workshops}
            habits={habits}
            onOpenMedia={(item) => setSelectedMedia(item)}
            onOpenCourse={(c) => setSelectedCourse(c)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenBreathwork={() => setActiveTab('wellness')}
            onOpenCheckIn={() => setIsCheckInModalOpen(true)}
            bookmarkedIds={bookmarkedIds}
            watchedIds={watchedIds}
            onToggleHabit={handleToggleHabit}
            onToggleWorkshopRsvp={handleToggleWorkshopRsvp}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            mediaItems={mediaItems}
            onOpenMedia={(item) => setSelectedMedia(item)}
            bookmarkedIds={bookmarkedIds}
            watchedIds={watchedIds}
            onToggleBookmark={handleToggleBookmark}
            onToggleWatched={handleToggleWatched}
            onSearchGlobal={handleSearchGlobal}
            onAddCustomRecommendations={handleAddCustomRecommendations}
          />
        )}

        {activeTab === 'search' && (
          <GlobalSearchView
            onOpenMedia={(item) => setSelectedMedia(item)}
            onOpenCourse={(c) => setSelectedCourse(c)}
            mediaItems={mediaItems}
            courses={courses}
            initialQuery={globalSearchPreQuery}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHubView
            courses={courses}
            workshops={workshops}
            onOpenCourse={(c) => setSelectedCourse(c)}
            onToggleWorkshopRsvp={handleToggleWorkshopRsvp}
          />
        )}

        {activeTab === 'wellness' && (
          <WellnessMindsetView
            reflection={currentReflection}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            journalEntries={journalEntries}
            onAddJournalEntry={handleAddJournalEntry}
            onUpdateReflection={(r) => setCurrentReflection(r)}
            cognitiveReframes={COGNITIVE_REFRAMES}
          />
        )}
      </main>

      {/* Floating Soundscape Drawer */}
      <SoundscapeDrawer
        isOpen={isSoundscapeOpen}
        onClose={() => setIsSoundscapeOpen(false)}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
      />

      {/* Media Detail Modal */}
      <MediaDetailModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        isBookmarked={selectedMedia ? bookmarkedIds.includes(selectedMedia.id) : false}
        isWatched={selectedMedia ? watchedIds.includes(selectedMedia.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToggleWatched={handleToggleWatched}
        onSearchGlobal={handleSearchGlobal}
      />

      {/* Course Detail & Lesson Player Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleLesson={handleToggleLesson}
        savedNotes={savedNotes}
        onSaveNote={handleSaveNote}
      />

      {/* Daily Check-In Modal */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FAF9F5] text-stone-900 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-stone-900">Daily Intention &amp; Presence</h3>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Today's Intention
                </span>
                <p className="text-sm font-serif italic text-stone-800">
                  "{currentReflection.affirmation}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  What single boundary or focus will protect your energy today?
                </label>
                <input
                  type="text"
                  placeholder="e.g., Closing laptop at 6:30 PM, taking a silent lunchtime walk..."
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-stone-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsCheckInModalOpen(false);
                    setActiveTab('wellness');
                  }}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
                >
                  Go to Full Wellness Studio &rarr;
                </button>
                <button
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Seal Intention
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clean Anti-Slop Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold italic text-base text-stone-900">Shilp</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>For your personal care</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-600">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-stone-900 transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('recommendations')} className="hover:text-stone-900 transition-colors">
              Recommendations
            </button>
            <button onClick={() => setActiveTab('search')} className="hover:text-stone-900 transition-colors">
              Global Search
            </button>
            <button onClick={() => setActiveTab('learning')} className="hover:text-stone-900 transition-colors">
              Learning Hub
            </button>
            <button onClick={() => setActiveTab('wellness')} className="hover:text-stone-900 transition-colors">
              Mindset &amp; Habits
            </button>
          </div>

          <div className="text-stone-400 font-mono">
            © {new Date().getFullYear()} Shilp. For your personal care.
          </div>
        </div>
      </footer>
    </div>
  );
}
