// Groq AI Service - Ücretsiz ve hızlı AI API
// API Key: https://console.groq.com adresinden ücretsiz alınabilir

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// API Key - .env.local dosyasından okunur (kaynak kodda ASLA hardcode edilmez)
const APP_API_KEY = process.env.GROQ_API_KEY || '';

// API key'i al
const getApiKey = (): string => {
  return APP_API_KEY;
};

export const setGroqApiKey = (key: string) => {
  // Artık kullanılmıyor - uygulama kendi key'ini kullanıyor
};

export const getGroqApiKey = (): string => {
  return APP_API_KEY;
};

export interface SentenceExample {
  english: string;
  turkish: string;
}

export interface AIResponse {
  word: string;
  meaning: string;
  examples: SentenceExample[];
  error?: string;
}

export const generateSentenceExamples = async (word: string): Promise<AIResponse> => {
  const apiKey = getApiKey();

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Sen bir İngilizce-Türkçe dil öğretmenisin. Kullanıcı sana bir İngilizce kelime verecek. Sen bu kelime için:
1. Kelimenin Türkçe anlamını ver
2. Bu kelimeyi içeren 2 KISA örnek İngilizce cümle yaz (her cümle en fazla 10-12 kelime olsun)
3. Her cümlenin Türkçe çevirisini yaz

Yanıtını SADECE şu JSON formatında ver, başka hiçbir şey yazma:
{
  "meaning": "kelimenin Türkçe anlamı",
  "examples": [
    {"english": "Kısa İngilizce cümle 1", "turkish": "Türkçe çeviri 1"},
    {"english": "Kısa İngilizce cümle 2", "turkish": "Türkçe çeviri 2"}
  ]
}

Cümleler kısa ve anlaşılır olsun.`
          },
          {
            role: 'user',
            content: word
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        return {
          word,
          meaning: '',
          examples: [],
          error: 'API anahtarı geçersiz. Lütfen doğru bir Groq API anahtarı girin.'
        };
      }
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI yanıt vermedi');
    }

    // JSON'u parse et
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Geçersiz yanıt formatı');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      word,
      meaning: parsed.meaning || '',
      examples: parsed.examples || []
    };

  } catch (error: any) {
    console.error('Groq AI Error:', error);
    return {
      word,
      meaning: '',
      examples: [],
      error: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
    };
  }
};

export const translateWordWithGroq = async (word: string): Promise<string | null> => {
  const apiKey = getApiKey();
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate the given English word to Turkish. Return ONLY the Turkish meaning (one or two words). Do not write anything else.`
          },
          {
            role: 'user',
            content: word
          }
        ],
        temperature: 0.3,
        max_tokens: 20
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Groq Translation Error:', error);
    return null;
  }
};

