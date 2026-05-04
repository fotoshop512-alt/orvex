const fs = require('fs');

// Read the adjectives file
const content = fs.readFileSync('sıfatlar.txt', 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

const adjectives = [];

lines.forEach((line, index) => {
    // Format: number. word – turkish – synonym – example sentence
    const match = line.match(/^\d+\.\s+(.+?)\s+–\s+(.+?)\s+–\s+(.+?)\s+–\s+(.+?)\.?\s*$/);

    if (match) {
        const [, word, turkish, synonym, example] = match;
        adjectives.push({
            id: index + 1,
            word: word.trim(),
            turkish: turkish.trim(),
            synonym: synonym.trim(),
            example: example.trim() + '.'
        });
    }
});

console.log(`Parsed ${adjectives.length} adjectives`);

// Generate adjectivesData.ts
let dataContent = `
import { VocabCard } from "../types";

// Helper to save space
const c = (id: number, w: string, tr: string, syn: string[], ex: string): VocabCard => ({
  id, word: w, turkishTranslation: tr, synonyms: syn, exampleSentence: ex
});

export const STATIC_ADJECTIVES_LIST: VocabCard[] = [
`;

adjectives.forEach((adj, idx) => {
    dataContent += `  c(${adj.id}, "${adj.word}", "${adj.turkish}", ["${adj.synonym}"], "${adj.example}")`;
    if (idx < adjectives.length - 1) dataContent += ',';
    dataContent += '\n';
});

dataContent += '];\n';

fs.writeFileSync('data/adjectivesData.ts', dataContent);
console.log('Created adjectivesData.ts');

// Generate adjectivesQuizData.ts with 50 tests, 10 questions each
let quizContent = `
import { VocabTest } from "../types";

export const ADJECTIVES_TESTS: VocabTest[] = [
`;

for (let testId = 1; testId <= 50; testId++) {
    quizContent += `  {\n    id: ${testId},\n    title: "Sıfatlar Testi ${testId}",\n    questions: [\n`;

    // Select 10 random adjectives for this test
    const shuffled = [...adjectives].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    selected.forEach((adj, qIdx) => {
        // Create wrong options from other adjectives
        const wrongOptions = shuffled
            .filter(a => a.id !== adj.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(a => a.turkish);

        const allOptions = [adj.turkish, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = allOptions.indexOf(adj.turkish);

        quizContent += `      {\n`;
        quizContent += `        id: ${qIdx + 1},\n`;
        quizContent += `        word: "${adj.word}",\n`;
        quizContent += `        options: ${JSON.stringify(allOptions)},\n`;
        quizContent += `        correctOptionIndex: ${correctIndex}\n`;
        quizContent += `      }`;
        if (qIdx < selected.length - 1) quizContent += ',';
        quizContent += '\n';
    });

    quizContent += `    ]\n  }`;
    if (testId < 50) quizContent += ',';
    quizContent += '\n';
}

quizContent += '];\n';

fs.writeFileSync('data/adjectivesQuizData.ts', quizContent);
console.log('Created adjectivesQuizData.ts with 50 tests');

console.log('Done! Created both files successfully.');
