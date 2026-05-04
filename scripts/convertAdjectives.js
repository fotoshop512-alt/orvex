
const fs = require('fs');
const path = require('path');

// Dosya yollarını kesinleştirelim
const inputFile = path.resolve('sıfatlar.txt');
const outputFile = path.resolve('data/adjectiveData.ts');

console.log(`Reading from: ${inputFile}`);
console.log(`Writing to: ${outputFile}`);

try {
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file not found at ${inputFile}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = fileContent.split('\n');

    let outputContent = `import { VocabCard } from "../types";

// Helper to save space
const c = (id: number, w: string, tr: string, syn: string[], ex: string): VocabCard => ({
  id, word: w, turkishTranslation: tr, synonyms: syn, exampleSentence: ex
});

export const ADJECTIVE_LIST: VocabCard[] = [
`;

    let idCounter = 1;

    lines.forEach((line, index) => {
        if (!line.trim()) return;

        // Format: 1. accurate – doğru, hatasız – precise – The measurements were accurate and reliable.
        let cleanLine = line.replace(/^\d+\.\s*/, '');

        // Farklı tire karakterlerini standartlaştır
        cleanLine = cleanLine.replace(/–/g, '-').replace(/—/g, '-');

        const parts = cleanLine.split(/\s+-\s+/);

        if (parts.length >= 3) {
            const word = parts[0].trim();
            const translation = parts[1].trim();
            let synonym = "";
            let sentence = "";

            if (parts.length >= 4) {
                synonym = parts[2].trim();
                sentence = parts.slice(3).join(' - ').trim();
            } else if (parts.length === 3) {
                synonym = parts[2].trim();
            }

            const safeTranslation = translation.replace(/"/g, '\\"');
            const safeSentence = sentence.replace(/"/g, '\\"');
            const safeSynonym = synonym.replace(/"/g, '\\"');

            outputContent += `  c(${idCounter}, "${word}", "${safeTranslation}", ["${safeSynonym}"], "${safeSentence}"),\n`;
            idCounter++;
        } else {
            console.log(`Skipping line ${index + 1}: Format mismatch -> ${line}`);
        }
    });

    outputContent += `];
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Successfully created ${outputFile} with ${idCounter - 1} entries.`);

} catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
}
