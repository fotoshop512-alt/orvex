
import { VocabTest, Question } from "../types";
import { STATIC_NOUNS_LIST } from "./nounsData";

const QUESTIONS_PER_TEST = 10;
const TOTAL_TESTS = 100; // Explicitly set to 100 as requested
const WORDS_PER_CHUNK = 10;

const generateNounsTests = (): VocabTest[] => {
  const tests: VocabTest[] = [];

  for (let i = 0; i < TOTAL_TESTS; i++) {
    const startIndex = i * WORDS_PER_CHUNK;
    const endIndex = startIndex + WORDS_PER_CHUNK;

    // Listeden ilgili aralığı al (Slice)
    const chunk = STATIC_NOUNS_LIST.slice(startIndex, endIndex);

    // Eğer hiç kelime kalmadıysa döngüyü bitir
    if (chunk.length < 4) break;

    const questions: Question[] = [];

    // Bu chunk içinden soruları oluştur
    const selectedWords = [...chunk].sort(() => 0.5 - Math.random());

    selectedWords.forEach((wordCard, qIdx) => {
      const correctTranslation = wordCard.turkishTranslation;

      // Get all unique translations except the correct one from the FULL list
      const otherTranslations = Array.from(new Set(
        STATIC_NOUNS_LIST
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
      title: `İsim Testi ${i + 1} (${startIndex + 1}-${endIndex})`,
      questions: questions
    });
  }

  return tests;
};

export const NOUNS_TESTS: VocabTest[] = generateNounsTests();
