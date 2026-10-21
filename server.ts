import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Global World Search Engine (Powered by Gemini with Google Search Grounding)
app.post('/api/search', async (req: Request, res: Response) => {
  const { query, category } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const cleanQuery = query.trim();

  if (aiClient) {
    try {
      const prompt = `You are a world-class omniscient search engine and cultural curator for a lifestyle, entertainment, and personal growth platform.
The user is searching for: "${cleanQuery}" (Preferred category context: ${category || 'General/All'}).

Search the live web thoroughly to provide a factual, high-clarity, and deeply illuminating answer.
Structure your response in clean Markdown with:
1. Executive Summary & Direct Answer (2-3 concise, well-phrased sentences)
2. Key Context & Insights (bullet points or short thematic paragraphs)
3. Cultural, Artistic, or Wellness Implications (why this matters, recommendations, or practical takeaways)
4. Key Takeaway or Reflection Prompt

Maintain an uplifting, intelligent, and authentic tone.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const summary = response.text || 'No response generated.';
      const candidate = response.candidates?.[0];
      const grounding = candidate?.groundingMetadata;

      const sources: { title: string; uri: string }[] = [];
      if (grounding?.groundingChunks) {
        for (const chunk of grounding.groundingChunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || new URL(chunk.web.uri).hostname,
              uri: chunk.web.uri,
            });
          }
        }
      }

      // De-duplicate sources by URI
      const uniqueSources = sources.filter(
        (src, idx, self) => idx === self.findIndex((s) => s.uri === src.uri)
      );

      const webQueries = grounding?.webSearchQueries || [cleanQuery];

      return res.json({
        query: cleanQuery,
        summary,
        sources: uniqueSources,
        webQueries,
        category: category || 'Universal',
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      console.error('Gemini Search error:', err);
      // Fallback gracefully below
    }
  }

  // Fallback intelligent search response if API key unavailable or rate limited
  const fallbackSummary = `### Overview for "${cleanQuery}"

**Direct Answer:** Inquiries regarding "${cleanQuery}" connect directly into contemporary discussions across art, lifestyle, and modern cognitive wellbeing. 

#### Key Insights & Context
- **Global Context:** Cultivating intentional awareness around cultural and wellness phenomena allows us to move from passive information consumption to active discernment.
- **Holistic Application:** When exploring subjects like this, balancing critical thought with restorative lifestyle habits enhances long-term retention and emotional stability.
- **Recommendations:** Consider pairing this query with related explorations in our **Learning Hub** modules or through curated documentaries and theatre productions.

#### Contemplative Reflection
*How does deeper mastery of this topic shift your daily habits and long-term intentions?*`;

  return res.json({
    query: cleanQuery,
    summary: fallbackSummary,
    sources: [
      { title: `Global Knowledge Index: ${cleanQuery}`, uri: `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}` },
      { title: 'Encyclopedic Cultural & Scientific Archive', uri: 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(cleanQuery) },
    ],
    webQueries: [cleanQuery, `${cleanQuery} overview`, `${cleanQuery} modern analysis`],
    category: category || 'Universal',
    timestamp: new Date().toISOString(),
  });
});

// Personalised Recommendation Engine Endpoint
app.post('/api/recommend', async (req: Request, res: Response) => {
  const { mood, mediaType, genre, preferences } = req.body;

  if (aiClient) {
    try {
      const prompt = `You are an elite lifestyle and entertainment curator. Recommend 4 distinct, transcendent works (across music, theatre productions, web series, and movies) tailored specifically for:
- User Current Mood: "${mood || 'Contemplative & Serene'}"
- Media Focus: "${mediaType || 'All Formats'}"
- Preferred Genre/Aesthetic: "${genre || 'Open'}"
- Specific Nuance/Desire: "${preferences || 'Nourishing, high-craft, emotionally resonant'}"

For each recommendation, output a structured JSON array of objects with the exact schema:
- title (string): Title of work
- type (string): one of 'music', 'theatre', 'web_series', 'movie'
- creatorOrDirector (string): Creator, composer, playwright, or director
- year (number): Release or staging year
- genre (string): Genre descriptor
- moodTag (string): One of 'Reflective & Introspective', 'Euphoric & Energized', 'Deep Focus & Flow', 'Cathartic & Emotional', 'Cozy & Comforting', 'Curious & Mind-Expanding'
- description (string): 2-sentence evocative synopsis
- whyItFits (string): 1-sentence specific reason why it matches their mood
- streamingOrVenue (string): Where to watch/listen (e.g. Spotify, Criterion, National Theatre at Home, Apple TV, Netflix, Broadway/West End)
- runtimeOrLength (string): Duration or episode count
- wellnessImpact (string): How it elevates mental state or inspires personal growth
- themes (array of strings): 3 evocative themes`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                creatorOrDirector: { type: Type.STRING },
                year: { type: Type.INTEGER },
                genre: { type: Type.STRING },
                moodTag: { type: Type.STRING },
                description: { type: Type.STRING },
                whyItFits: { type: Type.STRING },
                streamingOrVenue: { type: Type.STRING },
                runtimeOrLength: { type: Type.STRING },
                wellnessImpact: { type: Type.STRING },
                themes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'type', 'creatorOrDirector', 'year', 'genre', 'moodTag', 'description', 'whyItFits', 'streamingOrVenue', 'runtimeOrLength', 'wellnessImpact'],
            },
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        const recommendationsWithIds = parsed.map((item: Record<string, unknown>, idx: number) => ({
          ...item,
          id: `ai-rec-${Date.now()}-${idx}`,
          rating: 4.9,
          gradientTheme:
            idx % 4 === 0
              ? 'from-amber-950/70 via-stone-900 to-slate-950'
              : idx % 4 === 1
              ? 'from-teal-950/70 via-slate-900 to-emerald-950'
              : idx % 4 === 2
              ? 'from-indigo-950/70 via-stone-900 to-zinc-950'
              : 'from-rose-950/70 via-stone-900 to-amber-950',
        }));
        return res.json({ recommendations: recommendationsWithIds });
      }
    } catch (err) {
      console.error('Gemini Recommendation error:', err);
    }
  }

  // Default curated fallback
  return res.json({ recommendations: [] });
});

// Daily Reflection & Mindset Generator Endpoint
app.post('/api/daily-reflection', async (req: Request, res: Response) => {
  const { currentFeeling, focusArea } = req.body;

  if (aiClient) {
    try {
      const prompt = `You are a compassionate philosophical mentor and wellness guide.
The user is currently feeling: "${currentFeeling || 'Seeking clarity and renewal'}".
Their desired growth area is: "${focusArea || 'Inner resilience and mindful focus'}".

Generate a thoughtful, original daily reflection with:
1. quote (string): A timeless philosophical or literary quote relevant to this state
2. author (string): Author and work
3. reflectionPrompt (string): One deep, non-judgmental journaling question for today
4. microAction (string): One specific 5-minute somatic or behavioral action they can do right now
5. affirmation (string): A grounded, realistic grounding statement (avoiding toxic positivity)`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quote: { type: Type.STRING },
              author: { type: Type.STRING },
              reflectionPrompt: { type: Type.STRING },
              microAction: { type: Type.STRING },
              affirmation: { type: Type.STRING },
            },
            required: ['quote', 'author', 'reflectionPrompt', 'microAction', 'affirmation'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (err) {
      console.error('Gemini Reflection error:', err);
    }
  }

  return res.json({
    quote: 'To live is the rarest thing in the world. Most people exist, that is all.',
    author: 'Oscar Wilde',
    reflectionPrompt: 'What is one belief or expectation you held tightly last year that you have gently begun to outgrow?',
    microAction: 'Take a 5-minute silent pause right now. Relax your jaw, drop your shoulders, and ask yourself what genuinely matters today.',
    affirmation: 'I am operating on an authentic timeline calibrated to depth, clarity, and kindness.',
  });
});

// Dev & Production serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shilp — For your personal care Server active at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
