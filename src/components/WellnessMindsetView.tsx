import React, { useState, useEffect, useRef } from 'react';
import { DailyReflectionData, Habit, JournalEntry } from '../types';
import { Wind, Heart, Sparkles, Flame, CheckCircle2, Circle, Plus, Trash2, Send, RefreshCw, Smile, Award } from 'lucide-react';
import { soundscapeEngine } from '../utils/soundscapes';

interface WellnessMindsetViewProps {
  reflection: DailyReflectionData;
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  journalEntries: JournalEntry[];
  onAddJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onUpdateReflection: (data: DailyReflectionData) => void;
  cognitiveReframes: { trigger: string; reframe: string; focusPillar: string }[];
  isBreathworkActiveDirectly?: boolean;
}

export const WellnessMindsetView: React.FC<WellnessMindsetViewProps> = ({
  reflection,
  habits,
  onToggleHabit,
  journalEntries,
  onAddJournalEntry,
  onUpdateReflection,
  cognitiveReframes,
  isBreathworkActiveDirectly = false,
}) => {
  // Breathwork State
  const [breathMode, setBreathMode] = useState<'box' | 'relax' | 'resonance'>('box');
  const [isBreathing, setIsBreathing] = useState(isBreathworkActiveDirectly);
  const [currentPhase, setCurrentPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldPost'>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [cycleCount, setCycleCount] = useState(1);
  const [targetCycles, setTargetCycles] = useState(4);

  // Journal State
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Mindfulness']);
  const [isJournalSaved, setIsJournalSaved] = useState(false);

  // AI Prompt Partner
  const [userStateInput, setUserStateInput] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptDrawerOpen, setPromptDrawerOpen] = useState(false);

  // Micro-Victories Vault
  const [microWins, setMicroWins] = useState<string[]>([
    'Chose a 15-minute nature walk over 15 minutes of social doomscrolling',
    'Listened to an entire classical suite without checking phone once',
    'Maintained boundary by declining a non-essential evening meeting',
  ]);
  const [newWinInput, setNewWinInput] = useState('');

  // Breathing timer configuration
  const phaseDurations = {
    box: { Inhale: 4, Hold: 4, Exhale: 4, HoldPost: 4 },
    relax: { Inhale: 4, Hold: 7, Exhale: 8, HoldPost: 0 },
    resonance: { Inhale: 5.5, Hold: 0, Exhale: 5.5, HoldPost: 0 },
  };

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isBreathing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const modeConfig = phaseDurations[breathMode];

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase Transition
        soundscapeEngine.playChime(currentPhase === 'Inhale' ? 528 : 432);

        if (breathMode === 'box') {
          if (currentPhase === 'Inhale') {
            setCurrentPhase('Hold');
            return modeConfig.Hold;
          } else if (currentPhase === 'Hold') {
            setCurrentPhase('Exhale');
            return modeConfig.Exhale;
          } else if (currentPhase === 'Exhale') {
            setCurrentPhase('HoldPost');
            return modeConfig.HoldPost;
          } else {
            setCurrentPhase('Inhale');
            setCycleCount((c) => (c >= targetCycles ? 1 : c + 1));
            return modeConfig.Inhale;
          }
        } else if (breathMode === 'relax') {
          if (currentPhase === 'Inhale') {
            setCurrentPhase('Hold');
            return modeConfig.Hold;
          } else if (currentPhase === 'Hold') {
            setCurrentPhase('Exhale');
            return modeConfig.Exhale;
          } else {
            setCurrentPhase('Inhale');
            setCycleCount((c) => (c >= targetCycles ? 1 : c + 1));
            return modeConfig.Inhale;
          }
        } else {
          // resonance (coherent 5.5s)
          if (currentPhase === 'Inhale') {
            setCurrentPhase('Exhale');
            return modeConfig.Exhale;
          } else {
            setCurrentPhase('Inhale');
            setCycleCount((c) => (c >= targetCycles ? 1 : c + 1));
            return modeConfig.Inhale;
          }
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathing, breathMode, currentPhase, targetCycles]);

  const toggleBreathwork = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setCurrentPhase('Inhale');
      setSecondsRemaining(phaseDurations[breathMode].Inhale);
    } else {
      setIsBreathing(true);
      setCurrentPhase('Inhale');
      setSecondsRemaining(phaseDurations[breathMode].Inhale);
      soundscapeEngine.playChime(528);
    }
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    onAddJournalEntry({
      date: new Date().toISOString().split('T')[0],
      prompt: reflection.reflectionPrompt,
      content: journalText.trim(),
      moodRating: selectedMood,
      tags: selectedTags,
    });

    setJournalText('');
    setIsJournalSaved(true);
    setTimeout(() => setIsJournalSaved(false), 3000);
  };

  const handleGenerateCustomReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userStateInput.trim()) return;

    setIsGeneratingPrompt(true);
    try {
      const res = await fetch('/api/daily-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentFeeling: userStateInput,
          focusArea: 'Personal peace, emotional agility and clarity',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdateReflection(data);
        setUserStateInput('');
        setPromptDrawerOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleAddWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinInput.trim()) return;
    setMicroWins([newWinInput.trim(), ...microWins]);
    setNewWinInput('');
  };

  // Helper dates for habit tracker (last 7 days)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <span>Mindset Architecture &amp; Somatic Care</span>
            <span aria-hidden="true">·</span>
            <span>Autonomic Nervous System &amp; Habits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-sans">
            Wellness &amp; Mindset
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Clinically grounded breathwork, non-judgmental reflective journaling, daily habit consistency, and cognitive reframing tools.
          </p>
        </div>

        <button
          onClick={() => setPromptDrawerOpen(!promptDrawerOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-sm self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{promptDrawerOpen ? 'Close Reflection Partner' : 'Personalize Reflection with AI'}</span>
        </button>
      </div>

      {/* AI Reflection Customizer Drawer */}
      {promptDrawerOpen && (
        <div className="p-6 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">AI Mindset &amp; Contemplation Partner</h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">Gemini 3.8 Flash</span>
          </div>
          <p className="text-xs text-stone-300">
            Tell us what is on your mind right now (e.g., anxiety about an upcoming presentation, creative fatigue, grief, or seeking clarity).
          </p>

          <form onSubmit={handleGenerateCustomReflection} className="space-y-3">
            <input
              type="text"
              value={userStateInput}
              onChange={(e) => setUserStateInput(e.target.value)}
              placeholder="e.g. Feeling overwhelmed by too many conflicting demands and struggling to prioritize..."
              className="w-full p-3.5 rounded-xl bg-stone-800 border border-stone-700 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isGeneratingPrompt || !userStateInput.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs tracking-wide transition-all disabled:opacity-50"
              >
                {isGeneratingPrompt ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Tailored Reflection...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Philosophical Anchor</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. Interactive Somatic Breathwork Studio */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-600" />
              <span>Somatic Nervous System Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Interactive Breathwork Pacer
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Downshift adrenaline, activate parasympathetic vagal tone, and stabilize heart rate variability.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs shrink-0">
            <button
              onClick={() => {
                setBreathMode('box');
                setIsBreathing(false);
                setCurrentPhase('Inhale');
                setSecondsRemaining(4);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                breathMode === 'box' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Box 4-4-4-4
            </button>
            <button
              onClick={() => {
                setBreathMode('relax');
                setIsBreathing(false);
                setCurrentPhase('Inhale');
                setSecondsRemaining(4);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                breathMode === 'relax' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Relaxing 4-7-8
            </button>
            <button
              onClick={() => {
                setBreathMode('resonance');
                setIsBreathing(false);
                setCurrentPhase('Inhale');
                setSecondsRemaining(5.5);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                breathMode === 'resonance' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Coherence 5.5s
            </button>
          </div>
        </div>

        {/* Visual Breathing Ring */}
        <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-6">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Animated Pacing Ring */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ease-in-out ${
                isBreathing
                  ? currentPhase === 'Inhale'
                    ? 'scale-110 border-emerald-400 bg-emerald-50/50'
                    : currentPhase === 'Exhale'
                    ? 'scale-85 border-amber-400 bg-amber-50/40'
                    : 'scale-100 border-indigo-400 bg-indigo-50/40'
                  : 'scale-95 border-stone-200 bg-stone-50'
              }`}
            />

            {/* Inner Content */}
            <div className="relative z-10 text-center space-y-1">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
                {isBreathing ? currentPhase : 'Ready'}
              </span>
              <p className="text-5xl sm:text-6xl font-bold font-mono tabular-nums text-stone-900">
                {isBreathing ? secondsRemaining : phaseDurations[breathMode].Inhale}
              </p>
              <span className="text-xs text-stone-500 block">
                {currentPhase === 'Inhale'
                  ? 'Inhale through nose'
                  : currentPhase === 'Hold' || currentPhase === 'HoldPost'
                  ? 'Soft pause in throat'
                  : 'Slow exhale through mouth'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleBreathwork}
              className={`px-8 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-md ${
                isBreathing
                  ? 'bg-stone-900 hover:bg-stone-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isBreathing ? 'Pause Session' : 'Begin Breathing Session'}
            </button>

            {isBreathing && (
              <span className="text-xs font-mono text-stone-500 tabular-nums">
                Cycle {cycleCount} of {targetCycles}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. Daily Reflection & Journaling Studio */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Today's Reflection Anchor */}
        <div className="p-6 sm:p-8 bg-stone-100/70 rounded-3xl border border-stone-200/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Contemplation Prompt of the Day</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
              "{reflection.reflectionPrompt}"
            </h3>

            <div className="p-4 bg-white rounded-2xl border border-stone-200/80 space-y-2">
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                5-Minute Somatic Micro-Action
              </p>
              <p className="text-xs text-stone-700 leading-relaxed">
                {reflection.microAction}
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Grounding Affirmation
              </p>
              <p className="text-xs text-stone-800 italic font-serif leading-relaxed">
                "{reflection.affirmation}"
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Anchor inspired by {reflection.author}.
          </p>
        </div>

        {/* Right: Journal Entry Form */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">Reflective Journal Entry</h3>
            <span className="text-xs text-stone-400 font-mono">Encrypted Local Storage</span>
          </div>

          <form onSubmit={handleSaveJournal} className="space-y-4">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What arises as you sit with this prompt? Write without editing or self-censorship..."
              rows={6}
              className="w-full p-4 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-sans leading-relaxed text-stone-800 bg-stone-50/50"
            />

            {/* Mood rating selector */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-stone-500 font-medium">State of Mind:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedMood(rating)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      selectedMood === rating
                        ? 'bg-stone-900 text-amber-200 shadow-xs scale-105'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 font-medium">
                {isJournalSaved ? '✓ Reflection archived successfully!' : ''}
              </span>
              <button
                type="submit"
                disabled={!journalText.trim()}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all disabled:opacity-50"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Daily Habit & Rituals Matrix */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Consistency &amp; Rituals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Daily Wellness &amp; Growth Habits
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Click today's column to check in
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {habits.map((habit) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isCompletedToday = habit.completedDates.includes(todayStr);

            return (
              <div
                key={habit.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-800">{habit.title}</span>
                    <span className="text-[11px] text-stone-400">·</span>
                    <span className="text-[11px] text-stone-500">{habit.category}</span>
                  </div>
                  <p className="text-xs text-stone-500">{habit.subtitle}</p>
                </div>

                {/* 7-Day Consistency Matrix */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {past7Days.map((dateStr) => {
                      const isDone = habit.completedDates.includes(dateStr);
                      const isToday = dateStr === todayStr;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => {
                            if (isToday) onToggleHabit(habit.id);
                          }}
                          className={`w-7 h-7 rounded-lg text-[10px] font-mono flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white font-bold'
                              : isToday
                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300'
                              : 'bg-stone-100 text-stone-400 opacity-60'
                          }`}
                          title={`${dateStr} ${isDone ? 'Completed' : 'Missed'}`}
                        >
                          {isDone ? '✓' : isToday ? '•' : '—'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Streak */}
                  <div className="text-right shrink-0 w-20">
                    <span className="text-sm font-bold font-mono tabular-nums text-stone-900 block">
                      {habit.streakDays}d
                    </span>
                    <span className="text-[10px] text-stone-400">Streak</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Confidence & Resilience Vault (Reframes & Micro-Wins) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cognitive Reframes */}
        <div className="p-6 sm:p-8 bg-stone-100/70 rounded-3xl border border-stone-200/80 space-y-5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <h3 className="text-lg font-bold text-stone-900">Cognitive Reframe Vault</h3>
          </div>
          <p className="text-xs text-stone-500">
            Psychological grounding tools to neutralize irrational anxieties and impostor dread.
          </p>

          <div className="space-y-3.5">
            {cognitiveReframes.map((cr, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-rose-700 font-semibold">
                  <span>When feeling: "{cr.trigger}"</span>
                  <span className="text-stone-400 font-normal">{cr.focusPillar}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {cr.reframe}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Micro-Wins Victory Log */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-lg font-bold text-stone-900">Personal Micro-Victory Log</h3>
            </div>
            <p className="text-xs text-stone-500">
              Confidence is built by keeping small promises to yourself. Record today’s quiet victories.
            </p>

            <form onSubmit={handleAddWin} className="flex gap-2">
              <input
                type="text"
                value={newWinInput}
                onChange={(e) => setNewWinInput(e.target.value)}
                placeholder="Log a small win (e.g. read 10 pages, avoided reactive email)..."
                className="flex-1 p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                disabled={!newWinInput.trim()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Log Win
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {microWins.map((win, i) => (
                <div
                  key={i}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-start gap-2.5"
                >
                  <span className="text-amber-600 font-bold mt-0.5">★</span>
                  <span className="flex-1">{win}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 pt-4">
            Micro-wins rewire dopamine pathways towards intrinsic self-esteem.
          </p>
        </div>
      </section>
    </div>
  );
};
