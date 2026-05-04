import re

# Read the adjectives file
with open('sıfatlar.txt', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.strip().split('\n')
adjectives = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # Format: number. word – turkish – synonym – example sentence
    # Try different dash characters
    parts = None
    for dash in ['–', '-', '—', '−']:
        if dash in line:
            parts = line.split(dash)
            if len(parts) >= 4:
                break
    
    if parts and len(parts) >= 4:
        # Extract number and word from first part
        first_part = parts[0].strip()
        match = re.match(r'^(\d+)\.\s*(.+)$', first_part)
        if match:
            num = int(match.group(1))
            word = match.group(2).strip()
            turkish = parts[1].strip()
            synonym = parts[2].strip()
            example = parts[3].strip()
            
            # Remove trailing period from example if exists
            if example.endswith('.'):
                example = example[:-1].strip()
            
            adjectives.append({
                'id': num,
                'word': word,
                'turkish': turkish,
                'synonym': synonym,
                'example': example + '.'
            })

print(f'Parsed {len(adjectives)} adjectives')

# Generate adjectivesData.ts
with open('data/adjectivesData.ts', 'w', encoding='utf-8') as f:
    f.write('import { VocabCard } from "../types";\n\n')
    f.write('// Helper to save space\n')
    f.write('const c = (id: number, w: string, tr: string, syn: string[], ex: string): VocabCard => ({\n')
    f.write('  id, word: w, turkishTranslation: tr, synonyms: syn, exampleSentence: ex\n')
    f.write('});\n\n')
    f.write('export const STATIC_ADJECTIVES_LIST: VocabCard[] = [\n')
    
    for i, adj in enumerate(adjectives):
        # Escape quotes in strings
        word = adj['word'].replace('"', '\\"')
        turkish = adj['turkish'].replace('"', '\\"')
        synonym = adj['synonym'].replace('"', '\\"')
        example = adj['example'].replace('"', '\\"')
        
        f.write(f'  c({adj["id"]}, "{word}", "{turkish}", ["{synonym}"], "{example}")')
        if i < len(adjectives) - 1:
            f.write(',')
        f.write('\n')
    
    f.write('];\n')

print('Created adjectivesData.ts')

# Generate adjectivesQuizData.ts with 50 tests
with open('data/adjectivesQuizData.ts', 'w', encoding='utf-8') as f:
    f.write('import { VocabTest } from "../types";\n\n')
    f.write('export const ADJECTIVES_TESTS: VocabTest[] = [\n')
    
    import random
    
    for test_id in range(1, 51):
        f.write(f'  {{\n')
        f.write(f'    id: {test_id},\n')
        f.write(f'    title: "Sıfatlar Testi {test_id}",\n')
        f.write(f'    questions: [\n')
        
        # Select 10 random adjectives for this test
        selected = random.sample(adjectives, min(10, len(adjectives)))
        
        for q_idx, adj in enumerate(selected):
            # Create wrong options from other adjectives
            wrong_options = random.sample([a for a in adjectives if a['id'] != adj['id']], 3)
            wrong_translations = [w['turkish'].replace('"', '\\"') for w in wrong_options]
            
            correct_translation = adj['turkish'].replace('"', '\\"')
            all_options = wrong_translations + [correct_translation]
            random.shuffle(all_options)
            
            correct_index = all_options.index(correct_translation)
            word = adj['word'].replace('"', '\\"')
            
            f.write(f'      {{\n')
            f.write(f'        id: {q_idx + 1},\n')
            f.write(f'        text: "What is the meaning of \\"{word}\\"?",\n')
            f.write(f'        options: {all_options},\n')
            f.write(f'        correctOptionIndex: {correct_index}\n')
            f.write(f'      }}')
            if q_idx < len(selected) - 1:
                f.write(',')
            f.write('\n')
        
        f.write(f'    ]]\n')
        f.write(f'  }}')
        if test_id < 50:
            f.write(',')
        f.write('\n')
    
    f.write('];\n')

print('Created adjectivesQuizData.ts with 50 tests')
print('Done!')
