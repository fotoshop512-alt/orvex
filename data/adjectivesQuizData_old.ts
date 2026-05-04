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
        text: "What is the meaning of \"objective\"?",
        options: ['objektif', 'geçerli', 'çağdaş', 'kısa'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"existing\"?",
        options: ['mevcut', 'yoğun', 'olağanüstü', 'işlevsel'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"primary\"?",
        options: ['kapsamlı', 'birincil', 'etkili', 'yetenekli'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"valid\"?",
        options: ['geçerli', 'orta', 'isteğe bağlı', 'sosyal'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"clear\"?",
        options: ['geçici', 'tek tip', 'muhtemel', 'net'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"moderate\"?",
        options: ['anormal', 'sınırlı', 'ılımlı', 'yapay'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 2,
    title: "Sıfatlar Testi 2",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"classical\"?",
        options: ['yaygın', 'anahtar', 'objektif', 'klasik'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"open\"?",
        options: ['bariz', 'ön', 'ilginç', 'açık'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"multiple\"?",
        options: ['çoklu', 'görünür', 'tipik', 'çeşitli'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"main\"?",
        options: ['ana', 'teknik', 'yenilikçi', 'ana'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"ongoing\"?",
        options: ['devam eden', 'iç', 'çok önemli', 'fiziksel'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"routine\"?",
        options: ['uygulanabilir', 'geniş', 'ana', 'rutin'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"zero\"?",
        options: ['sıfır', 'başlangıç', 'belirli', 'meşru'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"social\"?",
        options: ['istatistiksel', 'aşırı', 'sosyal', 'kaçınılmaz'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"notable\"?",
        options: ['iç', 'meşru', 'pasif', 'kayda değer'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"invisible\"?",
        options: ['sıfır', 'iç', 'sıkı', 'görünmez'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 3,
    title: "Sıfatlar Testi 3",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"deep\"?",
        options: ['endüstriyel', 'derin', 'yapay', 'basit'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"prominent\"?",
        options: ['eşzamanlı', 'öne çıkan', 'kültürel', 'fiziksel'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"optional\"?",
        options: ['profesyonel', 'şeffaf', 'deneysel', 'isteğe bağlı'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"restricted\"?",
        options: ['önemli', 'sınırlı', 'resmi', 'meşru'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"enabling\"?",
        options: ['ılımlı', 'olanak sağlayan', 'bağımsız', 'kültürel'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"coherent\"?",
        options: ['açık', 'tutarlı', 'ileri', 'gönüllü'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"immediate\"?",
        options: ['ön', 'hemen', 'kayda değer', 'eşit'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"exact\"?",
        options: ['genel', 'belirli', 'tam', 'bariz'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"current\"?",
        options: ['güncel', 'açık', 'genel', 'benzer'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"visible\"?",
        options: ['tutarlı', 'detaylı', 'sınırlı', 'görünür'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 4,
    title: "Sıfatlar Testi 4",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"thorough\"?",
        options: ['kümülatif', 'detaylı', 'sağlam', 'kararlı'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"variable\"?",
        options: ['geçerli', 'rastgele', 'tutarlı', 'değişken'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"extreme\"?",
        options: ['net', 'çok önemli', 'dikkat çekici', 'aşırı'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"objective\"?",
        options: ['rastgele', 'birincil', 'objektif', 'esnek'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"original\"?",
        options: ['sınırlı', 'özgün', 'önemli', 'sıkı'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"preliminary\"?",
        options: ['ön', 'sıkı', 'dikkat çekici', 'ilginç'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"fundamental\"?",
        options: ['temel', 'şeffaf', 'esnek', 'öznel'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"advanced\"?",
        options: ['dikkat çekici', 'etkili', 'genel', 'gelişmiş'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"analytical\"?",
        options: ['ideal', 'öznel', 'analitik', 'olağanüstü'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"typical\"?",
        options: ['gerekli', 'tipik', 'ölçülebilir', 'küçük'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 5,
    title: "Sıfatlar Testi 5",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"restricted\"?",
        options: ['çağdaş', 'içsel', 'sınırlı', 'yapay'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"intrinsic\"?",
        options: ['üstün', 'kapsamlı', 'kapsamlı', 'içsel'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"adaptable\"?",
        options: ['gerekli', 'uyum sağlayabilen', 'objektif', 'sınırlı'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"main\"?",
        options: ['ana', 'gerçek', 'geçerli', 'modern'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"initial\"?",
        options: ['başlangıç', 'bağımsız', 'belirli', 'organize edilmiş'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"random\"?",
        options: ['akademik', 'kaçınılmaz', 'uyumlu', 'rastgele'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"adverse\"?",
        options: ['çağdaş', 'kapsamlı', 'olumsuz', 'temel'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"urgent\"?",
        options: ['öne çıkan', 'basit', 'acil', 'kaçınılmaz'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"explicit\"?",
        options: ['kültürel', 'kısa', 'açık', 'avantajlı'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"academic\"?",
        options: ['akademik', 'uygun', 'acil', 'yeni'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 6,
    title: "Sıfatlar Testi 6",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"primary\"?",
        options: ['birincil', 'gönüllü', 'ölçülebilir', 'köklü'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"important\"?",
        options: ['yoğun', 'önemli', 'muhtemel', 'büyük'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"clear\"?",
        options: ['net', 'bireysel', 'birincil', 'dayanıklı'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"immediate\"?",
        options: ['hemen', 'yaygın', 'sınırlı', 'mantıklı'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"small\"?",
        options: ['nicel', 'sosyal', 'anlayışlı', 'küçük'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"emerging\"?",
        options: ['günlük', 'ortaya çıkan', 'rastgele', 'duygusal'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"simple\"?",
        options: ['çağdaş', 'geçici', 'istekli', 'basit'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"remarkable\"?",
        options: ['tutarlı', 'eşzamanlı', 'dikkat çekici', 'dikkat çekici'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"formal\"?",
        options: ['resmi', 'orantılı', 'yetenekli', 'nicel'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"successful\"?",
        options: ['küçük', 'birincil', 'başarılı', 'küçük'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 7,
    title: "Sıfatlar Testi 7",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"existing\"?",
        options: ['yetenekli', 'rastgele', 'yenilikçi', 'mevcut'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"prominent\"?",
        options: ['toplam', 'eşzamanlı', 'öne çıkan', 'esnek'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"reliable\"?",
        options: ['gerekli', 'kaçınılmaz', 'güvenilir', 'örtük'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"long-term\"?",
        options: ['şeffaf', 'ön', 'uzun vadeli', 'nadir'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"realistic\"?",
        options: ['ön', 'görünmez', 'gerçekçi', 'dayanıklı'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"dominant\"?",
        options: ['meşru', 'rutin', 'eşdeğer', 'baskın'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"beneficial\"?",
        options: ['merkezi', 'faydalı', 'acil', 'yeterli'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"daily\"?",
        options: ['geçerli', 'günlük', 'olağanüstü', 'kararlı'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"decisive\"?",
        options: ['anlamlı', 'içsel', 'öznel', 'kararlı'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"widespread\"?",
        options: ['sıfır', 'pasif', 'yaygın', 'tam'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 8,
    title: "Sıfatlar Testi 8",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"critical\"?",
        options: ['tutarlı', 'çok önemli', 'sistematik', 'kritik'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"similar\"?",
        options: ['anahtar', 'benzer', 'bireysel', 'klasik'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"significant\"?",
        options: ['ılımlı', 'zamanında', 'önemli', 'tekrarlayan'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"prior\"?",
        options: ['tipik', 'nicel', 'önceki', 'bireysel'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"modern\"?",
        options: ['güncel', 'modern', 'doğru', 'istatistiksel'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"zero\"?",
        options: ['estetik', 'istekli', 'sıfır', 'pasif'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"typical\"?",
        options: ['mantıklı', 'tipik', 'içsel', 'temel'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"original\"?",
        options: ['geçici', 'ön', 'özgün', 'olağanüstü'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"intense\"?",
        options: ['genç', 'yoğun', 'kalıcı', 'benzer'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"intermediate\"?",
        options: ['orta', 'teorik', 'birincil', 'yetenekli'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 9,
    title: "Sıfatlar Testi 9",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"certain\"?",
        options: ['belirli', 'bağımsız', 'temel', 'bireysel'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"existing\"?",
        options: ['sağlam', 'öznel', 'mevcut', 'fiziksel'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"extensive\"?",
        options: ['nadir', 'rastgele', 'kapsamlı', 'kalıcı'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"productive\"?",
        options: ['verimli', 'faydalı', 'önceki', 'geçici'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"elaborate\"?",
        options: ['ayrıntılı', 'analitik', 'aşırı', 'küçük'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"voluntary\"?",
        options: ['benzer', 'gönüllü', 'mantıklı', 'organize edilmiş'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"crucial\"?",
        options: ['endüstriyel', 'çok önemli', 'belirli', 'varsayımsal'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"quantitative\"?",
        options: ['orta', 'orantılı', 'üstün', 'nicel'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"identical\"?",
        options: ['aynı', 'birincil', 'örtük', 'sınırlı'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"permanent\"?",
        options: ['etkili', 'görünmez', 'yetenekli', 'kalıcı'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 10,
    title: "Sıfatlar Testi 10",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"effective\"?",
        options: ['olağanüstü', 'detaylı', 'etkili', 'faydalı'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"relevant\"?",
        options: ['devam eden', 'tutarlı', 'ilgili', 'derin'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"timely\"?",
        options: ['geçerli', 'zamanında', 'izole', 'doğru'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"large\"?",
        options: ['kapsamlı', 'ilgili', 'kaçınılmaz', 'büyük'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"diverse\"?",
        options: ['çeşitli', 'sağlam', 'dış', 'yeni'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"important\"?",
        options: ['kavramsal', 'önemli', 'ilginç', 'analitik'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"beneficial\"?",
        options: ['olanak sağlayan', 'önemli', 'faydalı', 'odaklanmış'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"superior\"?",
        options: ['üstün', 'sıkı', 'orta', 'öne çıkan'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"accurate\"?",
        options: ['yenilikçi', 'yeni', 'yetenekli', 'doğru, hatasız'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"intrinsic\"?",
        options: ['anlamlı', 'kaçınılmaz', 'yaygın', 'içsel'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 11,
    title: "Sıfatlar Testi 11",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"abnormal\"?",
        options: ['hemen', 'temel', 'anormal', 'temel'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"qualitative\"?",
        options: ['nitel', 'yeni', 'olumsuz', 'geçerli'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"proper\"?",
        options: ['sistematik', 'uygun', 'faydalı', 'dayanıklı'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"primary\"?",
        options: ['nadir', 'köklü', 'birincil', 'gerçek'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"intrinsic\"?",
        options: ['hayati', 'yapay', 'kavramsal', 'içsel'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"initial\"?",
        options: ['ılımlı', 'başlangıç', 'temel', 'yoğun'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"original\"?",
        options: ['önceki', 'pasif', 'içsel', 'özgün'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"resilient\"?",
        options: ['dayanıklı', 'çok önemli', 'tutarlı', 'eşit'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"robust\"?",
        options: ['hassas', 'mevcut', 'sağlam', 'yaygın'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"current\"?",
        options: ['hassas', 'güncel', 'tutarlı', 'uygulanabilir'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 12,
    title: "Sıfatlar Testi 12",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"realistic\"?",
        options: ['uygulanabilir', 'gerçekçi', 'ılımlı', 'orantılı'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"main\"?",
        options: ['önceki', 'belirli', 'günlük', 'ana'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"dramatic\"?",
        options: ['dramatik', 'gerekli', 'baskın', 'eşzamanlı'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"leading\"?",
        options: ['istikrarlı', 'dış', 'önde gelen', 'modern'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"individual\"?",
        options: ['varsayımsal', 'istekli', 'bireysel', 'benzersiz'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"complex\"?",
        options: ['karmaşık', 'hayati', 'anlayışlı', 'geleneksel'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"strict\"?",
        options: ['yoğun', 'kısa', 'sıkı', 'yeterli'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"daily\"?",
        options: ['birincil', 'uyumlu', 'değişken', 'günlük'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"emotional\"?",
        options: ['kültürel', 'benzer', 'duygusal', 'öne çıkan'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"experimental\"?",
        options: ['çoklu', 'kaçınılmaz', 'klinik', 'deneysel'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 13,
    title: "Sıfatlar Testi 13",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"extreme\"?",
        options: ['önemli', 'olağanüstü', 'aşırı', 'hemen'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"identical\"?",
        options: ['aynı', 'duygusal', 'sosyal', 'önde gelen'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"appropriate\"?",
        options: ['tipik', 'ileri', 'nicel', 'uygun'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"probable\"?",
        options: ['uygun', 'profesyonel', 'muhtemel', 'orta'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"unique\"?",
        options: ['tam', 'eşit', 'kaçınılmaz', 'benzersiz'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"elaborate\"?",
        options: ['değişken', 'açık', 'genel', 'ayrıntılı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"individual\"?",
        options: ['kısa', 'günlük', 'bireysel', 'tekrarlayan'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"ideal\"?",
        options: ['ana', 'yenilikçi', 'ideal', 'önceki'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"restricted\"?",
        options: ['detaylı', 'gerekli', 'sınırlı', 'basit'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"isolated\"?",
        options: ['sınırlı', 'izole', 'duygusal', 'merkezi'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 14,
    title: "Sıfatlar Testi 14",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"robust\"?",
        options: ['sağlam', 'sezgisel', 'çağdaş', 'meşru'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"exceptional\"?",
        options: ['deneysel', 'olağanüstü', 'olağanüstü', 'aynı'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"equivalent\"?",
        options: ['yeni', 'eşdeğer', 'orta', 'tekrarlanan'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"required\"?",
        options: ['örtük', 'çeşitli', 'başlangıç', 'gerekli'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"unique\"?",
        options: ['benzersiz', 'ana', 'sistematik', 'tek tip'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"abnormal\"?",
        options: ['anormal', 'güvenilir', 'köklü', 'sezgisel'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"extreme\"?",
        options: ['aşırı', 'kavramsal', 'gerekli', 'bireysel'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"meaningful\"?",
        options: ['aynı', 'kümülatif', 'bariz', 'anlamlı'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"variable\"?",
        options: ['yetenekli', 'gönüllü', 'tekrarlanan', 'değişken'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"elaborate\"?",
        options: ['ayrıntılı', 'optimal', 'zamanında', 'olumsuz'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 15,
    title: "Sıfatlar Testi 15",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"notable\"?",
        options: ['işlevsel', 'nadir', 'kayda değer', 'nitel'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"classical\"?",
        options: ['iç', 'profesyonel', 'klasik', 'verimli'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"optimal\"?",
        options: ['optimal', 'gerekli', 'alışılmadık', 'içsel'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"feasible\"?",
        options: ['uygulanabilir', 'uygun', 'alışılmadık', 'sınırlı'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"internal\"?",
        options: ['analitik', 'geleneksel', 'iç', 'sağlam'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"successful\"?",
        options: ['uzun vadeli', 'iç', 'hassas', 'başarılı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"critical\"?",
        options: ['meşru', 'açık', 'kritik', 'olumsuz'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"independent\"?",
        options: ['bağımsız', 'önemli', 'ortaya çıkan', 'uzun vadeli'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"sufficient\"?",
        options: ['geleneksel', 'kısa', 'yeterli', 'erişilebilir'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"voluntary\"?",
        options: ['anormal', 'önde gelen', 'dış', 'gönüllü'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 16,
    title: "Sıfatlar Testi 16",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"insightful\"?",
        options: ['bireysel', 'karmaşık', 'anlayışlı', 'orta'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"required\"?",
        options: ['gerekli', 'bağımsız', 'nitel', 'güncel'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"simple\"?",
        options: ['köklü', 'mantıklı', 'köklü', 'basit'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"passive\"?",
        options: ['anlayışlı', 'pasif', 'organize edilmiş', 'faydalı'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"ongoing\"?",
        options: ['devam eden', 'baskın', 'anormal', 'ılımlı'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"feasible\"?",
        options: ['zamanında', 'karmaşık', 'uygulanabilir', 'ana'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"similar\"?",
        options: ['benzer', 'eşit', 'görünmez', 'ayrıntılı'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"remarkable\"?",
        options: ['verimli', 'başlangıç', 'genel', 'dikkat çekici'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"original\"?",
        options: ['köklü', 'içsel', 'özgün', 'örtük'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"persistent\"?",
        options: ['net', 'ısrarcı', 'gerçekçi', 'net'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 17,
    title: "Sıfatlar Testi 17",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"simultaneous\"?",
        options: ['ilginç', 'eşzamanlı', 'eşzamanlı', 'alışılmadık'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"transparent\"?",
        options: ['nadir', 'şeffaf', 'etkili', 'belirli'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"routine\"?",
        options: ['acil', 'kalıcı', 'rutin', 'gerçekçi'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"advanced\"?",
        options: ['varsayımsal', 'ortaya çıkan', 'ileri', 'rastgele'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"theoretical\"?",
        options: ['teorik', 'kapsamlı', 'doğru', 'teorik'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"invisible\"?",
        options: ['görünmez', 'güçlü', 'yetenekli', 'optimal'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"legitimate\"?",
        options: ['görünmez', 'meşru', 'istatistiksel', 'ayrıntılı'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"remarkable\"?",
        options: ['standart', 'genç', 'olumsuz', 'dikkat çekici'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"similar\"?",
        options: ['ana', 'hemen', 'benzer', 'yaygın'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"invisible\"?",
        options: ['ileri', 'klinik', 'görünmez', 'günlük'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 18,
    title: "Sıfatlar Testi 18",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"routine\"?",
        options: ['yapay', 'rutin', 'uzun vadeli', 'verimli'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"sufficient\"?",
        options: ['kritik', 'benzersiz', 'yeterli', 'uyum sağlayabilen'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"voluntary\"?",
        options: ['acil', 'klasik', 'gönüllü', 'baskın'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"academic\"?",
        options: ['verimli', 'akademik', 'geçici', 'varsayımsal'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"exceptional\"?",
        options: ['olağanüstü', 'çok önemli', 'gönüllü', 'rastgele'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"ideal\"?",
        options: ['nicel', 'ideal', 'çok önemli', 'çağdaş'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"individual\"?",
        options: ['varsayımsal', 'bireysel', 'güvenilir', 'tekrarlayan'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"total\"?",
        options: ['optimal', 'genç', 'basit', 'toplam'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"small\"?",
        options: ['sosyal', 'küçük', 'deneysel', 'etik'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"existing\"?",
        options: ['verimli', 'doğru', 'olumsuz', 'mevcut'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 19,
    title: "Sıfatlar Testi 19",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"optimal\"?",
        options: ['kapsamlı', 'istikrarlı', 'optimal', 'varsayımsal'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"quantitative\"?",
        options: ['benzersiz', 'tekrarlanan', 'nicel', 'olumsuz'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"intense\"?",
        options: ['yoğun', 'verimli', 'rastgele', 'birincil'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"vigorous\"?",
        options: ['ideal', 'sistematik', 'gönüllü', 'güçlü'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"emerging\"?",
        options: ['şeffaf', 'çağdaş', 'ortaya çıkan', 'avantajlı'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"resilient\"?",
        options: ['kültürel', 'dayanıklı', 'tekrarlayan', 'zamanında'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"deep\"?",
        options: ['derin', 'endüstriyel', 'son', 'olağanüstü'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"industrial\"?",
        options: ['endüstriyel', 'geçici', 'kavramsal', 'toplam'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"novel\"?",
        options: ['önceki', 'yeni', 'uygun', 'uyumlu'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"substantial\"?",
        options: ['kısa', 'uzun vadeli', 'küçük', 'önemli'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 20,
    title: "Sıfatlar Testi 20",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"isolated\"?",
        options: ['hassas', 'uygun', 'izole', 'güçlü'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"elaborate\"?",
        options: ['orantılı', 'ayrıntılı', 'güvenilir', 'resmi'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"intermediate\"?",
        options: ['küçük', 'nicel', 'orta', 'gerçekçi'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"subjective\"?",
        options: ['çağdaş', 'öznel', 'tutarlı', 'kalıcı'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"organized\"?",
        options: ['organize edilmiş', 'tam', 'orantılı', 'teknik'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"comprehensive\"?",
        options: ['verimli', 'şeffaf', 'kapsamlı', 'anormal'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"cumulative\"?",
        options: ['kalıcı', 'dikkat çekici', 'kümülatif', 'resmi'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"genuine\"?",
        options: ['gerçek', 'kalıcı', 'temel', 'objektif'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"elaborate\"?",
        options: ['genç', 'kültürel', 'ayrıntılı', 'verimli'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"formal\"?",
        options: ['yeni', 'yeni', 'zamanında', 'resmi'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 21,
    title: "Sıfatlar Testi 21",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"vital\"?",
        options: ['büyük', 'hayati', 'nitel', 'kritik'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"open\"?",
        options: ['görünür', 'bariz', 'ön', 'açık'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"zero\"?",
        options: ['sıfır', 'hayati', 'kaçınılmaz', 'aşırı'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"detailed\"?",
        options: ['belirli', 'ayrıntılı', 'benzersiz', 'başlangıç'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"unique\"?",
        options: ['benzersiz', 'öne çıkan', 'hemen', 'gerçek'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"efficient\"?",
        options: ['analitik', 'dayanıklı', 'verimli', 'optimal'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"prior\"?",
        options: ['önceki', 'görünür', 'doğru', 'mantıklı'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"primary\"?",
        options: ['mevcut', 'objektif', 'birincil', 'acil'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"explicit\"?",
        options: ['önde gelen', 'açık', 'geleneksel', 'teorik'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"intuitive\"?",
        options: ['acil', 'yapay', 'geniş', 'sezgisel'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 22,
    title: "Sıfatlar Testi 22",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"vigorous\"?",
        options: ['hayati', 'özgün', 'güçlü', 'objektif'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"exact\"?",
        options: ['tam', 'uyum sağlayabilen', 'yaygın', 'olağanüstü'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"important\"?",
        options: ['önemli', 'yapay', 'bariz', 'meşru'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"comprehensive\"?",
        options: ['profesyonel', 'örtük', 'deneysel', 'kapsamlı'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"preliminary\"?",
        options: ['sezgisel', 'analitik', 'istatistiksel', 'ön'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"clinical\"?",
        options: ['klinik', 'önde gelen', 'muhtemel', 'başarılı'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"large\"?",
        options: ['isteğe bağlı', 'duygusal', 'benzersiz', 'büyük'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"universal\"?",
        options: ['olumsuz', 'çağdaş', 'evrensel', 'önemli'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"detailed\"?",
        options: ['şeffaf', 'ayrıntılı', 'anahtar', 'geçerli'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"simple\"?",
        options: ['rastgele', 'anlamlı', 'olanak sağlayan', 'basit'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 23,
    title: "Sıfatlar Testi 23",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"current\"?",
        options: ['güncel', 'isteğe bağlı', 'baskın', 'detaylı'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"detailed\"?",
        options: ['son', 'ayrıntılı', 'standart', 'modern'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"fundamental\"?",
        options: ['kapsamlı', 'erişilebilir', 'genel', 'temel'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"open\"?",
        options: ['temel', 'belirli', 'açık', 'yetenekli'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"implicit\"?",
        options: ['üstün', 'örtük', 'sınırlı', 'istekli'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"isolated\"?",
        options: ['önemli', 'ortaya çıkan', 'nicel', 'izole'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"adaptable\"?",
        options: ['endüstriyel', 'mantıklı', 'analitik', 'uyumlu'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"zero\"?",
        options: ['yetenekli', 'standart', 'toplam', 'sıfır'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"independent\"?",
        options: ['son', 'bağımsız', 'optimal', 'üstün'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"urgent\"?",
        options: ['acil', 'analitik', 'sınırlı', 'hemen'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 24,
    title: "Sıfatlar Testi 24",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"realistic\"?",
        options: ['gerçekçi', 'kalıcı', 'ön', 'kapsamlı'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"radical\"?",
        options: ['nadir', 'köklü', 'akademik', 'ileri'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"formal\"?",
        options: ['resmi', 'yetenekli', 'günlük', 'köklü'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"elaborate\"?",
        options: ['nicel', 'ayrıntılı', 'acil', 'gelişmiş'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"equal\"?",
        options: ['ilginç', 'değişken', 'eşit', 'sınırlı'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"simultaneous\"?",
        options: ['ideal', 'optimal', 'erişilebilir', 'eşzamanlı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"traditional\"?",
        options: ['özgün', 'rutin', 'geleneksel', 'klinik'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"aesthetic\"?",
        options: ['sosyal', 'içsel', 'şeffaf', 'estetik'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"subjective\"?",
        options: ['ayrıntılı', 'kapsamlı', 'öznel', 'etkili'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"ethical\"?",
        options: ['genel', 'doğru, hatasız', 'etik', 'sıfır'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 25,
    title: "Sıfatlar Testi 25",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"voluntary\"?",
        options: ['gönüllü', 'ön', 'sosyal', 'yetenekli'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"persistent\"?",
        options: ['baskın', 'ısrarcı', 'klasik', 'kısa'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"consistent\"?",
        options: ['eşzamanlı', 'tutarlı', 'orantılı', 'olanak sağlayan'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"recent\"?",
        options: ['tekrarlayan', 'birincil', 'son', 'kademeli'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"current\"?",
        options: ['ilginç', 'teknik', 'güncel', 'kavramsal'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"resilient\"?",
        options: ['dayanıklı', 'kaçınılmaz', 'içsel', 'tutarlı'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"equal\"?",
        options: ['kritik', 'eşit', 'nicel', 'yoğun'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"prior\"?",
        options: ['önceki', 'tutarlı', 'uygun', 'sosyal'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"initial\"?",
        options: ['işlevsel', 'anormal', 'başlangıç', 'aynı'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"variable\"?",
        options: ['değişken', 'açık', 'sıfır', 'önemli'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 26,
    title: "Sıfatlar Testi 26",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"central\"?",
        options: ['çağdaş', 'aşırı', 'merkezi', 'uygulanabilir'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"robust\"?",
        options: ['sağlam', 'endüstriyel', 'mevcut', 'ön'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"original\"?",
        options: ['özgün', 'sistematik', 'genç', 'organize edilmiş'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"key\"?",
        options: ['net', 'sistematik', 'sıfır', 'anahtar'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"brief\"?",
        options: ['son', 'kademeli', 'tam', 'kısa'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"timely\"?",
        options: ['detaylı', 'uygulanabilir', 'bireysel', 'zamanında'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"stable\"?",
        options: ['istikrarlı', 'olağanüstü', 'geniş', 'geleneksel'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"enduring\"?",
        options: ['kalıcı', 'yetenekli', 'güçlü', 'tutarlı'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"simultaneous\"?",
        options: ['dikkat çekici', 'kayda değer', 'çeşitli', 'eşzamanlı'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"flexible\"?",
        options: ['kavramsal', 'ayrıntılı', 'esnek', 'üstün'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 27,
    title: "Sıfatlar Testi 27",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"young\"?",
        options: ['ölçülebilir', 'genç', 'teorik', 'kayda değer'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"detailed\"?",
        options: ['temel', 'ayrıntılı', 'yoğun', 'teknik'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"emotional\"?",
        options: ['rutin', 'duygusal', 'anahtar', 'kalıcı'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"exact\"?",
        options: ['belirli', 'açık', 'genç', 'tam'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"obvious\"?",
        options: ['bariz', 'geçerli', 'öznel', 'analitik'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"hypothetical\"?",
        options: ['varsayımsal', 'klasik', 'çağdaş', 'ortaya çıkan'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"innovative\"?",
        options: ['yenilikçi', 'çeşitli', 'doğru', 'yenilikçi'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"crucial\"?",
        options: ['gerçek', 'çok önemli', 'akademik', 'temel'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"simple\"?",
        options: ['çağdaş', 'basit', 'üstün', 'bariz'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"thorough\"?",
        options: ['detaylı', 'eşzamanlı', 'sezgisel', 'ölçülebilir'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 28,
    title: "Sıfatlar Testi 28",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"traditional\"?",
        options: ['optimal', 'dikkat çekici', 'tek tip', 'geleneksel'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"internal\"?",
        options: ['iç', 'optimal', 'gerçekçi', 'kritik'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"ongoing\"?",
        options: ['yoğun', 'zamanında', 'devam eden', 'dikkat çekici'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"clinical\"?",
        options: ['işlevsel', 'anlayışlı', 'klinik', 'akademik'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"moderate\"?",
        options: ['ılımlı', 'önceki', 'muhtemel', 'uygun'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"central\"?",
        options: ['dış', 'faydalı', 'merkezi', 'standart'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"decisive\"?",
        options: ['muhtemel', 'kararlı', 'görünür', 'günlük'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"total\"?",
        options: ['ideal', 'toplam', 'sınırlı', 'verimli'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"enduring\"?",
        options: ['kalıcı', 'sosyal', 'ısrarcı', 'ılımlı'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"zero\"?",
        options: ['örtük', 'yenilikçi', 'tipik', 'sıfır'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 29,
    title: "Sıfatlar Testi 29",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"accessible\"?",
        options: ['sağlam', 'devam eden', 'erişilebilir', 'mevcut'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"functional\"?",
        options: ['ilgili', 'olağanüstü', 'anahtar', 'işlevsel'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"isolated\"?",
        options: ['benzersiz', 'izole', 'kalıcı', 'belirli'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"critical\"?",
        options: ['hassas', 'açık', 'net', 'kritik'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"relevant\"?",
        options: ['nicel', 'ilgili', 'karmaşık', 'rutin'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"vital\"?",
        options: ['açık', 'uyumlu', 'hayati', 'detaylı'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"traditional\"?",
        options: ['basit', 'geleneksel', 'faydalı', 'gerçek'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"original\"?",
        options: ['gerçek', 'özgün', 'ortaya çıkan', 'açık'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"advantageous\"?",
        options: ['açık', 'dış', 'şeffaf', 'avantajlı'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"objective\"?",
        options: ['meşru', 'objektif', 'olumsuz', 'kademeli'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 30,
    title: "Sıfatlar Testi 30",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"intermediate\"?",
        options: ['güncel', 'dikkat çekici', 'orta', 'yaygın'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"accurate\"?",
        options: ['olağanüstü', 'kapsamlı', 'doğru', 'kalıcı'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"professional\"?",
        options: ['ideal', 'ölçülebilir', 'profesyonel', 'işlevsel'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"effective\"?",
        options: ['ilginç', 'etkili', 'anormal', 'çok önemli'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"emerging\"?",
        options: ['ortaya çıkan', 'işlevsel', 'geleneksel', 'olumsuz'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"effective\"?",
        options: ['etkili', 'görünür', 'geçici', 'çağdaş'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"insightful\"?",
        options: ['anlayışlı', 'ısrarcı', 'olağanüstü', 'önceki'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"dominant\"?",
        options: ['kayda değer', 'kavramsal', 'baskın', 'pasif'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"abnormal\"?",
        options: ['derin', 'anormal', 'resmi', 'içsel'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"routine\"?",
        options: ['uygulanabilir', 'rutin', 'alışılmadık', 'açık'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 31,
    title: "Sıfatlar Testi 31",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"individual\"?",
        options: ['bireysel', 'sistematik', 'gerçekçi', 'varsayımsal'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"resilient\"?",
        options: ['dayanıklı', 'başarılı', 'ilginç', 'tipik'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"excessive\"?",
        options: ['benzer', 'sosyal', 'geçerli', 'aşırı'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"dominant\"?",
        options: ['klasik', 'özgün', 'ön', 'baskın'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"intense\"?",
        options: ['gerekli', 'anlamlı', 'yoğun', 'gönüllü'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"key\"?",
        options: ['genç', 'odaklanmış', 'son', 'anahtar'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"vital\"?",
        options: ['temel', 'hayati', 'analitik', 'başlangıç'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"urgent\"?",
        options: ['temel', 'mantıklı', 'acil', 'olanak sağlayan'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"productive\"?",
        options: ['klinik', 'verimli', 'kayda değer', 'odaklanmış'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"persistent\"?",
        options: ['sınırlı', 'güçlü', 'temel', 'ısrarcı'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 32,
    title: "Sıfatlar Testi 32",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"measurable\"?",
        options: ['ölçülebilir', 'devam eden', 'acil', 'gerçekçi'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"crucial\"?",
        options: ['çağdaş', 'şeffaf', 'çok önemli', 'avantajlı'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"genuine\"?",
        options: ['fiziksel', 'meşru', 'istikrarlı', 'gerçek'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"universal\"?",
        options: ['yapay', 'evrensel', 'teknik', 'klasik'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"recurrent\"?",
        options: ['ön', 'bağımsız', 'tekrarlayan', 'nitel'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"zero\"?",
        options: ['geleneksel', 'sıfır', 'bireysel', 'öznel'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"timely\"?",
        options: ['aşırı', 'zamanında', 'zamanında', 'net'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"capable\"?",
        options: ['yetenekli', 'zamanında', 'toplam', 'önceki'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"measurable\"?",
        options: ['mantıklı', 'nadir', 'klasik', 'ölçülebilir'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"productive\"?",
        options: ['klasik', 'alışılmadık', 'genel', 'verimli'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 33,
    title: "Sıfatlar Testi 33",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"remarkable\"?",
        options: ['dikkat çekici', 'ideal', 'olağanüstü', 'kavramsal'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"remarkable\"?",
        options: ['varsayımsal', 'meşru', 'dikkat çekici', 'ilgili'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"legitimate\"?",
        options: ['son', 'modern', 'gerekli', 'meşru'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"advanced\"?",
        options: ['deneysel', 'ileri', 'toplam', 'zamanında'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"thorough\"?",
        options: ['detaylı', 'yetenekli', 'benzersiz', 'odaklanmış'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"beneficial\"?",
        options: ['olağanüstü', 'belirli', 'olağanüstü', 'faydalı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"certain\"?",
        options: ['belirli', 'ılımlı', 'optimal', 'dikkat çekici'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"decisive\"?",
        options: ['anlamlı', 'devam eden', 'orta', 'kararlı'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"flexible\"?",
        options: ['kalıcı', 'organize edilmiş', 'esnek', 'varsayımsal'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"notable\"?",
        options: ['acil', 'ısrarcı', 'kayda değer', 'mantıklı'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 34,
    title: "Sıfatlar Testi 34",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"comprehensive\"?",
        options: ['çok önemli', 'gönüllü', 'kapsamlı', 'yeni'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"gradual\"?",
        options: ['küçük', 'öznel', 'kademeli', 'sıfır'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"general\"?",
        options: ['genel', 'başarılı', 'etkili', 'zamanında'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"insightful\"?",
        options: ['anlayışlı', 'iç', 'etkili', 'temel'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"industrial\"?",
        options: ['sınırlı', 'eşdeğer', 'anahtar', 'endüstriyel'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"visible\"?",
        options: ['öne çıkan', 'görünür', 'hayati', 'güncel'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"radical\"?",
        options: ['orantılı', 'köklü', 'güçlü', 'dramatik'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"rare\"?",
        options: ['modern', 'detaylı', 'nadir', 'kritik'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"unique\"?",
        options: ['sıfır', 'modern', 'benzersiz', 'anlayışlı'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"key\"?",
        options: ['anahtar', 'benzer', 'öznel', 'dayanıklı'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 35,
    title: "Sıfatlar Testi 35",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"clinical\"?",
        options: ['anahtar', 'yetenekli', 'klinik', 'temel'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"feasible\"?",
        options: ['tutarlı', 'dikkat çekici', 'uygulanabilir', 'üstün'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"random\"?",
        options: ['ayrıntılı', 'isteğe bağlı', 'dış', 'rastgele'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"current\"?",
        options: ['güncel', 'güncel', 'yenilikçi', 'anlayışlı'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"abnormal\"?",
        options: ['anormal', 'kapsamlı', 'istatistiksel', 'tipik'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"small\"?",
        options: ['tek tip', 'küçük', 'görünmez', 'meşru'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"experimental\"?",
        options: ['kaçınılmaz', 'orta', 'deneysel', 'güçlü'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"intrinsic\"?",
        options: ['içsel', 'mevcut', 'acil', 'genel'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"small\"?",
        options: ['küçük', 'sınırlı', 'gerekli', 'orantılı'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"long-term\"?",
        options: ['uzun vadeli', 'benzersiz', 'deneysel', 'sınırlı'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 36,
    title: "Sıfatlar Testi 36",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"crucial\"?",
        options: ['odaklanmış', 'çok önemli', 'rastgele', 'tipik'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"typical\"?",
        options: ['basit', 'tipik', 'önemli', 'resmi'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"valid\"?",
        options: ['ilginç', 'güvenilir', 'geçerli', 'tutarlı'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"realistic\"?",
        options: ['gerçekçi', 'geçici', 'sınırlı', 'muhtemel'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"dominant\"?",
        options: ['optimal', 'son', 'odaklanmış', 'baskın'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"contemporary\"?",
        options: ['çağdaş', 'toplam', 'geleneksel', 'başarılı'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"independent\"?",
        options: ['deneysel', 'etik', 'tek tip', 'bağımsız'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"contemporary\"?",
        options: ['dayanıklı', 'köklü', 'çağdaş', 'ilginç'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"notable\"?",
        options: ['toplam', 'çok önemli', 'görünür', 'kayda değer'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"comprehensive\"?",
        options: ['rastgele', 'kapsamlı', 'çok önemli', 'ilgili'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 37,
    title: "Sıfatlar Testi 37",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"radical\"?",
        options: ['köklü', 'pasif', 'ilgili', 'gerçekçi'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"vast\"?",
        options: ['birincil', 'kalıcı', 'klinik', 'geniş'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"meaningful\"?",
        options: ['anlamlı', 'büyük', 'tek tip', 'tipik'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"passive\"?",
        options: ['pasif', 'küçük', 'sezgisel', 'bağımsız'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"extreme\"?",
        options: ['aşırı', 'ılımlı', 'görünür', 'genel'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"young\"?",
        options: ['eşzamanlı', 'genç', 'baskın', 'yeni'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"vital\"?",
        options: ['hayati', 'klasik', 'geçerli', 'basit'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"intrinsic\"?",
        options: ['içsel', 'kapsamlı', 'yetenekli', 'açık'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"prior\"?",
        options: ['zamanında', 'önceki', 'organize edilmiş', 'güvenilir'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"equivalent\"?",
        options: ['eşdeğer', 'kalıcı', 'şeffaf', 'geniş'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 38,
    title: "Sıfatlar Testi 38",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"stable\"?",
        options: ['nicel', 'dikkat çekici', 'istikrarlı', 'rastgele'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"passive\"?",
        options: ['pasif', 'doğru', 'varsayımsal', 'kararlı'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"influential\"?",
        options: ['etkili', 'şeffaf', 'tutarlı', 'temel'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"functional\"?",
        options: ['işlevsel', 'kaçınılmaz', 'kavramsal', 'istikrarlı'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"uniform\"?",
        options: ['acil', 'hassas', 'tek tip', 'yoğun'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"extensive\"?",
        options: ['mantıklı', 'hayati', 'kararlı', 'kapsamlı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"classical\"?",
        options: ['objektif', 'klasik', 'önemli', 'rutin'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"qualitative\"?",
        options: ['orta', 'açık', 'nitel', 'ayrıntılı'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"long-term\"?",
        options: ['rastgele', 'uzun vadeli', 'rutin', 'uzun vadeli'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"immediate\"?",
        options: ['hemen', 'yapay', 'acil', 'sınırlı'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 39,
    title: "Sıfatlar Testi 39",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"young\"?",
        options: ['genç', 'detaylı', 'kültürel', 'anahtar'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"qualitative\"?",
        options: ['kapsamlı', 'son', 'nitel', 'gerçekçi'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"clear\"?",
        options: ['uygulanabilir', 'orta', 'kümülatif', 'net'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"immediate\"?",
        options: ['açık', 'dayanıklı', 'yeterli', 'hemen'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"optimal\"?",
        options: ['kültürel', 'sınırlı', 'optimal', 'belirli'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"similar\"?",
        options: ['güncel', 'çeşitli', 'bağımsız', 'benzer'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"existing\"?",
        options: ['esnek', 'aşırı', 'aynı', 'mevcut'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"strict\"?",
        options: ['öznel', 'öznel', 'olumsuz', 'sıkı'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"aesthetic\"?",
        options: ['önde gelen', 'rastgele', 'kaçınılmaz', 'estetik'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"strict\"?",
        options: ['resmi', 'klasik', 'sıkı', 'toplam'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 40,
    title: "Sıfatlar Testi 40",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"intense\"?",
        options: ['muhtemel', 'son', 'yoğun', 'resmi'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"intuitive\"?",
        options: ['sezgisel', 'örtük', 'uygun', 'öne çıkan'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"robust\"?",
        options: ['sağlam', 'rutin', 'özgün', 'benzer'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"technical\"?",
        options: ['teknik', 'yeni', 'güçlü', 'yenilikçi'],
        correctOptionIndex: 0
      },
      {
        id: 5,
        text: "What is the meaning of \"accurate\"?",
        options: ['üstün', 'dramatik', 'doğru, hatasız', 'net'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"voluntary\"?",
        options: ['yaygın', 'gönüllü', 'kalıcı', 'sezgisel'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"analytical\"?",
        options: ['açık', 'analitik', 'izole', 'aynı'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"advantageous\"?",
        options: ['uygun', 'avantajlı', 'rastgele', 'isteğe bağlı'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"clear\"?",
        options: ['net', 'açık', 'uygun', 'alışılmadık'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"current\"?",
        options: ['temel', 'tek tip', 'yapay', 'güncel'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 41,
    title: "Sıfatlar Testi 41",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"remarkable\"?",
        options: ['dikkat çekici', 'belirli', 'istikrarlı', 'şeffaf'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        text: "What is the meaning of \"widespread\"?",
        options: ['faydalı', 'yaygın', 'gerekli', 'zamanında'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"required\"?",
        options: ['yaygın', 'gerekli', 'basit', 'kararlı'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        text: "What is the meaning of \"conceptual\"?",
        options: ['yetenekli', 'gelişmiş', 'kavramsal', 'tutarlı'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"obvious\"?",
        options: ['geçici', 'bariz', 'alışılmadık', 'tutarlı'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"independent\"?",
        options: ['bağımsız', 'önemli', 'rutin', 'yapay'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"large\"?",
        options: ['günlük', 'büyük', 'anormal', 'dış'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"independent\"?",
        options: ['olağanüstü', 'kaçınılmaz', 'bağımsız', 'benzersiz'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"restricted\"?",
        options: ['alışılmadık', 'açık', 'sınırlı', 'sıkı'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"analytical\"?",
        options: ['verimli', 'ısrarcı', 'analitik', 'izole'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 42,
    title: "Sıfatlar Testi 42",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"restricted\"?",
        options: ['gerçek', 'birincil', 'eşdeğer', 'sınırlı'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"insightful\"?",
        options: ['mantıklı', 'anlayışlı', 'kayda değer', 'uygulanabilir'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"temporary\"?",
        options: ['rastgele', 'aynı', 'görünmez', 'geçici'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"optimal\"?",
        options: ['anlayışlı', 'optimal', 'temel', 'geçici'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"capable\"?",
        options: ['yeni', 'yetenekli', 'muhtemel', 'gönüllü'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"consistent\"?",
        options: ['orantılı', 'evrensel', 'verimli', 'tutarlı'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"contemporary\"?",
        options: ['kaçınılmaz', 'sosyal', 'çeşitli', 'çağdaş'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"certain\"?",
        options: ['belirli', 'faydalı', 'benzersiz', 'derin'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"passive\"?",
        options: ['nicel', 'tekrarlayan', 'genel', 'pasif'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"adverse\"?",
        options: ['kapsamlı', 'olumsuz', 'baskın', 'erişilebilir'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 43,
    title: "Sıfatlar Testi 43",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"novel\"?",
        options: ['kayda değer', 'olağanüstü', 'tipik', 'yeni'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"clinical\"?",
        options: ['yeterli', 'klinik', 'tutarlı', 'nadir'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"insightful\"?",
        options: ['gerçek', 'önemli', 'yeni', 'anlayışlı'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"simple\"?",
        options: ['ayrıntılı', 'karmaşık', 'hayati', 'basit'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"analytical\"?",
        options: ['kritik', 'analitik', 'olanak sağlayan', 'deneysel'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"critical\"?",
        options: ['faydalı', 'kritik', 'detaylı', 'kapsamlı'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"routine\"?",
        options: ['kapsamlı', 'alışılmadık', 'zamanında', 'rutin'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"ethical\"?",
        options: ['etik', 'evrensel', 'başlangıç', 'güçlü'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"resilient\"?",
        options: ['sistematik', 'ideal', 'dayanıklı', 'devam eden'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"simple\"?",
        options: ['küçük', 'genel', 'basit', 'yeterli'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 44,
    title: "Sıfatlar Testi 44",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"legitimate\"?",
        options: ['bağımsız', 'yetenekli', 'meşru', 'bağımsız'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"robust\"?",
        options: ['ısrarcı', 'genç', 'kalıcı', 'sağlam'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"insightful\"?",
        options: ['teorik', 'aşırı', 'anlayışlı', 'benzer'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"large\"?",
        options: ['modern', 'büyük', 'sistematik', 'alışılmadık'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"main\"?",
        options: ['önemli', 'önde gelen', 'alışılmadık', 'ana'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"multiple\"?",
        options: ['çoklu', 'rastgele', 'doğru', 'şeffaf'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"feasible\"?",
        options: ['ilgili', 'uygulanabilir', 'bariz', 'orantılı'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"isolated\"?",
        options: ['klinik', 'mantıklı', 'izole', 'detaylı'],
        correctOptionIndex: 2
      },
      {
        id: 9,
        text: "What is the meaning of \"skilled\"?",
        options: ['çoklu', 'yetenekli', 'bireysel', 'büyük'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"critical\"?",
        options: ['ölçülebilir', 'istatistiksel', 'deneysel', 'kritik'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 45,
    title: "Sıfatlar Testi 45",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"extensive\"?",
        options: ['isteğe bağlı', 'tutarlı', 'kapsamlı', 'net'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"unusual\"?",
        options: ['doğru', 'alışılmadık', 'yeni', 'uygun'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"diverse\"?",
        options: ['eşzamanlı', 'etkili', 'ısrarcı', 'çeşitli'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"vital\"?",
        options: ['mantıklı', 'hayati', 'başarılı', 'açık'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"moderate\"?",
        options: ['temel', 'belirli', 'pasif', 'ılımlı'],
        correctOptionIndex: 3
      },
      {
        id: 6,
        text: "What is the meaning of \"radical\"?",
        options: ['köklü', 'hayati', 'son', 'güncel'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"substantial\"?",
        options: ['açık', 'önemli', 'yeni', 'eşzamanlı'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"quantitative\"?",
        options: ['nicel', 'tekrarlayan', 'verimli', 'ilginç'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"adverse\"?",
        options: ['net', 'olumsuz', 'çoklu', 'çağdaş'],
        correctOptionIndex: 1
      },
      {
        id: 10,
        text: "What is the meaning of \"excessive\"?",
        options: ['ana', 'klinik', 'aşırı', 'çeşitli'],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 46,
    title: "Sıfatlar Testi 46",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"adaptable\"?",
        options: ['yeni', 'çeşitli', 'değişken', 'uyumlu'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"outstanding\"?",
        options: ['kalıcı', 'tekrarlayan', 'sınırlı', 'olağanüstü'],
        correctOptionIndex: 3
      },
      {
        id: 3,
        text: "What is the meaning of \"traditional\"?",
        options: ['endüstriyel', 'mantıklı', 'bireysel', 'geleneksel'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"widespread\"?",
        options: ['hemen', 'gerekli', 'yaygın', 'olanak sağlayan'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"accurate\"?",
        options: ['doğru', 'benzersiz', 'yetenekli', 'avantajlı'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"deep\"?",
        options: ['organize edilmiş', 'derin', 'belirli', 'yetenekli'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"unusual\"?",
        options: ['ısrarcı', 'alışılmadık', 'ilgili', 'organize edilmiş'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"isolated\"?",
        options: ['sınırlı', 'objektif', 'tek tip', 'izole'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"influential\"?",
        options: ['verimli', 'olanak sağlayan', 'güçlü', 'etkili'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"initial\"?",
        options: ['rastgele', 'mevcut', 'çok önemli', 'başlangıç'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 47,
    title: "Sıfatlar Testi 47",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"optimal\"?",
        options: ['yetenekli', 'kalıcı', 'organize edilmiş', 'optimal'],
        correctOptionIndex: 3
      },
      {
        id: 2,
        text: "What is the meaning of \"general\"?",
        options: ['genel', 'doğru', 'deneysel', 'birincil'],
        correctOptionIndex: 0
      },
      {
        id: 3,
        text: "What is the meaning of \"restricted\"?",
        options: ['sağlam', 'eşit', 'sınırlı', 'sezgisel'],
        correctOptionIndex: 2
      },
      {
        id: 4,
        text: "What is the meaning of \"reliable\"?",
        options: ['temel', 'çok önemli', 'basit', 'güvenilir'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"similar\"?",
        options: ['benzer', 'sosyal', 'benzer', 'geçici'],
        correctOptionIndex: 0
      },
      {
        id: 6,
        text: "What is the meaning of \"critical\"?",
        options: ['faydalı', 'hayati', 'işlevsel', 'kritik'],
        correctOptionIndex: 3
      },
      {
        id: 7,
        text: "What is the meaning of \"influential\"?",
        options: ['etkili', 'temel', 'tekrarlayan', 'belirli'],
        correctOptionIndex: 0
      },
      {
        id: 8,
        text: "What is the meaning of \"main\"?",
        options: ['zamanında', 'ana', 'kararlı', 'geleneksel'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"unusual\"?",
        options: ['nadir', 'ısrarcı', 'alışılmadık', 'anormal'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"consistent\"?",
        options: ['tutarlı', 'sistematik', 'profesyonel', 'ortaya çıkan'],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 48,
    title: "Sıfatlar Testi 48",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"simple\"?",
        options: ['devam eden', 'sağlam', 'basit', 'kümülatif'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"temporary\"?",
        options: ['hemen', 'acil', 'geçici', 'rutin'],
        correctOptionIndex: 2
      },
      {
        id: 3,
        text: "What is the meaning of \"measurable\"?",
        options: ['görünür', 'objektif', 'tam', 'ölçülebilir'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"significant\"?",
        options: ['duygusal', 'önemli', 'nicel', 'çeşitli'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        text: "What is the meaning of \"reliable\"?",
        options: ['geniş', 'güvenilir', 'anormal', 'evrensel'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"abnormal\"?",
        options: ['değişken', 'varsayımsal', 'anormal', 'yenilikçi'],
        correctOptionIndex: 2
      },
      {
        id: 7,
        text: "What is the meaning of \"daily\"?",
        options: ['izole', 'günlük', 'toplam', 'basit'],
        correctOptionIndex: 1
      },
      {
        id: 8,
        text: "What is the meaning of \"appropriate\"?",
        options: ['uygun', 'baskın', 'derin', 'önceki'],
        correctOptionIndex: 0
      },
      {
        id: 9,
        text: "What is the meaning of \"current\"?",
        options: ['gerçek', 'benzersiz', 'açık', 'güncel'],
        correctOptionIndex: 3
      },
      {
        id: 10,
        text: "What is the meaning of \"primary\"?",
        options: ['evrensel', 'orta', 'yaygın', 'birincil'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 49,
    title: "Sıfatlar Testi 49",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"exact\"?",
        options: ['benzersiz', 'çok önemli', 'tam', 'olağanüstü'],
        correctOptionIndex: 2
      },
      {
        id: 2,
        text: "What is the meaning of \"young\"?",
        options: ['temel', 'genç', 'etkili', 'uzun vadeli'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"gradual\"?",
        options: ['kademeli', 'hemen', 'faydalı', 'alışılmadık'],
        correctOptionIndex: 0
      },
      {
        id: 4,
        text: "What is the meaning of \"successful\"?",
        options: ['merkezi', 'anormal', 'başarılı', 'genç'],
        correctOptionIndex: 2
      },
      {
        id: 5,
        text: "What is the meaning of \"random\"?",
        options: ['anormal', 'rastgele', 'belirli', 'belirli'],
        correctOptionIndex: 1
      },
      {
        id: 6,
        text: "What is the meaning of \"vast\"?",
        options: ['organize edilmiş', 'geniş', 'köklü', 'anormal'],
        correctOptionIndex: 1
      },
      {
        id: 7,
        text: "What is the meaning of \"substantial\"?",
        options: ['örtük', 'anormal', 'önemli', 'görünür'],
        correctOptionIndex: 2
      },
      {
        id: 8,
        text: "What is the meaning of \"professional\"?",
        options: ['eşit', 'profesyonel', 'öznel', 'istikrarlı'],
        correctOptionIndex: 1
      },
      {
        id: 9,
        text: "What is the meaning of \"urgent\"?",
        options: ['genç', 'önemli', 'acil', 'önemli'],
        correctOptionIndex: 2
      },
      {
        id: 10,
        text: "What is the meaning of \"clear\"?",
        options: ['yeterli', 'dramatik', 'iç', 'net'],
        correctOptionIndex: 3
      }
    ]
  },
  {
    id: 50,
    title: "Sıfatlar Testi 50",
    questions: [
      {
        id: 1,
        text: "What is the meaning of \"main\"?",
        options: ['hayati', 'ana', 'odaklanmış', 'olağanüstü'],
        correctOptionIndex: 1
      },
      {
        id: 2,
        text: "What is the meaning of \"voluntary\"?",
        options: ['açık', 'gönüllü', 'anlayışlı', 'özgün'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        text: "What is the meaning of \"exceptional\"?",
        options: ['sınırlı', 'ilgili', 'objektif', 'olağanüstü'],
        correctOptionIndex: 3
      },
      {
        id: 4,
        text: "What is the meaning of \"obvious\"?",
        options: ['zamanında', 'karmaşık', 'ön', 'bariz'],
        correctOptionIndex: 3
      },
      {
        id: 5,
        text: "What is the meaning of \"thorough\"?",
        options: ['basit', 'güvenilir', 'detaylı', 'kademeli'],
        correctOptionIndex: 2
      },
      {
        id: 6,
        text: "What is the meaning of \"excessive\"?",
        options: ['aşırı', 'yeterli', 'gerçekçi', 'deneysel'],
        correctOptionIndex: 0
      },
      {
        id: 7,
        text: "What is the meaning of \"variable\"?",
        options: ['güncel', 'analitik', 'temel', 'değişken'],
        correctOptionIndex: 3
      },
      {
        id: 8,
        text: "What is the meaning of \"social\"?",
        options: ['öne çıkan', 'şeffaf', 'gerçek', 'sosyal'],
        correctOptionIndex: 3
      },
      {
        id: 9,
        text: "What is the meaning of \"equal\"?",
        options: ['eşit', 'geçici', 'zamanında', 'teknik'],
        correctOptionIndex: 0
      },
      {
        id: 10,
        text: "What is the meaning of \"ideal\"?",
        options: ['ideal', 'kültürel', 'önemli', 'içsel'],
        correctOptionIndex: 0
      }
    ]
  }
];
