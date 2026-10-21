import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import { X, CheckCircle2, Circle, BookOpen, Clock, Award, Save, Sparkles } from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onToggleLesson: (courseId: string, lessonId: string) => void;
  savedNotes: Record<string, string>;
  onSaveNote: (courseId: string, note: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onToggleLesson,
  savedNotes,
  onSaveNote,
}) => {
  if (!course) return null;

  // Flatten lessons
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');
  const [currentNote, setCurrentNote] = useState<string>(
    savedNotes[course.id] || ''
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  const handleSaveNote = () => {
    onSaveNote(course.id, currentNote);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#FAF9F5] text-stone-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[90vh] max-h-[820px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`relative bg-gradient-to-r ${course.gradientTheme} p-5 sm:p-6 text-white shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition-colors"
            aria-label="Close course viewer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-1">
            <span>{course.category}</span>
            <span aria-hidden="true">·</span>
            <span>{course.level}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{course.durationHours} Hours</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1 pr-10">
            {course.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 font-serif italic">
            Led by {course.instructor} — {course.role}
          </p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-emerald-300 tabular-nums">
              {course.progressPercent}% Completed
            </span>
          </div>
        </div>

        {/* 2-Column Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Syllabus & Module Tree (35%) */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-100/50 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-stone-200/80 bg-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Course Syllabus
              </span>
              <span className="text-xs text-stone-500 font-mono tabular-nums">
                {allLessons.filter((l) => l.completed).length}/{allLessons.length} Done
              </span>
            </div>

            <div className="p-3 space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-800 px-2 py-1">
                    {modIdx + 1}. {mod.title}
                  </h4>
                  <div className="space-y-0.5">
                    {mod.lessons.map((lesson) => {
                      const isSelected = lesson.id === activeLessonId;
                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-white shadow-xs text-stone-950 font-medium border border-stone-200/80'
                              : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
                          }`}
                          onClick={() => setActiveLessonId(lesson.id)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLesson(course.id, lesson.id);
                            }}
                            className="mt-0.5 text-stone-400 hover:text-stone-700 transition-colors"
                            title={lesson.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="truncate leading-tight">{lesson.title}</p>
                            <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                              {lesson.durationMinutes} min
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Active Lesson Workspace & Reflection Notes (65%) */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF9F5]">
            {/* View Switcher Tabs */}
            <div className="px-6 pt-4 pb-2 border-b border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeTab === 'content'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Lesson Material
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Personal Notes &amp; Journal
                </button>
              </div>

              {activeLesson && (
                <button
                  onClick={() => onToggleLesson(course.id, activeLesson.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeLesson.completed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {activeLesson.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {activeTab === 'content' && activeLesson && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <div className="text-xs text-stone-500 mb-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-mono tabular-nums">{activeLesson.durationMinutes} Minutes</span>
                      <span aria-hidden="true">·</span>
                      <span>Audio &amp; Text Guide</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                      {activeLesson.title}
                    </h3>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-stone-800 text-sm italic font-serif leading-relaxed">
                    "{activeLesson.summary}"
                  </div>

                  {/* Body Text */}
                  <div className="prose prose-stone text-stone-700 leading-relaxed text-sm sm:text-base space-y-4">
                    <p>{activeLesson.content}</p>
                  </div>

                  {/* Action Practice Prompt */}
                  <div className="p-5 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Actionable Practice Exercise</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {activeLesson.actionPrompt}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Personal Growth Notes</h3>
                    <p className="text-xs text-stone-500">
                      Capture key epiphanies, behavioral intentions, or questions to contemplate during your next offline walk.
                    </p>
                  </div>

                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Write your reflections, mental model takeaways, and practical applications here..."
                    rows={12}
                    className="w-full p-4 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-sans leading-relaxed text-stone-800 bg-white"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-mono tabular-nums">
                      {currentNote.length} characters
                    </span>
                    <button
                      onClick={handleSaveNote}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{noteSavedFeedback ? 'Saved to Vault!' : 'Save Notes'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
