
import { Question } from "../types";
import { STATIC_VOCAB_LIST } from "./vocabData";

export interface VocabTest {
  id: number;
  title: string;
  questions: Question[];
}

// 1000 kelimeyi 100 teste bölüyoruz (Her testte 10 kelimelik havuzdan 10 soru)
// Mantık: 1. Test (1-10. kelimeler), 2. Test (11-20. kelimeler)...
const QUESTIONS_PER_TEST = 10;
const TOTAL_TESTS = 100;
const WORDS_PER_CHUNK = 10;

const generateVocabTests = (): VocabTest[] => {
  const tests: VocabTest[] = [];

  for (let i = 0; i < TOTAL_TESTS; i++) {
    const startIndex = i * WORDS_PER_CHUNK;
    const endIndex = startIndex + WORDS_PER_CHUNK;

    // Listeden ilgili aralığı al (Slice)
    const chunk = STATIC_VOCAB_LIST.slice(startIndex, endIndex);

    // Eğer hiç kelime kalmadıysa döngüyü bitir
    if (chunk.length < 4) break;

    const questions: Question[] = [];

    // Bu chunk içinden soruları oluştur
    const selectedWords = [...chunk].sort(() => 0.5 - Math.random());

    selectedWords.forEach((wordCard, qIdx) => {
      // Get all Turkish translations from the whole list, excluding the current word's translation
      // to ensure uniqueness. Or better, get from this chunk but make sure they are unique strings.

      const correctTranslation = wordCard.turkishTranslation;

      // Get all unique translations except the correct one from the FULL list for better variety
      const otherTranslations = Array.from(new Set(
        STATIC_VOCAB_LIST
          .filter(c => c.turkishTranslation !== correctTranslation)
          .map(c => c.turkishTranslation)
      ));

      // Pick 3 random distractors
      const distractors = [...otherTranslations]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [...distractors, correctTranslation].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(correctTranslation);

      questions.push({
        id: qIdx,
        text: `What is the meaning of "${wordCard.word}"?`,
        options: options,
        correctOptionIndex: correctIndex
      });
    });

    tests.push({
      id: i + 1,
      title: `Kelime Testi ${i + 1} (${startIndex + 1}-${endIndex})`,
      questions: questions
    });
  }

  return tests;
};

export const VOCAB_TESTS: VocabTest[] = generateVocabTests();
