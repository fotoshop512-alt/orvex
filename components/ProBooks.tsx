import React, { useState, useEffect, useRef } from 'react';
import { Book, ChevronLeft, ChevronRight, X, BookOpen, ArrowLeft, Crown, Lock, Minimize2, Maximize2 } from 'lucide-react';
import CelebrationModal from './CelebrationModal';
import PaymentModal from './PaymentModal';
import BookCover from './BookCover';
import { playSound } from '../utils/sound';
import { BOOK_DICTIONARY } from '../services/dictionary';
import { translateWordWithGroq, generateSentenceExamples } from '../services/groqAI';
import { UserProfile } from '../services/storage';
import { PRO_BOOKS } from '../data/proBooksData';

interface ProBooksProps {
  currentUser: UserProfile | null;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

interface SelectedWord {
  word: string;
  meaning: string;
  x: number;
  y: number;
}

const ProBooks: React.FC<ProBooksProps> = ({ currentUser, onFullscreenChange }) => {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const [loadingMeaning, setLoadingMeaning] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBookInfo, setShowBookInfo] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isPro = currentUser?.isPro || currentUser?.role === 'ADMIN';

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    onFullscreenChange?.(newFullscreenState);
    playSound('click');
  };

  const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    e.stopPropagation();

    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z'-]/g, '');

    if (!cleanWord || cleanWord.length < 2) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;

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

  // Exit fullscreen when chapter is null
  useEffect(() => {
    if (!selectedChapter) {
      setIsFullscreen(false);
    }
  }, [selectedChapter]);

  // Exit fullscreen when chapter is null
  useEffect(() => {
    if (!selectedChapter) {
      setIsFullscreen(false);
    }
  }, [selectedChapter]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClick = () => setSelectedWord(null);
    if (selectedWord) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [selectedWord]);


  const renderTextWithClickableWords = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z'-]/g, '');
      const hasMeaning = BOOK_DICTIONARY[cleanWord];

      if (cleanWord.length >= 2 && word.trim()) {
        return (
          <span
            key={idx}
            onClick={(e) => handleWordClick(e, word)}
            className="cursor-pointer text-gray-950 font-semibold hover:text-black hover:bg-black/5 rounded px-0.5 transition-colors"
          >
            {word}
          </span>
        );
      }
      return <span key={idx} className="text-gray-800">{word}</span>;
    });
  };

  // Book List View
  if (!selectedBook) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-6 pt-safe">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold mb-4">
              <Crown size={14} />
              PRO İçerik
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Pro Kitaplar</h1>
            <p className="text-white/60">Akademik İngilizce okuma materyalleri - Kelimelere tıklayarak anlamlarını öğrenin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRO_BOOKS.map((book) => {
              const isLocked = book.id > 1 && !isPro;

              return (
                <button
                  key={book.id}
                  onClick={() => {
                    if (isLocked) {
                      setShowPaymentModal(true);
                    } else {
                      setShowBookInfo(book);
                      playSound('click');
                    }
                  }}
                  className={`bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-left transition-all group relative ${isLocked ? 'opacity-75' : ''}`}
                >
                  {/* Lock Badge */}
                  {isLocked && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 z-10">
                      <Lock size={12} className="text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider">PRO</span>
                    </div>
                  )}
                  {/* Free Badge for first book */}
                  {book.id === 1 && !isPro && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 z-10">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">ÜCRETSİZ</span>
                    </div>
                  )}
                  {/* Pro Crown */}
                  {isPro && (
                    <div className="absolute top-3 right-3 z-10">
                      <Crown size={16} className="text-amber-400" />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    {book.coverStyle ? (
                      <BookCover
                        title={book.title}
                        author={book.author}
                        style={book.coverStyle}
                        image={book.image}
                        size="large"
                        className="shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-3xl shrink-0 shadow-lg">
                        {book.cover}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${book.level === 'B1' ? 'bg-emerald-500/20 text-emerald-400' :
                          book.level === 'B2' ? 'bg-blue-500/20 text-blue-400' :
                            book.level === 'C1' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-amber-500/20 text-amber-400'
                          }`}>
                          {book.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{book.title}</h3>
                      <p className="text-white/50 text-sm mb-2">{book.author}</p>
                      <p className="text-white/40 text-xs line-clamp-2">{book.description}</p>
                      <div className="flex items-center gap-1 text-white/30 text-xs mt-2">
                        <BookOpen size={12} />
                        <span>{book.chapters.length} Bölüm</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && currentUser && (
          <PaymentModal
            user={currentUser}
            onClose={() => setShowPaymentModal(false)}
          />
        )}

        {/* Book Info Modal */}
        {showBookInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1b2e] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Cover Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                {showBookInfo.coverStyle ? (
                  <div className="w-full h-full transform scale-150">
                    <BookCover
                      title={showBookInfo.title}
                      author={showBookInfo.author}
                      style={showBookInfo.coverStyle}
                      image={showBookInfo.image}
                      size="large"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-6xl">
                    {showBookInfo.cover}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b2e] via-[#1a1b2e]/20 to-transparent" />

                <button
                  onClick={() => { playSound('click'); setShowBookInfo(null); }}
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
                      {showBookInfo.description}
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
                      <span className="text-sm font-medium">{showBookInfo.chapters.length} Bölüm</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Crown size={16} className="text-amber-400" />
                      <span className="text-sm font-medium">Pro</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { playSound('click'); setShowBookInfo(null); }}
                    className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(showBookInfo);
                      setShowBookInfo(null);
                      playSound('click');
                    }}
                    className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                  >
                    <BookOpen size={20} />
                    Okumaya Başla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Chapter List View
  if (!selectedChapter) {
    return (
      <div className="h-full overflow-y-auto pt-safe p-4 md:p-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => {
              setSelectedBook(null);
              playSound('click');
            }}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} />
            Kitaplara Dön
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <BookCover
                title={selectedBook.title}
                author={selectedBook.author}
                style={selectedBook.coverStyle}
                image={selectedBook.image || undefined}
                size="medium"
                className="shrink-0 shadow-lg"
              />
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${selectedBook.level === 'B1' ? 'bg-emerald-500/20 text-emerald-400' :
                  selectedBook.level === 'B2' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                  Seviye {selectedBook.level}
                </span>
                <h1 className="text-2xl font-bold text-white mb-1">{selectedBook.title}</h1>
                <p className="text-white/60 text-sm mb-2">{selectedBook.author}</p>
                <p className="text-white/40 text-sm">{selectedBook.description}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mb-4">Bölümler</h2>
          <div className="space-y-2">
            {selectedBook.chapters.map((chapter: any, idx: number) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setSelectedChapter(chapter);
                  playSound('click');
                }}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-white font-medium">{chapter.title}</span>
                </div>
                <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 transition" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Reading View
  const currentChapterIdx = selectedBook.chapters.findIndex((c: any) => c.id === selectedChapter.id);
  const hasPrevChapter = currentChapterIdx > 0;
  const hasNextChapter = currentChapterIdx < selectedBook.chapters.length - 1;

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-[#fdfaf3]' : 'bg-slate-950'}`}>
      {/* Header - hidden in fullscreen for cleaner page view */}
      {!isFullscreen && (
        <div className="bg-slate-900/95 backdrop-blur-sm border-b border-white/5 p-3 pt-safe transition-all duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Left: Previous chapter button */}
            <button
              onClick={() => {
                setSelectedChapter(selectedBook.chapters[currentChapterIdx - 1]);
                contentRef.current?.scrollTo(0, 0);
                playSound('click');
              }}
              disabled={!hasPrevChapter}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Center: Chapter indicator and title */}
            <div className="flex-1 text-center mx-2">
              <h2 className="text-white font-bold text-sm truncate max-w-[180px] sm:max-w-[300px]">
                {selectedChapter.title}
              </h2>
              <div className="flex items-center justify-center gap-3 mt-0.5">
                <button
                  onClick={() => {
                    setSelectedChapter(selectedBook.chapters[currentChapterIdx - 1]);
                    contentRef.current?.scrollTo(0, 0);
                    playSound('click');
                  }}
                  disabled={!hasPrevChapter}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-white/60 text-xs font-medium min-w-[60px]">
                  Bölüm {currentChapterIdx + 1} / {selectedBook.chapters.length}
                </span>
                <button
                  onClick={() => {
                    setSelectedChapter(selectedBook.chapters[currentChapterIdx + 1]);
                    contentRef.current?.scrollTo(0, 0);
                    playSound('click');
                  }}
                  disabled={!hasNextChapter}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: Next chapter button and fullscreen toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedChapter(selectedBook.chapters[currentChapterIdx + 1]);
                  contentRef.current?.scrollTo(0, 0);
                  playSound('click');
                }}
                disabled={!hasNextChapter}
                className="p-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={() => {
                  setSelectedChapter(null);
                  playSound('click');
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition"
                title="Tam Ekran"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating controls for fullscreen */}
      {isFullscreen && (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
          <div
            className="flex items-center justify-end px-4 pt-3"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 12px) + 8px)' }}
          >
            <button
              onClick={toggleFullscreen}
              className="pointer-events-auto bg-black/10 text-slate-800 hover:bg-black/15 border border-black/10 p-3 rounded-full shadow-md backdrop-blur-sm active:scale-95"
              aria-label="Tam ekrandan çık"
              style={{ touchAction: 'manipulation' }}
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>
      )}


      {/* Content */}
      <div
        ref={contentRef}
        className={`flex-1 overflow-y-auto custom-scrollbar ${isFullscreen ? 'p-6 md:p-12 pt-safe bg-[#fdfaf3]' : 'p-4 md:p-6 pt-safe pb-28'}`}
        onClick={() => setSelectedWord(null)}
      >
        <div className={`mx-auto ${isFullscreen ? 'max-w-2xl' : 'max-w-3xl'}`}>
          <div className="bg-[#fdfaf3] border border-black/5 shadow-2xl shadow-black/30 rounded-[20px] px-6 md:px-10 py-10 md:py-12 relative">
            <div className="prose prose-lg max-w-none text-gray-900">
              {selectedChapter.content.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className={`leading-relaxed mb-6 ${isFullscreen ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
                  {renderTextWithClickableWords(paragraph)}
                </p>
              ))}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.22em] uppercase text-black/30 font-semibold select-none">
              Chapter {currentChapterIdx + 1}
            </div>
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

      {/* Navigation */}
      <div className={`${isFullscreen ? 'absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4' : 'bg-slate-900/95 border-t border-white/5 p-4'}`}>
        <div className={`${isFullscreen ? 'max-w-3xl w-full flex items-center justify-between' : 'max-w-3xl mx-auto flex items-center justify-between gap-3'}`}>
          <button
            onClick={() => {
              setSelectedChapter(selectedBook.chapters[currentChapterIdx - 1]);
              contentRef.current?.scrollTo(0, 0);
              playSound('click');
            }}
            disabled={!hasPrevChapter}
            className={`${isFullscreen ? 'p-3 rounded-full bg-white/90 border border-black/10 shadow-xl text-slate-800 disabled:opacity-30' : 'p-3 rounded-xl bg-slate-800 text-white disabled:opacity-30'} transition flex items-center justify-center`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => {
              setSelectedChapter(null);
              playSound('click');
            }}
            className={`${isFullscreen ? 'px-5 py-3 rounded-full bg-white/90 border border-black/10 shadow-xl text-slate-800 hover:bg-white' : 'px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white'} transition flex items-center gap-2`}
          >
            <X size={20} />
            <span className="hidden sm:inline">Kapat</span>
          </button>

          <button
            onClick={() => {
              setSelectedChapter(selectedBook.chapters[currentChapterIdx + 1]);
              contentRef.current?.scrollTo(0, 0);
              playSound('click');
            }}
            disabled={!hasNextChapter}
            className={`${isFullscreen ? 'p-3 rounded-full bg-white/90 border border-black/10 shadow-xl text-slate-800 disabled:opacity-30' : 'p-3 rounded-xl bg-slate-800 text-white disabled:opacity-30'} transition flex items-center justify-center`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProBooks;