import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VocabCard, ReadingPassage, Question } from "../types";
import { STATIC_VOCAB_LIST } from "../data/vocabData";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-2.5-flash';

// --- Schemas ---

const vocabSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      pronunciation: { type: Type.STRING },
      definition: { type: Type.STRING },
      synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
      exampleSentence: { type: Type.STRING },
      turkishTranslation: { type: Type.STRING },
    },
    required: ["word", "definition", "exampleSentence", "turkishTranslation"],
  },
};

const readingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    content: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctOptionIndex: { type: Type.INTEGER },
        },
        required: ["id", "text", "options", "correctOptionIndex"],
      },
    },
  },
  required: ["title", "content", "questions"],
};

const grammarQuizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      text: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      correctOptionIndex: { type: Type.INTEGER },
    },
    required: ["id", "text", "options", "correctOptionIndex"],
  },
};

// --- API Calls ---

export const generateVocabList = async (topic: string, level: string = 'C1'): Promise<VocabCard[]> => {
    // Return random cards from the static list for now, filtering roughly if possible, or just random
    // This replaces the AI generation to use the hardcoded list as requested
    const shuffled = [...STATIC_VOCAB_LIST].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
};

export const generateReadingPassage = async (topic: string): Promise<ReadingPassage | null> => {
  try {
    const prompt = `Write an academic reading passage (approx 250 words) suitable for YDS exam about "${topic}". Include 3 multiple choice comprehension questions. The questions should test inference and detail. Return structured JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: readingSchema,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ReadingPassage;
  } catch (error) {
    console.error("Reading generation error:", error);
    return null;
  }
};

export const generateGrammarQuiz = async (topic: string): Promise<Question[]> => {
  try {
    const prompt = `Create 5 difficult multiple choice grammar questions focusing on "${topic}". These should be YDS style (sentence completion or error finding). Return structured JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: grammarQuizSchema,
        temperature: 0.6,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Grammar quiz generation error:", error);
    return [];
  }
};

export const translateWord = async (word: string): Promise<string> => {
  // 1. Check static list first
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  const found = STATIC_VOCAB_LIST.find(v => v.word.toLowerCase() === cleanWord);
  if (found) {
    return found.turkishTranslation;
  }

  // 2. Fallback to AI
  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Translate the English word "${word}" to Turkish. Give ONLY the translation, no extra text.`,
    });
    return response.text || "Çeviri bulunamadı";
  } catch (error) {
    console.error("Translation error", error);
    return "Hata";
  }
};
