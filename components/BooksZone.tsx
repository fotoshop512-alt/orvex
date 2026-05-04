import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, X, BookOpen, Clock, BarChart } from 'lucide-react';
import CelebrationModal from './CelebrationModal';
import { LEVEL_A_BOOKS } from '../data/booksLevelA';
import { LEVEL_B_BOOKS } from '../data/booksLevelB';
import { LEVEL_C_BOOKS } from '../data/booksLevelC';
import { playSound } from '../utils/sound';
import { BOOK_DICTIONARY } from '../services/dictionary';
import { translateWordWithGroq, generateSentenceExamples } from '../services/groqAI';

import { UserProfile, storageService } from '../services/storage';

interface BooksZoneProps {
  currentUser: UserProfile | null;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

// Kitap Kapakları Haritası
const BOOK_COVERS: Record<string, Record<number, string>> = {
  A: {
    1: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600", // Kedi
    2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600", // Plaj
    3: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600", // Okul
    4: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600", // Bahçe
    5: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600", // Birthday Party
    6: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600", // Robot
    7: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600", // Yağmur
    8: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&q=80&w=600", // Yunus
    9: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=600", // Pasta
    10: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600", // Yıldızlar
  },
  B: {
    1: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=600", // Saat
    2: "https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&q=80&w=600", // Avrupa/Harita
    3: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", // The Great Invention/Technology
    4: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600", // Antik Şehir
    5: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600", // Paris
    6: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600", // Orman/Kamp
    7: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600", // Kamera
    8: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=600", // The Great Invention
    9: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600", // Tokyo
    10: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80&w=600", // Mektup
  },
  C: {
    1: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600", // Konuşma/İletişim
    2: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600", // Fizik/Atom
    3: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600", // Roma
    4: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600", // Beyin
    5: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600", // Global Economics
    6: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600", // Nörobilim
    7: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600", // Felsefe/Kitap
    8: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600", // İklim/Dünya
    9: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600", // AI
    10: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600", // Genetik
    11: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600", // Uzay
    12: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600", // Hukuk/Politika
    13: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&q=80&w=600", // Arkeoloji
    14: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600", // Biyokimya
    15: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600", // Literary Criticism
  }
};

const getBookCover = (level: string, id: number) => {
  return BOOK_COVERS[level]?.[id] || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"; // Varsayılan kitap görseli
};


export default function BooksZone({ currentUser, onFullscreenChange }: BooksZoneProps) {
  const [selectedLevel, setSelectedLevel] = useState<'A' | 'B' | 'C'>('A');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<number, number>>({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showBookInfo, setShowBookInfo] = useState<any>(null);

  const renderTextWithClickableWords = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z'-]/g, '');

      if (cleanWord.length >= 2 && word.trim()) {
        return (
          <span
            key={idx}
            onClick={(e) => handleWordClick(e, word)}
            onTouchStart={(e) => handleWordClick(e, word)}
            className="cursor-pointer text-gray-950 font-semibold hover:text-black hover:bg-black/5 rounded px-0.5 transition-colors"
          >
            {word}
          </span>
        );
      }

      return <span key={idx} className="text-gray-800">{word}</span>;
    });
  };

  // Word translation states
  const [selectedWord, setSelectedWord] = useState<{ word: string, meaning: string, x: number, y: number } | null>(null);
  const [loadingMeaning, setLoadingMeaning] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const progress = await storageService.getUserProgress(currentUser.uid, 'bookProgress');
        if (progress) {
          setUserProgress(progress);
        }
      }
    };
    loadProgress();
  }, [currentUser]);

  // Manage fullscreen state
  useEffect(() => {
    onFullscreenChange?.(!!selectedBook);
    return () => onFullscreenChange?.(false);
  }, [selectedBook, onFullscreenChange]);

  // Allow exiting reading view with ESC for keyboard users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedBook) {
        setSelectedBook(null);
        playSound('click');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedBook]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClick = () => setSelectedWord(null);
    if (selectedWord) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [selectedWord]);

  const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>, word: string) => {
    e.stopPropagation();

    // Clean the word (remove punctuation)
    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z'-]/g, '');

    if (!cleanWord || cleanWord.length < 2) return;

    // Handle both mouse and touch events
    let x: number, y: number;
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX;
      y = e.touches[0].clientY - 10;
    } else {
      // Mouse event
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top - 10;
    }

    // 1. Look up in dictionary (Internal)
    const dictionaryMeaning = BOOK_DICTIONARY[cleanWord];

    if (dictionaryMeaning) {
      setSelectedWord({
        word: cleanWord,
        meaning: dictionaryMeaning,
        x,
        y
      });
      playSound('click');
      return;
    }

    // 2. Ask AI (Groq) if not in dictionary - get only meaning
    setLoadingMeaning(true);
    setSelectedWord({
      word: cleanWord,
      meaning: 'Çevriliyor...',
      x,
      y
    });

    try {
      const aiMeaning = await translateWordWithGroq(cleanWord);
      if (aiMeaning) {
        setSelectedWord({
          word: cleanWord,
          meaning: aiMeaning,
          x,
          y
        });
        playSound('click');
      } else {
        setSelectedWord({
          word: cleanWord,
          meaning: 'Bulunamadı',
          x,
          y
        });
      }
    } catch (err) {
      setSelectedWord({
        word: cleanWord,
        meaning: 'Hata',
        x,
        y
      });
    } finally {
      setLoadingMeaning(false);
    }
  };

  const onUpdateProgress = async (bookId: number, page: number) => {
    if (!currentUser) return;
    const newProgress = { ...userProgress, [bookId]: page };
    setUserProgress(newProgress);
    await storageService.saveUserProgress(currentUser.uid, 'bookProgress', newProgress);
  };

  const currentBooks = selectedLevel === 'A' ? LEVEL_A_BOOKS : selectedLevel === 'B' ? LEVEL_B_BOOKS : LEVEL_C_BOOKS;

  // ... (Geri kalan kod aynı, sadece render kısmında getBookCover kullanılıyor)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < selectedBook.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }

    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };



  if (selectedBook) {
    const page = selectedBook.pages[currentPage];
    const progress = Math.round(((currentPage + 1) / selectedBook.pages.length) * 100);

    return (
      <div className="fixed inset-0 z-50 bg-[#fdfaf3] text-slate-900 flex flex-col h-full animate-in fade-in duration-300">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-[#fdfaf3]/95 backdrop-blur-xl pt-safe"
        >
          {/* Left: Previous page button */}
          <button
            onClick={() => {
              playSound('page');
              setCurrentPage(prev => Math.max(0, prev - 1));
            }}
            disabled={currentPage === 0}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Center: Page indicator and title */}
          <div className="flex-1 text-center mx-2">
            <h3 className="text-slate-900 font-bold truncate text-sm">{selectedBook.title}</h3>
            <div className="flex items-center justify-center gap-3 mt-1">
              <button
                onClick={() => {
                  playSound('page');
                  setCurrentPage(prev => Math.max(0, prev - 1));
                }}
                disabled={currentPage === 0}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-slate-500 text-xs font-medium min-w-[60px]">
                {currentPage + 1} / {selectedBook.pages.length}
              </span>
              <button
                onClick={() => {
                  playSound('page');
                  if (currentPage < selectedBook.pages.length - 1) {
                    setCurrentPage(prev => prev + 1);
                    onUpdateProgress(selectedBook.id, currentPage + 2);
                  } else {
                    // Book Completed!
                    const isAlreadyCompleted = userProgress[selectedBook.id] === selectedBook.pages.length;

                    // Mark as completed
                    onUpdateProgress(selectedBook.id, selectedBook.pages.length);

                    // Award points only if not already completed
                    if (!isAlreadyCompleted) {
                      const points = 50; // 50 points per book
                      setEarnedPoints(points);

                      if (currentUser) {
                        const newTotalScore = (currentUser.score || 0) + points;
                        storageService.updateUserScore(currentUser.uid, newTotalScore);
                      }
                      setShowCongrats(true);
                    }

                    setSelectedBook(null);
                  }
                }}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-slate-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Close button and next page button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('page');
                if (currentPage < selectedBook.pages.length - 1) {
                  setCurrentPage(prev => prev + 1);
                  onUpdateProgress(selectedBook.id, currentPage + 2);
                } else {
                  // Book Completed!
                  const isAlreadyCompleted = userProgress[selectedBook.id] === selectedBook.pages.length;

                  // Mark as completed
                  onUpdateProgress(selectedBook.id, selectedBook.pages.length);

                  // Award points only if not already completed
                  if (!isAlreadyCompleted) {
                    const points = 50; // 50 points per book
                    setEarnedPoints(points);

                    if (currentUser) {
                      const newTotalScore = (currentUser.score || 0) + points;
                      storageService.updateUserScore(currentUser.uid, newTotalScore);
                    }
                    setShowCongrats(true);
                  }

                  setSelectedBook(null);
                }
              }}
              className="p-2 bg-slate-800 text-white hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={() => setSelectedBook(null)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-800"
            >
              <X className="text-slate-800" size={22} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-black/5 w-full">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>


        {/* Floating next page control */}
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div
            className="flex items-center justify-end px-4 pt-3"
            style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 50px)' }}
          >
            <button
              onClick={() => {
                playSound('page');
                if (currentPage < selectedBook.pages.length - 1) {
                  setCurrentPage(prev => prev + 1);
                  onUpdateProgress(selectedBook.id, currentPage + 2);
                } else {
                  // Book Completed!
                  const isAlreadyCompleted = userProgress[selectedBook.id] === selectedBook.pages.length;

                  // Mark as completed
                  onUpdateProgress(selectedBook.id, selectedBook.pages.length);

                  // Award points only if not already completed
                  if (!isAlreadyCompleted) {
                    const points = 50; // 50 points per book
                    setEarnedPoints(points);

                    if (currentUser) {
                      const newTotalScore = (currentUser.score || 0) + points;
                      storageService.updateUserScore(currentUser.uid, newTotalScore);
                    }
                    setShowCongrats(true);
                  }

                  setSelectedBook(null);
                }
                playSound('click');
              }}
              className="pointer-events-auto bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-500 p-3 rounded-full shadow-md backdrop-blur-sm active:scale-95"
              aria-label="Sonraki sayfa"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6 pt-20 flex flex-col items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setSelectedWord(null)}
        >
          <div className="w-full max-w-2xl bg-[#fdfaf3] border border-black/5 rounded-[20px] p-6 md:p-10 shadow-2xl shadow-black/20 min-h-[60vh] relative">
            {/* Page Content */}
            <div className="prose prose-lg max-w-none text-gray-900 font-serif">
              {page.content.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="text-lg md:text-xl leading-relaxed mb-5 last:mb-0">
                  {renderTextWithClickableWords(paragraph)}
                </p>
              ))}
            </div>

            {/* Page Number */}
            <div className="absolute bottom-4 right-6 text-black/35 text-sm font-mono tracking-[0.12em]">
              {currentPage + 1}
            </div>
          </div>
        </div>

        {/* Word Tooltip */}
        {selectedWord && (
          <div
            className="fixed z-[60] pointer-events-none"
            style={{
              left: selectedWord.x,
              top: selectedWord.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-slate-800 border border-white/20 rounded-xl px-4 py-3 shadow-2xl pointer-events-auto animate-fadeIn">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-indigo-400 font-bold text-sm">{selectedWord.word}</p>
                  <p className="text-white text-base">{selectedWord.meaning}</p>
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="text-white/40 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Arrow */}
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800" />
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="p-4 safe-bottom bg-[#fdfaf3]/95 backdrop-blur-xl border-t border-black/5">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <button
              onClick={() => {
                setSelectedBook(null);
                playSound('click');
              }}
              className="py-3 px-6 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-white font-medium shadow-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <X size={20} />
              Kitabı Kapat
            </button>
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 h-full overflow-y-auto p-4 md:p-6">
      {showCongrats && (
        <CelebrationModal
          type="book"
          title="Kitap Bitti!"
          subtitle="Harika! Bir kitabı daha bitirdin."
          points={earnedPoints}
          onClose={() => setShowCongrats(false)}
          colorTheme="amber"
        />
      )}
      {/* Level Selector */}
      <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
        {(['A', 'B', 'C'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${selectedLevel === level
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            Seviye {level}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBooks.map((book, index) => {
          const bookNum = index + 1;
          const isCompleted = userProgress?.[book.id] === book.pages.length;
          const progress = userProgress?.[book.id] || 0;
          const progressPercent = Math.round((progress / book.pages.length) * 100);

          return (
            <button
              key={book.id}
              onClick={() => {
                setShowBookInfo(book);
                playSound('click');
              }}
              className="group relative flex flex-col text-left"
            >
              {/* Book Cover */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/10 mb-3 bg-[#1a1b2e]">
                {/* Book Cover Image */}
                <img
                  src={getBookCover(selectedLevel, book.id)}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${book.coverColor.replace('from-', 'from-black/80 via-black/40 to-transparent').replace('to-', '')} opacity-90`} />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm mb-2 border border-white/10">
                      SEVİYE {book.level}
                    </span>
                    <h3 className="text-white font-bold leading-tight line-clamp-2 mb-1 drop-shadow-md">
                      {book.title}
                    </h3>
                    <p className="text-white/60 text-xs flex items-center gap-1.5">
                      <BookOpen size={12} />
                      {book.pages.length} Sayfa
                    </p>
                  </div>
                </div>

                {/* Progress Indicator */}
                {progress > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/50">
                    <div
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12 border border-white/20">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Book Info Modal */}
      {showBookInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1a1b2e] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Cover Image */}
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={getBookCover(selectedLevel, showBookInfo.id)}
                alt={showBookInfo.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${showBookInfo.coverColor?.replace('from-', 'from-black/90 via-black/40 to-transparent').replace('to-', '') || 'from-black/90 to-transparent'}`} />

              <button
                onClick={() => setShowBookInfo(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Details */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-1">{showBookInfo.title}</h3>
              {showBookInfo.turkishTitle && (
                <p className="text-indigo-400 font-medium mb-4">{showBookInfo.turkishTitle}</p>
              )}

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Hakkında</h4>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {showBookInfo.description || (selectedLevel === 'A' ? "A beginner level English reader." : selectedLevel === 'B' ? "An intermediate level English reader." : "An advanced academic English reader.")}
                  </p>
                </div>

                {showBookInfo.turkishDescription && (
                  <div>
                    <h4 className="text-indigo-400/40 text-xs font-bold uppercase tracking-wider mb-1">Türkçe Özet</h4>
                    <p className="text-indigo-300/80 leading-relaxed text-sm italic">
                      {showBookInfo.turkishDescription}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-white/60">
                    <BookOpen size={16} className="text-indigo-400" />
                    <span className="text-sm font-medium">{showBookInfo.pages.length} Sayfa</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <BarChart size={16} className="text-indigo-400" />
                    <span className="text-sm font-medium">Seviye {showBookInfo.level}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookInfo(null)}
                  className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    const progress = userProgress?.[showBookInfo.id] || 1;
                    setSelectedBook(showBookInfo);
                    setCurrentPage(Math.min(progress - 1, showBookInfo.pages.length - 1));
                    setShowBookInfo(null);
                    playSound('click');
                  }}
                  className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                >
                  <BookOpen size={20} />
                  {userProgress?.[showBookInfo.id] ? 'Kaldığın Yerden Devam Et' : 'Okumaya Başla'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
