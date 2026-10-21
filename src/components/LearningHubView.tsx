import React, { useState } from 'react';
import { Course, Workshop } from '../types';
import { BookOpen, Calendar, Award, CheckCircle2, Clock, Users, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface LearningHubViewProps {
  courses: Course[];
  workshops: Workshop[];
  onOpenCourse: (course: Course) => void;
  onToggleWorkshopRsvp: (id: string) => void;
}

export const LearningHubView: React.FC<LearningHubViewProps> = ({
  courses,
  workshops,
  onOpenCourse,
  onToggleWorkshopRsvp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Mind & Resilience',
    'Creative Arts',
    'Philosophy & Purpose',
    'Somatic Vitality',
  ];

  const filteredCourses = courses.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const totalLessonsCompleted = courses.reduce(
    (acc, c) => acc + c.modules.flatMap((m) => m.lessons).filter((l) => l.completed).length,
    0
  );

  const totalLessons = courses.reduce(
    (acc, c) => acc + c.modules.flatMap((m) => m.lessons).length,
    0
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <span>Holistic Growth &amp; Skill Mastery</span>
            <span aria-hidden="true">·</span>
            <span>Neuroscience, Philosophy &amp; Expression</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-sans">
            Learning &amp; Growth Hub
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Curated multidisciplinary masterclasses, interactive lesson modules, and live somatic workshops designed for intellectual depth and mental resilience.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-200 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Cumulative Progress</p>
            <p className="text-sm font-bold text-stone-900 font-mono tabular-nums">
              {totalLessonsCompleted} / {totalLessons} Lessons Done
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-400 font-medium shrink-0">Track:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors font-medium ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Showing <strong className="text-stone-800 font-mono tabular-nums">{filteredCourses.length}</strong> growth masterclasses</span>
          <span>Interactive syllabus with note-taking</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Course Header Banner */}
                <div className={`p-6 bg-gradient-to-r ${course.gradientTheme} text-white space-y-2`}>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-semibold">{course.category}</span>
                    <span className="font-mono tabular-nums">{course.durationHours} Hours</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-stone-200 font-serif italic">
                    Led by {course.instructor} · {course.role}
                  </p>
                </div>

                {/* Course Body Details */}
                <div className="p-6 space-y-5">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Key Outcomes */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Core Competencies You Will Build
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {course.keyOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-600 font-medium">Progress</span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-900 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {course.modules.length} Modules · {course.modules.flatMap((m) => m.lessons).length} Lessons
                </span>
                <button
                  onClick={() => onOpenCourse(course)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
                >
                  <span>{course.progressPercent > 0 ? 'Continue Lessons' : 'Start Course'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Interactive Workshops & Calendar */}
      <div className="p-8 bg-stone-100/70 rounded-3xl border border-stone-200/80 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Live Interactive Practice</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Upcoming Workshops &amp; Masterclasses
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Live interactive seminars with acoustic sound practitioners, playwrights, and neuroscientists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">{ws.category}</span>
                  <span className="font-mono tabular-nums">{ws.durationMinutes} min</span>
                </div>
                <h3 className="text-base font-bold text-stone-900">{ws.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{ws.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-900">{ws.date}</p>
                  <p className="text-[11px] text-stone-500 font-mono">{ws.time}</p>
                </div>

                <button
                  onClick={() => onToggleWorkshopRsvp(ws.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                    ws.isRsvped
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {ws.isRsvped ? '✓ Confirmed RSVP' : 'RSVP Free Seat'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Milestones & Badges */}
      <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Earned Competency Milestones
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          Milestones unlocked as you complete lesson reflections and practical exercises.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <h4 className="text-xs font-bold text-stone-900">Attention Architect</h4>
            <p className="text-[11px] text-stone-500 leading-tight">Mastered 90-min single-tab focus cycles</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <h4 className="text-xs font-bold text-stone-900">Dichotomy of Control</h4>
            <p className="text-[11px] text-stone-500 leading-tight">Applied Epictetus model to daily decisions</p>
          </div>

          <div className="p-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-300 text-center space-y-2 opacity-60">
            <div className="w-10 h-10 mx-auto rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm">
              🔒
            </div>
            <h4 className="text-xs font-bold text-stone-700">Polyvagal Navigator</h4>
            <p className="text-[11px] text-stone-500 leading-tight">Unlock in Somatic Intelligence track</p>
          </div>

          <div className="p-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-300 text-center space-y-2 opacity-60">
            <div className="w-10 h-10 mx-auto rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm">
              🔒
            </div>
            <h4 className="text-xs font-bold text-stone-700">Deep Listening Ear</h4>
            <p className="text-[11px] text-stone-500 leading-tight">Unlock in Creative Arts track</p>
          </div>
        </div>
      </div>
    </div>
  );
};
