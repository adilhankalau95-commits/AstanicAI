import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint 1: RAG Augmentation with Gemini 3.8 Flash
app.post('/api/rag/augment', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.json({ fallback: true, reason: 'Deterministic Local RAG Active' });
    }

    const { query, scenario, durationMinutes, language, candidates } = req.body;

    const prompt = `Ты — "Астаник", дружелюбный ИИ-гид по городу Астана (Smart City Assistant).
Пользователь спрашивает: "${query || scenario}"
Доступное время прогулки: ${durationMinutes} минут.
Язык ответа: ${language === 'kz' ? 'Казахский' : language === 'en' ? 'Английский' : 'Русский'}.

Вот топ найденных мест из базы POI Астаны (Retrieval):
${JSON.stringify(candidates, null, 2)}

Сгенерируй:
1. Короткое живое приветствие от персонажа Астаника (1-2 предложения, до 160 символов) для Speech Bubble.
2. Для каждого места (по его id):
   - whyVisit: почему именно сюда стоит пойти под этот запрос (1-2 предложения).
   - actionPlan: конкретный план действий с таймингом по минутам в рамках прогулки (например: "25 мин на осмотр экспозиции + 15 мин на кофе").
   - aiIdea: креативная идея или микро-квест от ИИ-агента внутри этой локации.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mascotSpeech: { type: Type.STRING },
            enrichments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  whyVisit: { type: Type.STRING },
                  actionPlan: { type: Type.STRING },
                  aiIdea: { type: Type.STRING },
                },
                required: ['id', 'whyVisit', 'actionPlan', 'aiIdea'],
              },
            },
          },
          required: ['mascotSpeech', 'enrichments'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.json({ fallback: true });
    }
    const parsed = JSON.parse(text.trim());
    return res.json({ fallback: false, data: parsed });
  } catch (err) {
    // Gracefully fallback to deterministic engine on client if API key is missing or quota reached
    return res.json({ fallback: true, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// Endpoint 2: AR Vision Recognition with Gemini 3.8 Flash
app.post('/api/vision/analyze', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.json({ fallback: true });
    }

    const { imageBase64, nearestPoi, userPreferences, language } = req.body;
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    if (imageBase64 && imageBase64.includes('base64,')) {
      const base64Data = imageBase64.split('base64,')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    }

    parts.push({
      text: `Ты — голосовой AR-гид Астаник в Астане.
Ближайший объект по GPS: ${nearestPoi?.name || 'Центр Астаны'} (${nearestPoi?.category || 'Достопримечательность'}).
Факт из базы: ${nearestPoi?.poiFacts || ''}.
Предпочтения пользователя: ${userPreferences || 'прогулка и кофе'}.
Язык: ${language || 'ru'}.
Расскажи в 3 коротких предложениях для озвучки голосом:
1) Что перед пользователем.
2) 1 впечатляющий факт из базы.
3) Куда повернуть дальше (в 150-300 метрах).`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
    });

    return res.json({
      fallback: false,
      speechText: response.text || '',
    });
  } catch (err) {
    return res.json({ fallback: true, error: err instanceof Error ? err.message : 'Vision fallback' });
  }
});

async function startServer() {
  const PORT = 3000;
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Astanik AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
