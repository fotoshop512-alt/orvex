
import React, { useState, useEffect } from 'react';
import { STATIC_VOCAB_LIST } from '../data/vocabData';
import { VocabCard } from '../types';
import { VOCAB_TESTS } from '../data/vocabQuizData';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Volume2, RefreshCw, Layers, Gamepad2, BrainCircuit, Loader2, BookOpen, ChevronRight, Lock, HelpCircle, Trash2 } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { storageService, UserProfile } from '../services/storage';
import { playSound } from '../utils/sound';

type Tab = 'CARDS' | 'MATCH' | 'QUIZ' | 'UNKNOWN';

interface VocabularyProps {
    currentUser: UserProfile | null;
}

const Vocabulary: React.FC<VocabularyProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<Tab>('CARDS');
    const [cards] = useState<VocabCard[]>(STATIC_VOCAB_LIST);
    const [showPayment, setShowPayment] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    const isPro = currentUser?.isPro || currentUser?.role === 'ADMIN';

    // --- UNKNOWN WORDS STATE ---
    const [unknownWordIds, setUnknownWordIds] = useState<number[]>([]);
    const [unknownPulse, setUnknownPulse] = useState(false);

    // --- FLASHCARDS STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardDirection, setCardDirection] = useState<'next' | 'prev' | null>(null);

    // --- MATCHING GAME STATE ---
    const [matchItems, setMatchItems] = useState<{ id: string, text: string, type: 'eng' | 'tr', originalId: number }[]>([]);
    const [selectedItem, setSelectedItem] = useState<{ id: string, type: 'eng' | 'tr', originalId: number } | null>(null);
    const [matchedIds, setMatchedIds] = useState<number[]>([]);
    const [wrongMatch, setWrongMatch] = useState(false);
    const [matchPage, setMatchPage] = useState(1);

    // --- QUIZ LIST STATE ---
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
    const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [quizUserAnswers, setQuizUserAnswers] = useState<Record<number, number>>({});
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);

    // --- INIT LOGIC & PROGRESS LOAD ---
    useEffect(() => {
        if (currentUser) {
            setIsLoadingProgress(true);
            // Load Vocab Index
            storageService.getUserProgress(currentUser.uid, 'vocabIndex')
                .then(val => {
                    if (typeof val === 'number' && val >= 0 && val < cards.length) {
                        setCurrentIndex(val);
                    }
                })
                .catch(err => console.error("Progress load error:", err));

            // Load Unknown Words
            storageService.getUserProgress(currentUser.uid, 'unknownVocabIds').then(val => {
                if (Array.isArray(val)) setUnknownWordIds(val);
            });

            // Load Match Page
            storageService.getUserProgress(currentUser.uid, 'matchPageIndex').then(val => {
                if (typeof val === 'number' && val >= 1) {
                    setMatchPage(val);
                    // If we are already on MATCH tab, we might need to re-init
                    if (activeTab === 'MATCH') initMatchGame(val);
                }
            });

            // Load Quizzes
            storageService.getUserProgress(currentUser.uid, 'completedVocabQuizzes').then(val => {
                if (Array.isArray(val)) setCompletedQuizzes(val);
                setIsLoadingProgress(false);
            });
        } else {
            setIsLoadingProgress(false);
        }
    }, [currentUser, cards.length]);

    const saveProgress = (index: number) => {
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, 'vocabIndex', index);
        }
    };

    const saveUnknownWords = (newIds: number[]) => {
        setUnknownWordIds(newIds);
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, 'unknownVocabIds', newIds);
        }
    };

    const markAsUnknown = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentCardId = cards[currentIndex].id;

        if (currentCardId && !unknownWordIds.includes(currentCardId)) {
            const newIds = [...unknownWordIds, currentCardId];
            saveUnknownWords(newIds);
        }
        setUnknownPulse(true);
        setTimeout(() => setUnknownPulse(false), 320);
        nextCard();
    };

    const removeFromUnknown = (id: number) => {
        const newIds = unknownWordIds.filter(uid => uid !== id);
        saveUnknownWords(newIds);
    };

    const saveQuizCompletion = (quizId: number) => {
        if (currentUser) {
            const newList = [...completedQuizzes, quizId];
            const unique = Array.from(new Set(newList));
            setCompletedQuizzes(unique);
            storageService.saveUserProgress(currentUser.uid, 'completedVocabQuizzes', unique);
        }
    }

    // --- FLASHCARD LOGIC ---
    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            if (currentIndex >= 49 && !isPro) {
                setShowPayment(true);
                return;
            }
            setCardDirection('next');
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setIsFlipped(false);
            saveProgress(newIndex);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCardDirection('prev');
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setIsFlipped(false);
            saveProgress(newIndex);
        }
    };

    const flipCard = () => setIsFlipped(!isFlipped);

    const speak = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    // --- MATCHING GAME LOGIC ---
    const MATCH_ITEMS_PER_PAGE = 6;

    const initMatchGame = (page: number = matchPage) => {
        // UPDATED LOCK CONDITION: Page 15
        if (page > 15 && !isPro) {
            setShowPayment(true);
            return;
        }

        const startIndex = (page - 1) * MATCH_ITEMS_PER_PAGE;
        if (startIndex >= cards.length) return;

        const slice = cards.slice(startIndex, startIndex + MATCH_ITEMS_PER_PAGE);

        const items: { id: string, text: string, type: 'eng' | 'tr', originalId: number }[] = [];
        slice.forEach((card, idx) => {
            items.push({ id: `e-${idx}`, text: card.word, type: 'eng', originalId: card.id! });
            items.push({ id: `t-${idx}`, text: card.turkishTranslation, type: 'tr', originalId: card.id! });
        });

        setMatchItems(items.sort(() => 0.5 - Math.random()));
        setMatchedIds([]);
        setSelectedItem(null);
        setWrongMatch(false);
    };

    const handleMatchPageChange = (direction: 'next' | 'prev') => {
        const newPage = direction === 'next' ? matchPage + 1 : matchPage - 1;
        if (newPage < 1) return;

        // UPDATED LOCK CONDITION: Page 15
        if (newPage > 15 && !isPro) {
            setShowPayment(true);
            return;
        }

        setMatchPage(newPage);
        initMatchGame(newPage);

        // Save match progress
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, 'matchPageIndex', newPage);
        }
    }

    const handleMatchClick = (item: typeof matchItems[0]) => {
        if (wrongMatch) {
            setWrongMatch(false);
            setSelectedItem(null);
        }
        if (matchedIds.includes(item.originalId)) return;

        if (!selectedItem) {
            setSelectedItem(item);
        } else {
            if (selectedItem.id === item.id) {
                setSelectedItem(null);
            } else if (selectedItem.type === item.type) {
                setSelectedItem(item);
            } else {
                if (selectedItem.originalId === item.originalId) {
                    setMatchedIds(prev => [...prev, item.originalId]);
                    setSelectedItem(null);
                } else {
                    setWrongMatch(true);
                    setTimeout(() => {
                        setWrongMatch(false);
                        setSelectedItem(null);
                    }, 1000);
                }
            }
        }
    };

    // --- QUIZ LIST LOGIC ---
    const startQuiz = (testId: number) => {
        if (testId > 10 && !isPro) {
            setShowPayment(true);
            return;
        }

        setSelectedQuizId(testId);
        setQuizQuestionIndex(0);
        setQuizScore(0);
        setQuizUserAnswers({});
        setIsQuizFinished(false);
    };

    const handleQuizAnswer = (optIndex: number) => {
        const currentTest = VOCAB_TESTS.find(t => t.id === selectedQuizId);
        if (!currentTest) return;

        const currentQ = currentTest.questions[quizQuestionIndex];

        setQuizUserAnswers(prev => ({ ...prev, [quizQuestionIndex]: optIndex }));
        if (optIndex === currentQ.correctOptionIndex) {
            setQuizScore(prev => prev + 1);
        }
    };

    const nextQuizQuestion = () => {
        const currentTest = VOCAB_TESTS.find(t => t.id === selectedQuizId);
        if (!currentTest) return;

        if (quizQuestionIndex < currentTest.questions.length - 1) {
            setQuizQuestionIndex(prev => prev + 1);
        } else {
            setIsQuizFinished(true);
            if (selectedQuizId) saveQuizCompletion(selectedQuizId);
        }
    };

    useEffect(() => {
        if (activeTab === 'MATCH') initMatchGame(matchPage);
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {showPayment && <PaymentModal user={currentUser} onClose={() => setShowPayment(false)} />}

            <div className="bg-white border-b border-slate-200 px-4 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm z-10 gap-3">
                <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto scrollbar-hide">
                    <button
                        onClick={() => { playSound('click'); setActiveTab('CARDS'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'CARDS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Layers size={16} /> Kartlar
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('MATCH'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'MATCH' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Gamepad2 size={16} /> Eşleştirme
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('QUIZ'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'QUIZ' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BrainCircuit size={16} /> Testler
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('UNKNOWN'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'UNKNOWN' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <HelpCircle size={16} /> Bilmediklerim
                        {unknownWordIds.length > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unknownWordIds.length}</span>}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-grid-slate">

                {/* --- CARD VIEW --- */}
                {activeTab === 'CARDS' && (
                    isLoadingProgress ? (
                        <div className="flex flex-col items-center justify-center text-indigo-600 h-full">
                            <Loader2 size={48} className="animate-spin mb-4" />
                            <p className="font-medium animate-pulse">Kartlar yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-md perspective-1000 self-center flex flex-col items-center animate-fadeIn">
                            <div
                                className={`relative w-full h-96 transition-all duration-500 preserve-3d cursor-pointer group ${cardDirection === 'next' ? 'card-anim-next' : ''} ${cardDirection === 'prev' ? 'card-anim-prev' : ''}`}
                                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                onClick={flipCard}
                            >
                                {/* FRONT */}
                                <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden hover:shadow-2xl transition">
                                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 bg-indigo-50 px-2 py-1 rounded">Kelime #{cards[currentIndex].id}</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 text-center mb-6">{cards[currentIndex].word}</h2>
                                    <button
                                        onClick={(e) => speak(e, cards[currentIndex].word)}
                                        className="p-4 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110 transition mb-4 shadow-sm"
                                    >
                                        <Volume2 size={32} />
                                    </button>
                                    <p className="absolute bottom-6 text-slate-400 text-sm animate-pulse font-medium">Çeviri için karta dokun</p>
                                </div>

                                {/* BACK */}
                                <div
                                    className="absolute inset-0 w-full h-full bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden text-white"
                                    style={{ transform: 'rotateY(180deg)' }}
                                >
                                    <h3 className="text-3xl font-bold mb-2 text-center">{cards[currentIndex].turkishTranslation}</h3>
                                    <div className="w-16 h-1 bg-white/30 rounded-full mb-6"></div>

                                    <div className="text-center space-y-4 w-full">
                                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                            <span className="text-indigo-200 text-xs font-bold uppercase block mb-1">Eş Anlamlılar</span>
                                            <p className="font-medium">{cards[currentIndex].synonyms.join(', ')}</p>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                            <span className="text-indigo-200 text-xs font-bold uppercase block mb-1">Örnek Cümle</span>
                                            <p className="italic text-indigo-100 leading-relaxed text-sm">"{cards[currentIndex].exampleSentence}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="w-full grid grid-cols-4 gap-3 mt-8">
                                <button
                                    onClick={() => { playSound('click'); prevCard(); }}
                                    disabled={currentIndex === 0}
                                    className="col-span-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm btn-press flex items-center justify-center"
                                >
                                    <ArrowLeft size={24} />
                                </button>

                                {/* Unknown Button - Fixed and Prominent */}
                                <button
                                    onClick={(e) => { playSound('click'); markAsUnknown(e); }}
                                    className={`col-span-2 py-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition flex items-center justify-center gap-2 text-sm shadow-sm btn-press ${unknownPulse ? 'unknown-wave' : ''}`}
                                >
                                    <HelpCircle size={20} />
                                    <span>Bilmiyorum</span>
                                </button>

                                {/* Next Button */}
                                <button
                                    onClick={() => { playSound('click'); nextCard(); }}
                                    className={`col-span-1 py-4 rounded-2xl text-white transition shadow-lg flex items-center justify-center gap-2 btn-press ${currentIndex >= 49 && !isPro
                                        ? 'bg-amber-500 hover:bg-amber-600'
                                        : 'bg-slate-900 hover:bg-indigo-600'
                                        }`}
                                >
                                    {currentIndex >= 49 && !isPro ? (
                                        <Lock size={20} />
                                    ) : (
                                        <ArrowRight size={24} />
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 text-slate-400 font-medium font-mono text-xs">
                                {currentIndex + 1} / {cards.length}
                            </div>

                            {/* Local styles for card animation + unknown pulse */}
                            <style>{`
                              @keyframes card-slide-left {
                                from { opacity: 0; transform: translateX(16px) scale(0.99) rotateY(0deg); }
                                to { opacity: 1; transform: translateX(0) scale(1) rotateY(0deg); }
                              }
                              @keyframes card-slide-right {
                                from { opacity: 0; transform: translateX(-16px) scale(0.99) rotateY(0deg); }
                                to { opacity: 1; transform: translateX(0) scale(1) rotateY(0deg); }
                              }
                              .card-anim-next { animation: card-slide-left 200ms ease-out; }
                              .card-anim-prev { animation: card-slide-right 200ms ease-out; }
                              @keyframes unknown-wave {
                                0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45); }
                                70% { box-shadow: 0 0 0 12px rgba(244, 63, 94, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
                              }
                              .unknown-wave { animation: unknown-wave 320ms ease-out; }
                            `}</style>
                        </div>
                    )
                )}

                {/* --- MATCH VIEW --- */}
                {activeTab === 'MATCH' && (
                    <div className="w-full max-w-4xl h-full flex flex-col animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold text-slate-800">Eşleştirme Oyunu</h3>
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">Seviye {matchPage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { playSound('click'); handleMatchPageChange('prev'); }}
                                    disabled={matchPage === 1}
                                    className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 btn-press"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <span className="text-sm font-bold text-slate-600 min-w-[20px] text-center">{matchPage}</span>
                                <button
                                    onClick={() => { playSound('click'); handleMatchPageChange('next'); }}
                                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 btn-press"
                                >
                                    {/* UPDATED LOCK ICON CONDITION */}
                                    {matchPage >= 15 && !isPro ? <Lock size={16} className="text-amber-500" /> : <ArrowRight size={16} />}
                                </button>
                                <button onClick={() => { playSound('click'); initMatchGame(matchPage); }} className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1 rounded-lg transition ml-2 btn-press">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 content-start">
                            {matchItems.map((item) => {
                                const isMatched = matchedIds.includes(item.originalId);
                                if (isMatched) return <div key={item.id} className="invisible"></div>;

                                const isSelected = selectedItem?.id === item.id;
                                const isWrong = wrongMatch && isSelected;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { playSound('click'); handleMatchClick(item); }}
                                        className={`h-24 md:h-32 p-2 md:p-4 rounded-2xl border-2 flex items-center justify-center text-center font-bold text-sm md:text-lg transition-all transform hover:scale-105 shadow-sm btn-press
                                    ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}
                                    ${isWrong ? 'border-rose-500 bg-rose-50 text-rose-700 animate-shake' : ''}
                                `}
                                    >
                                        {item.text}
                                    </button>
                                )
                            })}
                        </div>
                        {matchedIds.length === 6 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                                <div className="text-center animate-bounce-short">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <CheckCircle size={40} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-2">Harika İş!</h2>
                                    <button onClick={() => { playSound('click'); handleMatchPageChange('next'); }} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg btn-press">
                                        Sonraki Seviye
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- QUIZ LIST VIEW --- */}
                {activeTab === 'QUIZ' && (
                    <div className="w-full max-w-5xl h-full self-start animate-fadeIn">
                        {!selectedQuizId ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                                {VOCAB_TESTS.map((test) => {
                                    const isCompleted = completedQuizzes.includes(test.id);
                                    // 10. Testten sonra kilit (PRO)
                                    const isLocked = test.id > 10 && !isPro;

                                    return (
                                        <button
                                            key={test.id}
                                            onClick={() => { playSound('click'); startQuiz(test.id); }}
                                            className={`flex flex-col items-start p-5 border rounded-2xl hover:shadow-lg transition group text-left relative overflow-hidden btn-press
                                        ${isCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 hover:border-indigo-500'}
                                        ${isLocked ? 'opacity-75' : ''}
                                    `}
                                        >
                                            <div className="flex w-full justify-between items-center mb-3 relative z-10">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    TEST {test.id}
                                                </span>
                                                {isCompleted && <CheckCircle size={18} className="text-emerald-500" />}
                                                {isLocked && !isCompleted && (
                                                    <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold border border-amber-200">
                                                        <Lock size={10} /> PRO
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition mb-2 relative z-10">
                                                {test.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto relative z-10">
                                                <div className="flex items-center gap-1"><BookOpen size={12} /> 10 Soru</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                {/* ACTIVE QUIZ VIEW */}
                                {!isQuizFinished ? (
                                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 animate-fadeIn">
                                        {(() => {
                                            const currentTest = VOCAB_TESTS.find(t => t.id === selectedQuizId);
                                            if (!currentTest) return null;
                                            const currentQ = currentTest.questions[quizQuestionIndex];
                                            const isAnswered = quizUserAnswers[quizQuestionIndex] !== undefined;

                                            return (
                                                <>
                                                    <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                                        <button onClick={() => { playSound('click'); setSelectedQuizId(null); }} className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Çıkış</button>
                                                        <span className="font-bold text-indigo-600">Soru {quizQuestionIndex + 1} / {currentTest.questions.length}</span>
                                                    </div>
                                                    <div className="p-8">
                                                        <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">{currentQ.text}</h3>
                                                        <div className="grid gap-3">
                                                            {currentQ.options.map((opt, idx) => {
                                                                let btnClass = "w-full p-4 rounded-xl text-left font-semibold border-2 transition relative btn-press ";
                                                                if (isAnswered) {
                                                                    if (idx === currentQ.correctOptionIndex) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                                                                    else if (idx === quizUserAnswers[quizQuestionIndex]) btnClass += "border-rose-500 bg-rose-50 text-rose-800";
                                                                    else btnClass += "border-slate-100 text-slate-300";
                                                                } else {
                                                                    btnClass += "border-slate-100 hover:border-indigo-400 hover:bg-slate-50 text-slate-600";
                                                                }

                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => { if (!isAnswered) { playSound('click'); handleQuizAnswer(idx); } }}
                                                                        className={btnClass}
                                                                    >
                                                                        {opt}
                                                                        {isAnswered && idx === currentQ.correctOptionIndex && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600" />}
                                                                        {isAnswered && idx === quizUserAnswers[quizQuestionIndex] && idx !== currentQ.correctOptionIndex && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600" />}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    {isAnswered && (
                                                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                            <button
                                                                onClick={() => { playSound('click'); nextQuizQuestion(); }}
                                                                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl flex items-center gap-2 mx-auto btn-press relative z-30"
                                                            >
                                                                {quizQuestionIndex < currentTest.questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'} <ChevronRight size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-200 w-full max-w-md animate-fadeIn">
                                        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <BrainCircuit size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-800 mb-2">Test Tamamlandı!</h2>
                                        <p className="text-slate-500 mb-8 text-lg">Toplam Skorun: <strong className="text-indigo-600">{quizScore} / {VOCAB_TESTS.find(t => t.id === selectedQuizId)?.questions.length || 10}</strong></p>
                                        <button onClick={() => { playSound('click'); setSelectedQuizId(null); }} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg w-full btn-press">
                                            Listeye Dön
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* --- UNKNOWN WORDS TAB --- */}
                {activeTab === 'UNKNOWN' && (
                    <div className="w-full max-w-5xl h-full flex flex-col items-center animate-fadeIn pb-20">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 w-full max-w-4xl px-2 mt-4">
                            <HelpCircle className="text-rose-500" strokeWidth={3} /> Bilmediklerim ({unknownWordIds.length})
                        </h2>

                        {unknownWordIds.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 mt-10 max-w-md">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Listeniz Tertemiz!</h3>
                                <p className="text-slate-500 font-medium">Şu an "Bilmiyorum" olarak işaretlediğiniz kelime yok. Kartlara gidip çalışmaya başlayın.</p>
                                <button
                                    onClick={() => { playSound('click'); setActiveTab('CARDS'); }}
                                    className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
                                >
                                    Kartlara Git
                                </button>
                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                                {unknownWordIds.map(id => {
                                    const card = cards.find(c => c.id === id);
                                    if (!card) return null;

                                    return (
                                        <div key={id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition relative group hover:shadow-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-black text-slate-800">{card.word}</h3>
                                                <button onClick={(e) => speak(e, card.word)} className="text-indigo-400 hover:text-indigo-600 p-1 hover:bg-indigo-50 rounded-full">
                                                    <Volume2 size={20} />
                                                </button>
                                            </div>
                                            <p className="text-indigo-600 font-bold mb-3 border-b border-slate-100 pb-2">{card.turkishTranslation}</p>
                                            <p className="text-xs text-slate-500 italic mb-4 line-clamp-2 bg-slate-50 p-2 rounded-lg">"{card.exampleSentence}"</p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { playSound('click'); removeFromUnknown(id); }}
                                                    className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg hover:bg-emerald-100 transition flex items-center justify-center gap-2 border border-emerald-100"
                                                >
                                                    <CheckCircle size={14} /> Öğrendim
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Vocabulary;
