import { VocabTest, Question } from "../types";
import { STATIC_ADJECTIVES_LIST } from "./adjectivesData";

const QUESTIONS_PER_TEST = 10;
const TOTAL_TESTS = 100; // Her bölümde 100 test olmalı
const WORDS_PER_CHUNK = 10;

const generateAdjectivesTests = (): VocabTest[] => {
  const tests: VocabTest[] = [];

  for (let i = 0; i < TOTAL_TESTS; i++) {
    const startIndex = i * WORDS_PER_CHUNK;
    const endIndex = startIndex + WORDS_PER_CHUNK;

    // Listeden ilgili aralığı al
    const chunk = STATIC_ADJECTIVES_LIST.slice(startIndex, endIndex);

    // Eğer hiç kelime kalmadıysa döngüyü bitir
    if (chunk.length < 4) break;

    const questions: Question[] = [];

    // Bu chunk içinden soruları oluştur
    const selectedWords = [...chunk].sort(() => 0.5 - Math.random());

    selectedWords.forEach((wordCard, qIdx) => {
      const correctTranslation = wordCard.turkishTranslation;

      // Get all unique translations except the correct one from the FULL list
      const otherTranslations = Array.from(new Set(
        STATIC_ADJECTIVES_LIST
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
      title: `Sıfat Testi ${i + 1} (${startIndex + 1}-${endIndex})`,
      questions: questions
    });
  }

  return tests;
};

export const ADJECTIVES_TESTS: VocabTest[] = generateAdjectivesTests();
