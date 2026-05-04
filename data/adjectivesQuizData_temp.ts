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
      // Şıklar oluştur: Test içindeki diğer 9 kelimenin anlamlarından 3 tanesini yanlış şık olarak kullan
      const otherWordsInTest = selectedWords.filter(c => c.id !== wordCard.id);
      const distractors = otherWordsInTest.sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.turkishTranslation);

      const options = [...distractors, wordCard.turkishTranslation].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(wordCard.turkishTranslation);

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
