import React from 'react';
import { MediaItem, Course, Workshop, Habit, DailyReflectionData } from '../types';
import { Sparkles, ArrowRight, Play, BookOpen, Compass, Heart, Wind, CheckCircle2, Bookmark, Flame, Calendar, Award } from 'lucide-react';

interface DashboardViewProps {
  reflection: DailyReflectionData;
  mediaItems: MediaItem[];
  courses: Course[];
  workshops: Workshop[];
  habits: Habit[];
  onOpenMedia: (item: MediaItem) => void;
  onOpenCourse: (course: Course) => void;
  onNavigateTab: (tab: 'recommendations' | 'search' | 'learning' | 'wellness') => void;
  onOpenBreathwork: () => void;
  onOpenCheckIn: () => void;
  bookmarkedIds: string[];
  watchedIds: string[];
  onToggleHabit: (habitId: string) => void;
  onToggleWorkshopRsvp: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reflection,
  mediaItems,
  courses,
  workshops,
  habits,
  onOpenMedia,
  onOpenCourse,
  onNavigateTab,
  onOpenBreathwork,
  onOpenCheckIn,
  bookmarkedIds,
  watchedIds,
  onToggleHabit,
  onToggleWorkshopRsvp,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const completedHabitsToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const equilibriumScore = Math.round((completedHabitsToday / Math.max(1, habits.length)) * 100);

  const featuredMedia = mediaItems.filter((m) => m.featured).slice(0, 3);
  const activeCourse = courses.find((c) => c.enrolled) || courses[0];
  const upcomingWorkshop = workshops[0];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Welcoming Hero & Mindset Intention Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-stone-100 p-6 sm:p-10 border border-stone-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Daily Equilibrium &amp; Growth</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="font-mono text-stone-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans text-balance">
            {getGreeting()}, cultivate stillness amidst movement.
          </h1>

          <div className="p-4 sm:p-5 bg-stone-800/80 rounded-2xl border border-stone-700/60 backdrop-blur-sm space-y-2.5">
            <p className="text-base sm:text-lg font-serif italic text-stone-200 leading-relaxed">
              "{reflection.quote}"
            </p>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>— {reflection.author}</span>
              <span className="text-amber-200/90 font-medium">Daily Philosophical Anchor</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenBreathwork}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs tracking-wide transition-all shadow-sm hover:shadow"
            >
              <Wind className="w-4 h-4" />
              <span>Launch Somatic Breathwork</span>
            </button>

            <button
              onClick={onOpenCheckIn}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Log Daily Intention &amp; Mood</span>
            </button>

            <button
              onClick={() => onNavigateTab('search')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent hover:bg-stone-800/60 text-stone-300 text-xs font-medium transition-colors"
            >
              <Compass className="w-4 h-4 text-stone-400" />
              <span>Search Anything Worldwide</span>
            </button>
          </div>
        </div>

        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Four Balanced Vitality Metrics (Tabular Numbers & Anti-Slop Discipline) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Daily Equilibrium</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {equilibriumScore}%
            </span>
            <span className="text-xs text-stone-400 font-sans">
              ({completedHabitsToday}/{habits.length} habits)
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-snug">
            Measured across hydration, movement &amp; reflection.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Longest Habit Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              5
            </span>
            <span className="text-xs text-stone-400 font-sans">consecutive days</span>
          </div>
          <p className="text-xs text-stone-500 leading-snug">
            Morning stillness &amp; hydration unbroken.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Active Learning</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              65%
            </span>
            <span className="text-xs text-stone-400 font-sans">Neuroscience of Focus</span>
          </div>
          <p className="text-xs text-stone-500 leading-snug">
            Next: Ultradian rhythms &amp; NSDR protocols.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Curated Repertoire</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {bookmarkedIds.length + watchedIds.length}
            </span>
            <span className="text-xs text-stone-400 font-sans">works engaged</span>
          </div>
          <p className="text-xs text-stone-500 leading-snug">
            Theatre, ambient compositions &amp; films.
          </p>
        </div>
      </section>

      {/* 3. Curated Synergy: The Balanced Triad of the Day */}
      <section className="p-6 sm:p-8 bg-stone-100/70 rounded-3xl border border-stone-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              The Daily Harmonized Triad
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              A balanced formula pairing deep entertainment with cognitive learning and nervous system care.
            </p>
          </div>
          <span className="text-xs text-stone-500 font-medium self-start sm:self-auto">
            Curated for Friday Stillness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Triad 1: Entertainment Piece */}
          <div 
            onClick={() => onOpenMedia(mediaItems.find((m) => m.id === 'f1') || mediaItems[0])}
            className="p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-stone-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">1. Film Immersion</span>
                <span>2h 04m</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Perfect Days
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Wim Wenders' Cannes-winning masterwork on ritual, cassette tapes, and finding serene grace in humble daily tasks.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Mood: Reflective &amp; Introspective</span>
              <span className="text-stone-900 font-medium group-hover:translate-x-1 transition-transform">Explore &rarr;</span>
            </div>
          </div>

          {/* Triad 2: Learning Lesson */}
          <div 
            onClick={() => onOpenCourse(activeCourse)}
            className="p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-stone-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">2. Growth Lesson</span>
                <span>22 min study</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Ultradian Rhythms &amp; Cognitive Windows
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                How biological 90-minute waves dictate brain alertness, and how to stop burning willpower on energy troughs.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Instructor: Dr. Elena Vance</span>
              <span className="text-stone-900 font-medium group-hover:translate-x-1 transition-transform">Resume &rarr;</span>
            </div>
          </div>

          {/* Triad 3: Wellness Habit */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">3. Somatic Practice</span>
                <span>15 min ritual</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Panoramic Gaze Nature Walk
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Step outside without audio. Soften gaze to see the perimeter of your vision to downshift optic flow anxiety.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Habit Checklist</span>
              <button
                onClick={() => onToggleHabit('h3')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  habits.find((h) => h.id === 'h3')?.completedDates.includes(todayStr)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {habits.find((h) => h.id === 'h3')?.completedDates.includes(todayStr) ? 'Done Today ✓' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tailored Entertainment Spotlight (Music, Theatre, Series, Film) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Tailored Entertainment Repertoire
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Curated productions, compositions, and cinematic masterworks for mind nourishment.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1 transition-colors"
          >
            <span>View Full Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenMedia(item)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              {/* Artwork Container with Zero-Broken-Image gradient styling */}
              <div className={`h-40 bg-gradient-to-br ${item.gradientTheme} p-5 flex flex-col justify-between text-white relative`}>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className="capitalize font-medium">{item.type.replace('_', ' ')}</span>
                  <span className="font-mono tabular-nums">{item.runtimeOrLength}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:underline underline-offset-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-200 font-serif italic">
                    {item.creatorOrDirector} ({item.year})
                  </p>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-stone-800">{item.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.moodTag}</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="truncate max-w-[170px]">{item.streamingOrVenue}</span>
                  <span className="font-semibold text-stone-900 group-hover:translate-x-1 transition-transform">
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Holistic Learning & Upcoming Masterclass Split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-indigo-700">Holistic Learning Path</span>
              <span className="font-mono tabular-nums">{activeCourse.durationHours} Hours Total</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              {activeCourse.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeCourse.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-600">Course Completion</span>
              <span className="font-mono font-bold text-stone-900 tabular-nums">{activeCourse.progressPercent}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 rounded-full transition-all duration-300"
                style={{ width: `${activeCourse.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">Instructor: {activeCourse.instructor}</span>
            <button
              onClick={() => onOpenCourse(activeCourse)}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Continue Module
            </button>
          </div>
        </div>

        {/* Live Workshop Registration Card */}
        {upcomingWorkshop && (
          <div className="bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Upcoming Live Masterclass
                </span>
                <span className="font-mono text-stone-400">{upcomingWorkshop.durationMinutes} min session</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {upcomingWorkshop.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {upcomingWorkshop.description}
              </p>
            </div>

            <div className="p-3.5 bg-stone-800/80 rounded-xl border border-stone-700/60 text-xs text-stone-300 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{upcomingWorkshop.date}</p>
                <p className="text-stone-400 font-mono">{upcomingWorkshop.time}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-amber-300 tabular-nums">{upcomingWorkshop.attendeesCount} Registered</p>
                <p className="text-stone-400">Live Video &amp; Audio</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">Led by {upcomingWorkshop.instructor}</span>
              <button
                onClick={() => onToggleWorkshopRsvp(upcomingWorkshop.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  upcomingWorkshop.isRsvped
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs'
                }`}
              >
                {upcomingWorkshop.isRsvped ? '✓ RSVP Confirmed' : 'Reserve Free Seat'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
