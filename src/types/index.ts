export type MediaType = 'music' | 'theatre' | 'web_series' | 'movie';

export type MoodType = 
  | 'Reflective & Introspective'
  | 'Euphoric & Energized'
  | 'Deep Focus & Flow'
  | 'Cathartic & Emotional'
  | 'Cozy & Comforting'
  | 'Curious & Mind-Expanding';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  creatorOrDirector: string;
  year: number;
  genre: string;
  moodTag: MoodType;
  description: string;
  whyItFits: string;
  streamingOrVenue: string;
  runtimeOrLength: string;
  wellnessImpact: string;
  rating: number; // e.g. 4.8
  featured?: boolean;
  themes: string[];
  gradientTheme: string; // for styled fallback artwork
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  summary: string;
  content: string;
  actionPrompt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  role: string;
  category: 'Mind & Resilience' | 'Creative Arts' | 'Philosophy & Purpose' | 'Somatic Vitality' | 'Communication';
  durationHours: number;
  level: 'Foundational' | 'Intermediate' | 'Deep Practice';
  description: string;
  keyOutcomes: string[];
  modules: CourseModule[];
  enrolled: boolean;
  progressPercent: number;
  gradientTheme: string;
}

export interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  attendeesCount: number;
  durationMinutes: number;
  description: string;
  isRsvped: boolean;
  category: string;
}

export interface Habit {
  id: string;
  title: string;
  subtitle: string;
  category: 'Mind' | 'Growth' | 'Body' | 'Culture' | 'Rest';
  targetFrequency: 'Daily';
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  streakDays: number;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  prompt: string;
  content: string;
  moodRating: number; // 1 to 5
  tags: string[];
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  query: string;
  summary: string;
  sources: SearchSource[];
  webQueries: string[];
  category: string;
  timestamp: string;
}

export interface DailyReflectionData {
  quote: string;
  author: string;
  reflectionPrompt: string;
  microAction: string;
  affirmation: string;
}
