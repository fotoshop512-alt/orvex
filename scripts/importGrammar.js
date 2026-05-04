
import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'C:\\Users\\Burak\\Desktop\\gramer.txt';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'grammarData.ts');

// Answer key for questions 1-50 (4-option questions)
const ANSWER_KEY_1_50 = {
    1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'A', 6: 'C', 7: 'A', 8: 'B', 9: 'B', 10: 'B',
    11: 'B', 12: 'A', 13: 'B', 14: 'C', 15: 'C', 16: 'B', 17: 'A', 18: 'A', 19: 'B', 20: 'C',
    21: 'B', 22: 'D', 23: 'B', 24: 'C', 25: 'B', 26: 'A', 27: 'B', 28: 'B', 29: 'C', 30: 'A',
    31: 'A', 32: 'C', 33: 'C', 34: 'B', 35: 'A', 36: 'A', 37: 'C', 38: 'B', 39: 'A', 40: 'B',
    41: 'B', 42: 'C', 43: 'B', 44: 'D', 45: 'A', 46: 'A', 47: 'B', 48: 'B', 49: 'B', 50: 'A'
};

try {
    console.log(`Reading from ${INPUT_FILE}...`);
    const content = fs.readFileSync(INPUT_FILE, 'utf-8');
    const lines = content.split('\n').map(l => l.trim());

    const questions = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Format 1: Question number on its own line (1-50)
        const format1Match = line.match(/^(\d+)\.$/);
        if (format1Match) {
            const id = parseInt(format1Match[1]);
            i++; // Move to next line

            // Skip empty lines
            while (i < lines.length && lines[i] === '') {
                i++;
            }

            // Collect question text until we hit an option
            let questionText = '';
            while (i < lines.length && !lines[i].match(/^[A-E]\)/)) {
                if (lines[i] !== '') {
                    questionText += (questionText ? ' ' : '') + lines[i];
                }
                i++;
            }

            // Collect options
            const options = [];
            while (i < lines.length && lines[i].match(/^[A-E]\)/)) {
                const optMatch = lines[i].match(/^[A-E]\)\s*(.+)$/);
                if (optMatch) {
                    options.push(optMatch[1].trim());
                }
                i++;
            }

            // Determine correct index
            let correctIndex = 0;
            const ans = ANSWER_KEY_1_50[id] || 'A';
            if (ans === 'B') correctIndex = 1;
            else if (ans === 'C') correctIndex = 2;
            else if (ans === 'D') correctIndex = 3;

            if (options.length >= 4) {
                questions.push({
                    id,
                    text: questionText,
                    options,
                    correctOptionIndex: correctIndex
                });
            }
            continue;
        }

        // Format 2: Question number and text on same line (101+)
        const format2Match = line.match(/^(\d+)\.\s+(.+)$/);
        if (format2Match) {
            const id = parseInt(format2Match[1]);
            let questionText = format2Match[2];
            i++;

            // Skip empty lines
            while (i < lines.length && lines[i] === '') {
                i++;
            }

            // Continue collecting question text if needed
            while (i < lines.length && !lines[i].match(/^[A-E]\)/) && !lines[i].match(/^Cevap:/)) {
                if (lines[i] !== '' && !lines[i].match(/^\d+\./)) {
                    questionText += ' ' + lines[i];
                }
                i++;
            }

            // Collect options
            const options = [];
            while (i < lines.length && lines[i].match(/^[A-E]\)/)) {
                const optMatch = lines[i].match(/^[A-E]\)\s*(.+)$/);
                if (optMatch) {
                    options.push(optMatch[1].trim());
                }
                i++;
            }

            // Look for answer
            let answer = 'A';
            while (i < lines.length && lines[i] === '') {
                i++;
            }
            if (i < lines.length && lines[i].match(/^Cevap:/)) {
                const ansMatch = lines[i].match(/^Cevap:\s*([A-E])$/);
                if (ansMatch) {
                    answer = ansMatch[1];
                }
                i++;
            }

            // Determine correct index
            let correctIndex = 0;
            if (answer === 'B') correctIndex = 1;
            else if (answer === 'C') correctIndex = 2;
            else if (answer === 'D') correctIndex = 3;
            else if (answer === 'E') correctIndex = 4;

            if (options.length >= 4) {
                questions.push({
                    id,
                    text: questionText,
                    options,
                    correctOptionIndex: correctIndex
                });
            }
            continue;
        }

        i++;
    }

    console.log(`Total parsed: ${questions.length} questions.`);

    // Remove duplicates based on question text
    const uniqueQuestions = [];
    const seenTexts = new Set();

    for (const q of questions) {
        const normalizedText = q.text.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!seenTexts.has(normalizedText)) {
            seenTexts.add(normalizedText);
            uniqueQuestions.push(q);
        } else {
            console.log(`Duplicate found and removed: Question ${q.id}`);
        }
    }

    console.log(`After removing duplicates: ${uniqueQuestions.length} unique questions.`);

    if (uniqueQuestions.length === 0) {
        console.error("No questions parsed!");
        process.exit(1);
    }

    // Sort by ID
    uniqueQuestions.sort((a, b) => a.id - b.id);

    // Distribute into 50 tests
    const tests = [];
    const questionsPerTest = 10;

    // Shuffle function
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Create a pool of questions by repeating if needed
    let questionPool = [...uniqueQuestions];

    // If we have fewer than 500 questions, repeat them in a shuffled manner
    while (questionPool.length < 500) {
        questionPool = [...questionPool, ...shuffle(uniqueQuestions)];
    }

    // Take exactly 500 questions
    questionPool = questionPool.slice(0, 500);

    for (let i = 0; i < 50; i++) {
        const start = i * questionsPerTest;
        const end = start + questionsPerTest;
        const testQuestions = questionPool.slice(start, end).map((q, idx) => ({
            ...q,
            id: idx + 1 // Reset ID to 1-10 for each test
        }));

        tests.push({
            id: i + 1,
            title: `Grammar Challenge ${i + 1}`,
            questions: testQuestions
        });
    }

    // Generate TypeScript Content
    const tsContent = `
import { GrammarTest } from "../types";

export const GRAMMAR_TESTS: GrammarTest[] = ${JSON.stringify(tests, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, tsContent);
    console.log(`Successfully wrote ${tests.length} tests with ${questionPool.length} total questions to ${OUTPUT_FILE}`);

} catch (err) {
    console.error("Error:", err);
}
