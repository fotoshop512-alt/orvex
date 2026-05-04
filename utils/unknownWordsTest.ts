// Unknown Words Test Helper Functions
import { VocabCard } from '../types';

export const generateUnknownWordsTestQuestions = (
    unknownWordIds: number[],
    wordList: VocabCard[]
) => {
    if (unknownWordIds.length < 4) {
        return null;
    }

    const unknownWords = unknownWordIds
        .map(id => wordList.find(w => w.id === id))
        .filter(w => w !== undefined) as VocabCard[];

    const shuffled = [...unknownWords].sort(() => 0.5 - Math.random());
    const testWords = shuffled.slice(0, Math.min(10, shuffled.length));

    const questions = testWords.map(word => {
        const otherWords = wordList.filter(w => w.id !== word.id);
        const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
        const distractors = shuffledOthers.slice(0, 3).map(w => w.word);
        const options = [word.word, ...distractors].sort(() => 0.5 - Math.random());

        // Create sentence with blank
        const sentence = word.exampleSentence.replace(
            new RegExp(`\\b${word.word}\\b`, 'i'),
            '______'
        );

        return {
            word: word.word,
            correctAnswer: word.word,
            options,
            sentence,
            turkishMeaning: word.turkishTranslation
        };
    });

    return questions;
};
