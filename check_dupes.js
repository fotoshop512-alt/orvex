
import { STATIC_VOCAB_LIST } from './data/vocabData';
import { STATIC_NOUNS_LIST } from './data/nounsData';
import { STATIC_ADJECTIVES_LIST } from './data/adjectivesData';

function checkDuplicates(list, name) {
    const seen = new Set();
    const dups = [];
    list.forEach(item => {
        if (seen.has(item.word.toLowerCase())) {
            dups.push(item.word);
        }
        seen.add(item.word.toLowerCase());
    });
    if (dups.length > 0) {
        console.log(`${name} has duplicates:`, Array.from(new Set(dups)));
    } else {
        console.log(`${name} has no duplicates.`);
    }
}

// Since these are TS files, I'll just look at them or run a simple node check if I can.
// But I can't easily run TS from here without setup.
// I'll just use a python script to parse the files and check.
