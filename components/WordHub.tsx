import React, { useState, useEffect } from 'react';
import { VocabCard, VocabTest, Question } from '../types';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Volume2, RefreshCw, Layers, Gamepad2, BrainCircuit, Loader2, BookOpen, ChevronRight, Lock, HelpCircle, Play, Trophy, Zap, Scissors, Type, Timer } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CelebrationModal from './CelebrationModal';
import { storageService, UserProfile } from '../services/storage';
import { playSound } from '../utils/sound';

type Tab = 'CARDS' | 'MATCH' | 'QUIZ' | 'SCRAMBLE' | 'SPEED' | 'CONTEXT' | 'UNKNOWN';

interface WordHubProps {
    currentUser: UserProfile | null;
    title: string;
    wordList: VocabCard[];
    testList: VocabTest[];
    storagePrefix: 'vocab' | 'noun';
    colorTheme?: 'indigo' | 'blue' | 'purple';
}

const WordHub: React.FC<WordHubProps> = ({ currentUser, title, wordList, testList, storagePrefix, colorTheme = 'indigo' }) => {
    const [activeTab, setActiveTab] = useState<Tab>('CARDS');
    const [showPayment, setShowPayment] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    const isPro = currentUser?.isPro || currentUser?.role === 'ADMIN';

    // Storage Keys construction
    // Legacy support: 'vocab' prefix uses 'vocabIndex', 'unknownVocabIds', 'completedVocabQuizzes'
    // New 'noun' prefix uses 'nounIndex', 'unknownNounIds', 'completedNounQuizzes'
    const keyIndex = `${storagePrefix}Index`;
    const keyUnknown = `unknown${storagePrefix.charAt(0).toUpperCase() + storagePrefix.slice(1)}Ids`;
    const keyCompleted = `completed${storagePrefix.charAt(0).toUpperCase() + storagePrefix.slice(1)}Quizzes`;

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
    const [showCongrats, setShowCongrats] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);

    // --- UNKNOWN WORDS QUIZ STATE ---
    const [unknownQuizActive, setUnknownQuizActive] = useState(false);
    const [unknownQuizQuestions, setUnknownQuizQuestions] = useState<Question[]>([]);
    const [unknownQuizIndex, setUnknownQuizIndex] = useState(0);
    const [unknownQuizScore, setUnknownQuizScore] = useState(0);
    const [unknownQuizAnswers, setUnknownQuizAnswers] = useState<Record<number, number>>({});
    const [unknownQuizFinished, setUnknownQuizFinished] = useState(false);

    // --- WORD SCRAMBLE STATE ---
    const [scrambleData, setScrambleData] = useState<{ word: string, scrambled: string[], originalCard: VocabCard } | null>(null);
    const [scrambleUserLetters, setScrambleUserLetters] = useState<{ id: number, char: string }[]>([]);
    const [scrambleAvailable, setScrambleAvailable] = useState<{ id: number, char: string, used: boolean }[]>([]);
    const [scrambleStatus, setScrambleStatus] = useState<'playing' | 'correct' | 'wrong' | 'skipped'>('playing');
    const [scrambleIndex, setScrambleIndex] = useState(0);

    // --- SPEED MATCH STATE ---
    const [speedMatchItem, setSpeedMatchItem] = useState<{ word: string, turkish: string, isCorrectMatch: boolean } | null>(null);
    const [speedScore, setSpeedScore] = useState(0);
    const [speedTimeLeft, setSpeedTimeLeft] = useState(10);
    const [speedActive, setSpeedActive] = useState(false);
    const [speedFeedback, setSpeedFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const [speedIndex, setSpeedIndex] = useState(0);
    const [speedWrongIds, setSpeedWrongIds] = useState<number[]>([]);

    // --- CONTEXT KING STATE ---
    const [contextItem, setContextItem] = useState<{ sentence: string, options: string[], correctIndex: number, card: VocabCard } | null>(null);
    const [contextSelected, setContextSelected] = useState<number | null>(null);
    const [contextScore, setContextScore] = useState(0);
    const [contextIndex, setContextIndex] = useState(0);

    // --- INIT LOGIC & PROGRESS LOAD ---
    useEffect(() => {
        if (currentUser) {
            // Load Progress using Promise.all for robustness
            const promises = [
                storageService.getUserProgress(currentUser.uid, keyIndex),
                storageService.getUserProgress(currentUser.uid, keyUnknown),
                storageService.getUserProgress(currentUser.uid, keyCompleted),
                storageService.getUserProgress(currentUser.uid, `${storagePrefix}ScrambleIdx`),
                storageService.getUserProgress(currentUser.uid, `${storagePrefix}SpeedIdx`),
                storageService.getUserProgress(currentUser.uid, `${storagePrefix}ContextIdx`),
                storageService.getUserProgress(currentUser.uid, `${storagePrefix}MatchPage`),
                storageService.getUserProgress(currentUser.uid, `${storagePrefix}SpeedWrongIds`)
            ];

            Promise.all(promises).then(([idx, unknown, completed, scramble, speed, context, matchPageVal, speedWrong]) => {
                if (typeof idx === 'number' && idx >= 0 && idx < wordList.length) setCurrentIndex(idx);
                if (Array.isArray(unknown)) setUnknownWordIds(unknown);
                if (Array.isArray(completed)) setCompletedQuizzes(completed);
                if (typeof scramble === 'number') setScrambleIndex(scramble);
                if (typeof speed === 'number') setSpeedIndex(speed);
                if (typeof context === 'number') setContextIndex(context);
                if (typeof matchPageVal === 'number' && matchPageVal > 0) setMatchPage(matchPageVal);
                if (Array.isArray(speedWrong)) setSpeedWrongIds(speedWrong);

                setIsLoadingProgress(false);
            }).catch(err => {
                console.error("Progress load error:", err);
                setIsLoadingProgress(false);
            });
        } else {
            setIsLoadingProgress(false);
        }
    }, [currentUser, wordList.length, storagePrefix]);

    const saveProgress = (index: number) => {
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, keyIndex, index);
        }
    };

    const saveUnknownWords = (newIds: number[]) => {
        setUnknownWordIds(newIds);
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, keyUnknown, newIds);
        }
    };

    const markAsUnknown = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentCard = wordList[currentIndex];
        if (!currentCard || !currentCard.id) return;

        const currentCardId = currentCard.id;

        if (!unknownWordIds.includes(currentCardId)) {
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
            storageService.saveUserProgress(currentUser.uid, keyCompleted, unique);
        }
    }

    // --- FLASHCARD LOGIC ---
    const nextCard = () => {
        if (currentIndex < wordList.length - 1) {
            // PRO: 50. karttan (index 49) sonrası kilitli
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

    const flipCard = () => {
        playSound('page');
        setIsFlipped(!isFlipped);
    };

    const speak = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    // --- MATCHING GAME LOGIC ---
    const MATCH_ITEMS_PER_PAGE = 6;

    const initMatchGame = (page: number = matchPage) => {
        if (page > 15 && !isPro) {
            setShowPayment(true);
            return;
        }

        const startIndex = (page - 1) * MATCH_ITEMS_PER_PAGE;
        if (startIndex >= wordList.length) return;

        const slice = wordList.slice(startIndex, startIndex + MATCH_ITEMS_PER_PAGE);

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

        if (newPage > 15 && !isPro) {
            setShowPayment(true);
            return;
        }

        setMatchPage(newPage);
        if (currentUser) {
            storageService.saveUserProgress(currentUser.uid, `${storagePrefix}MatchPage`, newPage);
        }
        initMatchGame(newPage);
    }

    const handleMatchClick = (item: typeof matchItems[0]) => {
        if (wrongMatch) {
            setWrongMatch(false);
            setSelectedItem(null);
        }
        if (matchedIds.includes(item.originalId)) return;

        if (!selectedItem) {
            playSound('click');
            setSelectedItem(item);
        } else {
            if (selectedItem.id === item.id) {
                playSound('click');
                setSelectedItem(null);
            } else if (selectedItem.type === item.type) {
                playSound('click');
                setSelectedItem(item);
            } else {
                if (selectedItem.originalId === item.originalId) {
                    setMatchedIds(prev => [...prev, item.originalId]);
                    setSelectedItem(null);
                    playSound('correct');
                } else {
                    setWrongMatch(true);
                    playSound('wrong');
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
        const currentTest = testList.find(t => t.id === selectedQuizId);
        if (!currentTest) return;

        const currentQ = currentTest.questions[quizQuestionIndex];

        setQuizUserAnswers(prev => ({ ...prev, [quizQuestionIndex]: optIndex }));
        if (optIndex === currentQ.correctOptionIndex) {
            setQuizScore(prev => prev + 1);
            playSound('correct');
        } else {
            playSound('wrong');
        }
    };

    const nextQuizQuestion = () => {
        const currentTest = testList.find(t => t.id === selectedQuizId);
        if (!currentTest) return;

        if (quizQuestionIndex < currentTest.questions.length - 1) {
            setQuizQuestionIndex(prev => prev + 1);
        } else {
            setIsQuizFinished(true);
            if (selectedQuizId) saveQuizCompletion(selectedQuizId);

            // Calculate points based on score (10 points per correct answer)
            const points = quizScore * 10;
            setEarnedPoints(points);

            // Update user's total score
            if (currentUser && points > 0) {
                storageService.incrementUserScore(currentUser.uid, points);
            }

            setShowCongrats(true);
        }
    };

    const prevQuizQuestion = () => {
        if (quizQuestionIndex > 0) {
            setQuizQuestionIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (isLoadingProgress) return; // Wait for progress load

        if (activeTab === 'MATCH') initMatchGame(matchPage);
        if (activeTab === 'SCRAMBLE') initScramble(scrambleIndex);
        if (activeTab === 'SPEED') startSpeedMatch();
        if (activeTab === 'CONTEXT') initContextKing(contextIndex);
    }, [activeTab, isLoadingProgress]);

    // --- WORD SCRAMBLE LOGIC ---
    const initScramble = (index: number = scrambleIndex) => {
        const idx = index % wordList.length;
        const randomCard = wordList[idx];

        const word = randomCard.word.toUpperCase();
        const chars = word.split('').map((c, i) => ({ id: i, char: c, used: false }));
        setScrambleData({ word, scrambled: word.split('').sort(() => Math.random() - 0.5), originalCard: randomCard });
        setScrambleAvailable(chars.sort(() => Math.random() - 0.5));
        setScrambleUserLetters([]);
        setScrambleStatus('playing');
    };

    const handleScrambleSkip = () => {
        if (!scrambleData || scrambleStatus !== 'playing') return;

        setScrambleStatus('skipped');
        // Fill user letters with correct ones to show the answer
        const correctLetters = scrambleData.word.split('').map((c, i) => ({ id: i, char: c }));
        setScrambleUserLetters(correctLetters);

        // Move to next after 2 seconds
        setTimeout(() => {
            const nextIdx = (scrambleIndex + 1) % wordList.length;
            setScrambleIndex(nextIdx);
            if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}ScrambleIdx`, nextIdx);
            initScramble(nextIdx);
        }, 2000);
    };

    const handleScrambleCharClick = (item: { id: number, char: string }) => {
        if (scrambleStatus !== 'playing') return;

        // Add to user letters
        const newLetters = [...scrambleUserLetters, item];
        setScrambleUserLetters(newLetters);

        // Mark as used in available
        setScrambleAvailable(prev => prev.map(a => a.id === item.id ? { ...a, used: true } : a));

        // Check if finished
        if (newLetters.length === scrambleData?.word.length) {
            const finalString = newLetters.map(l => l.char).join('');
            if (finalString === scrambleData.word) {
                setScrambleStatus('correct');
                playSound('correct');
                const nextIdx = (scrambleIndex + 1) % wordList.length;
                setScrambleIndex(nextIdx);
                if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}ScrambleIdx`, nextIdx);
                setTimeout(() => {
                    storageService.incrementUserScore(currentUser?.uid || '', 5);
                    initScramble(nextIdx);
                }, 1500);
            } else {
                setScrambleStatus('wrong');
                playSound('wrong');
                setTimeout(() => {
                    setScrambleUserLetters([]);
                    setScrambleAvailable(prev => prev.map(a => ({ ...a, used: false })));
                    setScrambleStatus('playing');
                }, 1000);
            }
        }
    };

    const undoScrambleChar = () => {
        if (scrambleUserLetters.length === 0 || scrambleStatus !== 'playing') return;
        const last = scrambleUserLetters[scrambleUserLetters.length - 1];
        setScrambleUserLetters(prev => prev.slice(0, -1));
        setScrambleAvailable(prev => prev.map(a => a.id === last.id ? { ...a, used: false } : a));
    };

    // --- SPEED MATCH LOGIC ---
    const startSpeedMatch = () => {
        setSpeedActive(true);
        setSpeedScore(0);
        generateSpeedItem();
    };

    const generateSpeedItem = (index: number = speedIndex) => {
        const correctCard = wordList[index % wordList.length];

        const isCorrectMatch = Math.random() > 0.5;
        let displayTurkish = correctCard.turkishTranslation;

        if (!isCorrectMatch) {
            const otherTranslations = Array.from(new Set(
                wordList
                    .filter(c => c.turkishTranslation !== correctCard.turkishTranslation)
                    .map(c => c.turkishTranslation)
            ));

            if (otherTranslations.length > 0) {
                displayTurkish = otherTranslations[Math.floor(Math.random() * otherTranslations.length)];
            } else {
                displayTurkish = "yanlış anlam";
            }
        }

        setSpeedMatchItem({ word: correctCard.word, turkish: displayTurkish, isCorrectMatch });
        setSpeedFeedback('none');
        setSpeedTimeLeft(10);
    };

    const handleSpeedAnswer = (answer: boolean) => {
        if (!speedMatchItem || !speedActive) return;

        const isCorrect = answer === speedMatchItem.isCorrectMatch;
        const currentId = wordList.find(c => c.word === speedMatchItem.word)?.id;

        if (isCorrect) {
            setSpeedScore(prev => prev + 1);
            setSpeedFeedback('correct');
            playSound('correct');

            // Always increment index to move to next word
            const nextIdx = (speedIndex + 1) % wordList.length;
            setSpeedIndex(nextIdx);
            if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}SpeedIdx`, nextIdx);

            if (currentId && speedWrongIds.includes(currentId)) {
                const newWrongIds = speedWrongIds.filter(id => id !== currentId);
                setSpeedWrongIds(newWrongIds);
                if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}SpeedWrongIds`, newWrongIds);
            }

            setTimeout(() => generateSpeedItem(nextIdx), 200);
        } else {
            setSpeedFeedback('wrong');
            playSound('wrong');

            // Even on wrong, increment index so each word is shown only once in the cycle
            const nextIdx = (speedIndex + 1) % wordList.length;
            setSpeedIndex(nextIdx);
            if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}SpeedIdx`, nextIdx);

            // Add to wrong list for learning tracking
            if (currentId && !speedWrongIds.includes(currentId)) {
                const newWrongIds = [...speedWrongIds, currentId];
                setSpeedWrongIds(newWrongIds);
                if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}SpeedWrongIds`, newWrongIds);
            }

            setTimeout(() => generateSpeedItem(nextIdx), 2000);
        }
    };

    useEffect(() => {
        let interval: any;
        if (speedActive && speedTimeLeft > 0) {
            interval = setInterval(() => setSpeedTimeLeft(prev => prev - 1), 1000);
        } else if (speedTimeLeft === 0 && speedActive) {
            setSpeedActive(false);
            if (currentUser && speedScore > 0) {
                storageService.incrementUserScore(currentUser.uid, speedScore * 2);
            }
        }
        return () => clearInterval(interval);
    }, [speedActive, speedTimeLeft]);

    // --- CONTEXT KING LOGIC ---
    const initContextKing = (index: number = contextIndex) => {
        const idx = index % wordList.length;
        const card = wordList[idx];

        if (!card.exampleSentence) {
            // Skip cards without example sentences
            const nextIdx = (index + 1) % wordList.length;
            initContextKing(nextIdx);
            return;
        }

        // Find the actual word used in the sentence to replace it entirely (including suffixes like -s, -ed, -ing)
        // This regex looks for a word starting with our base word
        const wordPattern = new RegExp(`\\b${card.word}\\w*\\b`, 'gi');

        let foundWordInSentence = '';
        const match = card.exampleSentence.match(wordPattern);
        if (match) {
            foundWordInSentence = match[0];
        } else {
            // Fallback if boundary match fails
            foundWordInSentence = card.word;
        }

        // We use a unique separator to avoid split issues
        const SEPARATOR = '___BLANK___';
        const sentence = card.exampleSentence.replace(wordPattern, SEPARATOR);

        // Generate options
        const otherWords = wordList
            .filter(c => c.id !== card.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(c => c.word);

        const options = [...otherWords, card.word].sort(() => Math.random() - 0.5);

        setContextItem({ sentence, options, correctIndex: options.indexOf(card.word), card });
        setContextSelected(null);
    };

    const handleContextAnswer = (idx: number) => {
        if (contextSelected !== null) return;
        setContextSelected(idx);
        if (idx === contextItem?.correctIndex) {
            setContextScore(prev => prev + 1);
            playSound('correct');
            storageService.incrementUserScore(currentUser?.uid || '', 10);

            // Increment and save progress
            const nextIdx = (contextIndex + 1) % wordList.length;
            setContextIndex(nextIdx);
            if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}ContextIdx`, nextIdx);

            setTimeout(() => initContextKing(nextIdx), 2000);
        } else {
            playSound('wrong');
            setTimeout(() => initContextKing(contextIndex), 2500);
        }
    };

    // --- UNKNOWN WORDS QUIZ LOGIC ---
    const generateUnknownQuiz = () => {
        if (unknownWordIds.length < 4) {
            return; // Need at least 4 words for options
        }

        const unknownCards = unknownWordIds
            .map(id => wordList.find(c => c.id === id))
            .filter(Boolean) as VocabCard[];

        // Shuffle and take max 10 questions
        const shuffled = [...unknownCards].sort(() => 0.5 - Math.random());
        const selectedCards = shuffled.slice(0, Math.min(10, shuffled.length));

        const questions: Question[] = selectedCards.map((card, idx) => {
            const correctTranslation = card.turkishTranslation;

            // Get all unique translations except the correct one to ensure uniqueness
            const otherTranslations = Array.from(new Set(
                wordList
                    .filter(c => c.turkishTranslation !== correctTranslation)
                    .map(c => c.turkishTranslation)
            )) as string[];

            // Pick 3 random distractors
            const distractors = [...otherTranslations]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            // Create options array with correct answer
            const options = [...distractors, correctTranslation].sort(() => 0.5 - Math.random());
            const correctIndex = options.indexOf(correctTranslation);

            return {
                id: idx + 1,
                text: `"${card.word}" kelimesinin Türkçe anlamı nedir?`,
                options: options,
                correctOptionIndex: correctIndex
            };
        });

        setUnknownQuizQuestions(questions);
        setUnknownQuizIndex(0);
        setUnknownQuizScore(0);
        setUnknownQuizAnswers({});
        setUnknownQuizFinished(false);
        setUnknownQuizActive(true);
        playSound('click');
    };

    const handleUnknownQuizAnswer = (optIndex: number) => {
        const currentQ = unknownQuizQuestions[unknownQuizIndex];
        if (!currentQ) return;

        setUnknownQuizAnswers(prev => ({ ...prev, [unknownQuizIndex]: optIndex }));
        if (optIndex === currentQ.correctOptionIndex) {
            setUnknownQuizScore(prev => prev + 1);
            playSound('correct');
        } else {
            playSound('wrong');
        }
    };

    const nextUnknownQuizQuestion = () => {
        if (unknownQuizIndex < unknownQuizQuestions.length - 1) {
            setUnknownQuizIndex(prev => prev + 1);
        } else {
            setUnknownQuizFinished(true);

            // Calculate points (10 points per correct answer)
            const points = unknownQuizScore * 10;
            setEarnedPoints(points);

            // Update user's total score
            if (currentUser && points > 0) {
                storageService.incrementUserScore(currentUser.uid, points);
            }

            setShowCongrats(true);
        }
    };

    const prevUnknownQuizQuestion = () => {
        if (unknownQuizIndex > 0) {
            setUnknownQuizIndex(prev => prev - 1);
        }
    };

    const closeUnknownQuiz = () => {
        setUnknownQuizActive(false);
        setUnknownQuizFinished(false);
        setUnknownQuizQuestions([]);
    };

    return (
        <div className="flex flex-col h-full relative">
            {showPayment && <PaymentModal user={currentUser} onClose={() => setShowPayment(false)} />}
            {showCongrats && (
                <CelebrationModal
                    type="test"
                    title="Tebrikler!"
                    subtitle={unknownQuizActive ? "Bilmediklerim testini tamamladın!" : "Testi başarıyla tamamladın!"}
                    score={unknownQuizActive ? unknownQuizScore : quizScore}
                    maxScore={unknownQuizActive ? unknownQuizQuestions.length : (testList.find(t => t.id === selectedQuizId)?.questions.length || 10)}
                    points={earnedPoints}
                    onClose={() => {
                        setShowCongrats(false);
                        if (unknownQuizActive) {
                            closeUnknownQuiz();
                        } else {
                            setSelectedQuizId(null);
                        }
                    }}
                    colorTheme={colorTheme}
                />
            )}

            <div className="px-4 py-4 pt-safe flex flex-col md:flex-row items-center justify-between z-10 gap-3">
                <h2 className="text-xl font-bold text-white hidden md:block">{title}</h2>
                <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-xl overflow-x-auto w-full md:w-auto scrollbar-hide border border-white/10">
                    <button
                        onClick={() => { playSound('click'); setActiveTab('CARDS'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'CARDS' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <Layers size={16} /> Kartlar
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('MATCH'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'MATCH' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <Gamepad2 size={16} /> Eşleştirme
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('SCRAMBLE'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'SCRAMBLE' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <Scissors size={16} /> Harf Avı
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('SPEED'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'SPEED' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <Zap size={16} /> Hız Tuzağı
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('CONTEXT'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'CONTEXT' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <Type size={16} /> Cümle Prensi
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('QUIZ'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'QUIZ' ? `bg-white/10 text-white shadow-sm border border-white/10` : 'text-slate-400 hover:text-white'}`}
                    >
                        <BrainCircuit size={16} /> Testler
                    </button>
                    <button
                        onClick={() => { playSound('click'); setActiveTab('UNKNOWN'); }}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap btn-press ${activeTab === 'UNKNOWN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <HelpCircle size={16} /> Bilmediklerim
                        {unknownWordIds.length > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unknownWordIds.length}</span>}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-48 flex justify-center">

                {/* --- CARD VIEW --- */}
                {activeTab === 'CARDS' && (
                    isLoadingProgress ? (
                        <div className="flex flex-col items-center justify-center text-indigo-400 h-full">
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
                                <div className="absolute inset-0 w-full h-full bg-[#1a1d3a] rounded-3xl shadow-xl border-2 border-white/10 flex flex-col items-center justify-center p-8 backface-hidden hover:shadow-2xl transition">
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 bg-white/10 px-3 py-1.5 rounded-full">Kelime #{wordList[currentIndex].id}</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-6 drop-shadow-lg">{wordList[currentIndex].word}</h2>

                                    <p className="absolute bottom-6 text-white/50 text-sm animate-pulse font-medium">Çeviri için karta dokun</p>
                                </div>

                                {/* BACK */}
                                <div
                                    className="absolute inset-0 w-full h-full bg-[#1a1d3a] rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden text-white border-2 border-white/10"
                                    style={{ transform: 'rotateY(180deg)' }}
                                >
                                    <h3 className="text-3xl font-bold mb-2 text-center drop-shadow-md">{wordList[currentIndex].turkishTranslation}</h3>
                                    <div className="w-16 h-1 bg-white/30 rounded-full mb-6"></div>

                                    <div className="text-center space-y-4 w-full">
                                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                            <span className="text-white/70 text-xs font-bold uppercase block mb-2">Eş Anlamlılar</span>
                                            <p className="font-medium text-white">{wordList[currentIndex].synonyms.join(', ')}</p>
                                        </div>
                                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                            <span className="text-white/70 text-xs font-bold uppercase block mb-2">Örnek Cümle</span>
                                            <p className="italic text-white/90 leading-relaxed text-sm">"{wordList[currentIndex].exampleSentence}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="w-full grid grid-cols-4 gap-3 mt-8">
                                <button
                                    onClick={() => { playSound('click'); prevCard(); }}
                                    disabled={currentIndex === 0}
                                    className={`col-span-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-${colorTheme}-500 hover:text-${colorTheme}-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm btn-press flex items-center justify-center`}
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
                                        : `bg-slate-900 hover:bg-indigo-600`
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
                                {currentIndex + 1} / {wordList.length}
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
                                <h3 className="text-xl font-bold text-slate-100">Eşleştirme Oyunu</h3>
                                <span className={`bg-${colorTheme}-100 text-${colorTheme}-700 px-3 py-1 rounded-full text-xs font-bold`}>Seviye {matchPage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { playSound('click'); handleMatchPageChange('prev'); }}
                                    disabled={matchPage === 1}
                                    className="p-2 rounded-lg bg-white/10 border border-white/20 disabled:opacity-50 hover:bg-white/20 btn-press text-white"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <span className="text-sm font-bold text-white min-w-[20px] text-center">{matchPage}</span>
                                <button
                                    onClick={() => { playSound('click'); handleMatchPageChange('next'); }}
                                    className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 btn-press text-white"
                                >
                                    {/* UPDATED LOCK ICON CONDITION */}
                                    {matchPage >= 15 && !isPro ? <Lock size={16} className="text-amber-400" /> : <ArrowRight size={16} />}
                                </button>
                                <button onClick={() => { playSound('click'); initMatchGame(matchPage); }} className="flex items-center gap-2 text-primary font-bold hover:bg-white/10 px-3 py-1 rounded-lg transition ml-2 btn-press">
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
                                    ${isSelected ? 'border-primary bg-primary/20 text-white ring-2 ring-primary/30' : 'border-white/20 bg-white/10 text-white hover:border-primary/50'}
                                    ${isWrong ? 'border-rose-500 bg-rose-500/20 text-rose-300 animate-shake' : ''}
                                `}
                                    >
                                        {item.text}
                                    </button>
                                )
                            })}
                        </div>
                        {matchedIds.length === 6 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                                <div className="text-center animate-bounce-short">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-emerald-500/30">
                                        <CheckCircle size={40} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-2">Harika İş!</h2>
                                    <button onClick={() => { playSound('click'); handleMatchPageChange('next'); }} className={`px-8 py-3 bg-${colorTheme}-600 text-white rounded-xl font-bold hover:bg-${colorTheme}-700 transition shadow-lg btn-press`}>
                                        Sonraki Seviye
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- WORD SCRAMBLE VIEW --- */}
                {activeTab === 'SCRAMBLE' && scrambleData && (
                    <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center animate-fadeIn p-4">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-white mb-2">Harf Avı</h3>
                            <p className="text-white/60">Harfleri doğru sırayla diz ve kelimeyi oluştur!</p>
                            <p className="text-primary font-bold mt-2">{scrambleData.originalCard.turkishTranslation}</p>
                        </div>

                        {/* User Input Area */}
                        <div className="flex flex-wrap justify-center gap-2 mb-12 min-h-[60px] p-4 bg-white/5 rounded-2xl border border-white/10 w-full">
                            {Array.from({ length: scrambleData.word.length }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-2 font-bold text-xl transition-all
                                        ${scrambleUserLetters[i] ? 'bg-white border-white text-slate-900 shadow-lg' : 'border-white/20 text-white/20'}
                                        ${scrambleStatus === 'correct' ? 'border-emerald-500 bg-emerald-500 text-white animate-bounce' : ''}
                                        ${scrambleStatus === 'wrong' ? 'border-rose-500 bg-rose-500 text-white animate-shake' : ''}
                                        ${scrambleStatus === 'skipped' ? 'border-amber-500 bg-amber-500 text-slate-900' : ''}
                                    `}
                                >
                                    {scrambleUserLetters[i]?.char}
                                </div>
                            ))}
                        </div>

                        {scrambleStatus === 'skipped' && (
                            <p className="text-amber-400 font-bold mb-4 animate-pulse text-sm">Doğru Cevap: {scrambleData.word}</p>
                        ) || (
                                <div className="h-9 mb-4"></div>
                            )}

                        {/* Available Letters */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {scrambleAvailable.map((item) => (
                                <button
                                    key={item.id}
                                    disabled={item.used || scrambleStatus !== 'playing'}
                                    onClick={() => { playSound('click'); handleScrambleCharClick(item); }}
                                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-extrabold text-xl transition-all btn-press
                                        ${item.used || scrambleStatus !== 'playing' ? 'opacity-0 scale-75 cursor-default' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 shadow-sm'}
                                    `}
                                >
                                    {item.char}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { playSound('click'); undoScrambleChar(); }}
                                className="px-6 py-2 rounded-xl bg-white/5 text-white/50 hover:text-white border border-white/10 transition flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Geri Al
                            </button>
                            <button
                                onClick={() => { playSound('click'); handleScrambleSkip(); }}
                                className="px-6 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition flex items-center gap-2"
                            >
                                <RefreshCw size={18} /> Pas Geç
                            </button>
                        </div>
                    </div>
                )}

                {/* --- SPEED MATCH VIEW --- */}
                {activeTab === 'SPEED' && (
                    <div className="w-full max-w-xl h-full flex flex-col items-center justify-center animate-fadeIn p-4">
                        {!speedActive && speedTimeLeft === 0 ? (
                            <div className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl animate-scaleIn w-full">
                                <Trophy size={64} className="text-amber-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-black text-white mb-2">Süre Doldu!</h2>
                                <p className="text-white/60 mb-6 font-medium">Toplam Skorun</p>
                                <div className="text-6xl font-black text-primary mb-8 drop-shadow-lg">{speedScore}</div>
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-8">
                                    <p className="text-emerald-400 font-bold">+{speedScore * 2} TP Puan Kazandın!</p>
                                </div>
                                <button
                                    onClick={() => { playSound('click'); startSpeedMatch(); }}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-primary-dark shadow-xl transition btn-press flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={24} /> Tekrar Dene
                                </button>
                                <button
                                    onClick={() => setActiveTab('CARDS')}
                                    className="w-full mt-4 py-2 text-white/40 hover:text-white font-medium transition"
                                >
                                    Kapat
                                </button>
                            </div>
                        ) : speedMatchItem ? (
                            <div className="w-full flex flex-col items-center">
                                {/* Timer & Score */}
                                <div className="w-full flex justify-between items-center mb-12 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${speedTimeLeft < 10 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}>
                                            <Timer size={20} />
                                        </div>
                                        <span className={`text-2xl font-black ${speedTimeLeft < 10 ? 'text-rose-400' : 'text-white'}`}>{speedTimeLeft}s</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider">SKOR</p>
                                        <p className="text-3xl font-black text-primary">{speedScore}</p>
                                    </div>
                                </div>

                                {/* Flashcard Match Area */}
                                <div className={`w-full aspect-video md:aspect-[2/1] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 transform scale-100 border-2
                                    ${speedFeedback === 'correct' ? 'border-emerald-500 bg-emerald-500/10 scale-105' : ''}
                                    ${speedFeedback === 'wrong' ? 'border-rose-500 bg-rose-500/10 animate-shake' : 'border-white/20'}
                                `}>
                                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Eşleşme Doğru mu?</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2">{speedMatchItem.word}</h2>
                                    <div className="h-0.5 w-12 bg-white/10 my-4"></div>
                                    <h3 className={`text-2xl md:text-3xl font-bold mb-8 transition-colors duration-300 ${speedFeedback === 'wrong' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {speedFeedback === 'wrong'
                                            ? wordList.find(c => c.word === speedMatchItem.word)?.turkishTranslation
                                            : speedMatchItem.turkish}
                                    </h3>
                                    {speedFeedback === 'wrong' && (
                                        <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest animate-pulse">Doğru Anlam Gösteriliyor</p>
                                    )}
                                </div>

                                {/* Choice Buttons */}
                                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                    <button
                                        onClick={() => handleSpeedAnswer(false)}
                                        className="py-6 bg-rose-500 text-white rounded-3xl font-black text-xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all transform active:scale-90 flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={32} /> YANLIŞ
                                    </button>
                                    <button
                                        onClick={() => handleSpeedAnswer(true)}
                                        className="py-6 bg-emerald-500 text-white rounded-3xl font-black text-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-90 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={32} /> DOĞRU
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* --- CONTEXT KING VIEW --- */}
                {activeTab === 'CONTEXT' && contextItem && (
                    <div className="w-full max-w-3xl h-full flex flex-col items-center justify-center animate-fadeIn p-4">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-black text-white mb-1">Cümle Prensi</h3>
                            <p className="text-white/60 italic text-sm">Cümleyi en doğru kelimeyle tamamla!</p>
                        </div>

                        {/* Sentence Box */}
                        <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl mb-10 relative overflow-hidden group min-h-[160px] flex flex-col justify-center">
                            <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition pointer-events-none">
                                <Type size={140} />
                            </div>

                            <p className="text-lg md:text-2xl leading-relaxed text-white text-left md:text-center font-medium relative z-10 break-words">
                                {contextItem.sentence.split('___BLANK___').map((part, i, arr) => (
                                    <React.Fragment key={i}>
                                        {part}
                                        {i < arr.length - 1 && (
                                            <span className={`inline-flex items-center justify-center min-w-[100px] h-8 md:h-10 px-3 border-b-2 mx-1 transition-all rounded-t-lg
                                                ${contextSelected === null ? 'border-primary bg-white/5 animate-pulse text-white/20' :
                                                    contextSelected === contextItem.correctIndex ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-rose-500 bg-rose-500/20 text-rose-400'}
                                            `}>
                                                {contextSelected === null ? '........' : contextItem.options[contextSelected]}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </p>

                            <div className="mt-8 flex items-center justify-center gap-2 relative z-10">
                                <div className="h-px w-8 bg-white/10"></div>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    {contextItem.card.turkishTranslation}
                                </p>
                                <div className="h-px w-8 bg-white/10"></div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                            {contextItem.options.map((opt, idx) => {
                                const isAnswered = contextSelected !== null;
                                const isCorrect = idx === contextItem.correctIndex;
                                const isSelected = contextSelected === idx;

                                let btnClass = "p-4 rounded-2xl font-bold transition-all transform active:scale-95 border-2 flex items-center justify-between text-lg ";
                                if (!isAnswered) {
                                    btnClass += "bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/30";
                                } else {
                                    if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105 shadow-lg shadow-emerald-500/20";
                                    else if (isSelected) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400 animate-shake";
                                    else btnClass += "bg-white/5 border-white/5 text-white/20";
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => { playSound('click'); handleContextAnswer(idx); }}
                                        className={btnClass}
                                    >
                                        {opt}
                                        {isAnswered && isCorrect && <CheckCircle size={24} />}
                                        {isAnswered && isSelected && !isCorrect && <XCircle size={24} />}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => {
                                playSound('click');
                                const nextIdx = (contextIndex + 1) % wordList.length;
                                setContextIndex(nextIdx);
                                if (currentUser) storageService.saveUserProgress(currentUser.uid, `${storagePrefix}ContextIdx`, nextIdx);
                                initContextKing(nextIdx);
                            }}
                            className="mt-12 text-white/40 hover:text-white flex items-center gap-2 font-bold transition p-2"
                        >
                            <RefreshCw size={18} /> Yeni Cümle
                        </button>
                    </div>
                )}

                {/* --- QUIZ LIST VIEW --- */}
                {activeTab === 'QUIZ' && (
                    <div className="w-full max-w-5xl h-full self-start animate-fadeIn">
                        {!selectedQuizId ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                                {testList.map((test) => {
                                    const isCompleted = completedQuizzes.includes(test.id);
                                    const isLocked = test.id > 10 && !isPro;

                                    return (
                                        <button
                                            key={test.id}
                                            onClick={() => { playSound('click'); startQuiz(test.id); }}
                                            className={`flex flex-col items-start p-5 border rounded-2xl hover:shadow-lg transition group text-left relative overflow-hidden btn-press
                                        ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/10 border-white/20 hover:border-primary/50'}
                                        ${isLocked ? 'opacity-75' : ''}
                                    `}
                                        >
                                            <div className="flex w-full justify-between items-center mb-3 relative z-10">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
                                                    TEST {test.id}
                                                </span>
                                                {isCompleted && <CheckCircle size={18} className="text-emerald-400" />}
                                                {isLocked && !isCompleted && (
                                                    <div className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-bold border border-amber-500/30">
                                                        <Lock size={10} /> PRO
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition mb-2 relative z-10">
                                                {test.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-white/40 mt-auto relative z-10">
                                                <div className="flex items-center gap-1"><BookOpen size={12} /> 10 Soru</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="min-h-full w-full flex flex-col items-center py-2 md:py-10">
                                {/* ACTIVE QUIZ VIEW */}
                                {!isQuizFinished ? (
                                    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-white/20 animate-fadeIn mb-auto mt-2 md:my-auto">
                                        {(() => {
                                            const currentTest = testList.find(t => t.id === selectedQuizId);
                                            if (!currentTest) return null;
                                            const currentQ = currentTest.questions[quizQuestionIndex];
                                            const isAnswered = quizUserAnswers[quizQuestionIndex] !== undefined;

                                            return (
                                                <>
                                                    <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                                                        <button onClick={() => { playSound('click'); setSelectedQuizId(null); }} className="text-sm text-white/60 hover:text-white font-medium">← Çıkış</button>
                                                        <span className="font-bold text-primary">Soru {quizQuestionIndex + 1} / {currentTest.questions.length}</span>
                                                    </div>
                                                    <div className="p-4 md:p-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">{currentQ.text}</h3>
                                                        <div className="grid gap-3">
                                                            {currentQ.options.map((opt, idx) => {
                                                                let btnClass = "w-full p-4 rounded-xl text-left font-semibold border-2 transition relative btn-press ";
                                                                if (isAnswered) {
                                                                    if (idx === currentQ.correctOptionIndex) btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                                                                    else if (idx === quizUserAnswers[quizQuestionIndex]) btnClass += "border-rose-500 bg-rose-500/20 text-rose-300";
                                                                    else btnClass += "border-white/10 text-white/30";
                                                                } else {
                                                                    btnClass += "border-white/20 hover:border-primary hover:bg-white/10 text-white";
                                                                }

                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => { if (!isAnswered) { playSound('click'); handleQuizAnswer(idx); } }}
                                                                        className={btnClass}
                                                                    >
                                                                        {opt}
                                                                        {isAnswered && idx === currentQ.correctOptionIndex && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />}
                                                                        {isAnswered && idx === quizUserAnswers[quizQuestionIndex] && idx !== currentQ.correctOptionIndex && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400" />}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    {isAnswered && (
                                                        <div className="p-4 md:p-6 bg-white/5 border-t border-white/10 flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                            <button
                                                                onClick={() => { playSound('click'); prevQuizQuestion(); }}
                                                                disabled={quizQuestionIndex === 0}
                                                                className={`flex-1 px-6 py-3.5 border border-white/20 text-white rounded-xl md:rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 btn-press disabled:opacity-30 disabled:cursor-not-allowed`}
                                                            >
                                                                <ArrowLeft size={18} /> Önceki
                                                            </button>
                                                            <button
                                                                onClick={() => { playSound('click'); nextQuizQuestion(); }}
                                                                className={`flex-[2] px-6 py-3.5 ${colorTheme === 'indigo' ? 'bg-indigo-600' : colorTheme === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} text-white rounded-xl md:rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 btn-press relative z-10`}
                                                            >
                                                                {quizQuestionIndex < currentTest.questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                                                                <ChevronRight size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20 w-full max-w-md animate-fadeIn">
                                        <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/30">
                                            <BrainCircuit size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2">Test Tamamlandı!</h2>
                                        <p className="text-white/60 mb-8 text-lg">Toplam Skorun: <strong className="text-primary">{quizScore} / {testList.find(t => t.id === selectedQuizId)?.questions.length || 10}</strong></p>
                                        <button onClick={() => { playSound('click'); setSelectedQuizId(null); }} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition shadow-lg w-full btn-press">
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
                        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2 w-full max-w-4xl px-2 mt-4">
                            <HelpCircle className="text-rose-500" strokeWidth={3} /> Bilmediklerim ({unknownWordIds.length})
                        </h2>

                        {/* Unknown Words Quiz Active */}
                        {unknownQuizActive ? (
                            <div className="w-full max-w-2xl flex flex-col items-center p-4">
                                {!unknownQuizFinished ? (
                                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 w-full animate-fadeIn">
                                        {/* Quiz Header */}
                                        <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 p-4 border-b border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/60 text-sm font-medium">
                                                    Soru {unknownQuizIndex + 1} / {unknownQuizQuestions.length}
                                                </span>
                                                <span className="text-white font-bold flex items-center gap-1">
                                                    <Trophy size={16} className="text-amber-400" /> {unknownQuizScore}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                                                <div
                                                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${((unknownQuizIndex + 1) / unknownQuizQuestions.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Question */}
                                        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                            <h3 className="text-xl font-bold text-white mb-6 text-center">
                                                {unknownQuizQuestions[unknownQuizIndex]?.text}
                                            </h3>

                                            {/* Options */}
                                            <div className="space-y-3">
                                                {unknownQuizQuestions[unknownQuizIndex]?.options.map((opt, optIdx) => {
                                                    const isAnswered = unknownQuizAnswers[unknownQuizIndex] !== undefined;
                                                    const isSelected = unknownQuizAnswers[unknownQuizIndex] === optIdx;
                                                    const isCorrect = optIdx === unknownQuizQuestions[unknownQuizIndex]?.correctOptionIndex;

                                                    let optionClass = "w-full p-4 rounded-xl text-left font-medium transition border ";
                                                    if (isAnswered) {
                                                        if (isCorrect) {
                                                            optionClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
                                                        } else if (isSelected) {
                                                            optionClass += "bg-rose-500/20 border-rose-500/50 text-rose-300";
                                                        } else {
                                                            optionClass += "bg-white/5 border-white/10 text-white/40";
                                                        }
                                                    } else {
                                                        optionClass += "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20";
                                                    }

                                                    return (
                                                        <button
                                                            key={optIdx}
                                                            onClick={() => !isAnswered && handleUnknownQuizAnswer(optIdx)}
                                                            disabled={isAnswered}
                                                            className={optionClass}
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                                                                    {String.fromCharCode(65 + optIdx)}
                                                                </span>
                                                                {opt}
                                                                {isAnswered && isCorrect && <CheckCircle size={18} className="ml-auto text-emerald-400" />}
                                                                {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-rose-400" />}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Next Button */}
                                            {unknownQuizAnswers[unknownQuizIndex] !== undefined && (
                                                <div className="flex flex-col md:flex-row gap-3 mt-6">
                                                    <button
                                                        onClick={prevUnknownQuizQuestion}
                                                        disabled={unknownQuizIndex === 0}
                                                        className="flex-1 py-3 border border-white/20 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-30"
                                                    >
                                                        <ArrowLeft size={18} /> Geri
                                                    </button>
                                                    <button
                                                        onClick={nextUnknownQuizQuestion}
                                                        className="flex-[2] py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition flex items-center justify-center gap-2"
                                                    >
                                                        {unknownQuizIndex < unknownQuizQuestions.length - 1 ? (
                                                            <>Sonraki Soru <ArrowRight size={18} /></>
                                                        ) : (
                                                            <>Testi Bitir <Trophy size={18} /></>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cancel Button */}
                                        <div className="p-4 border-t border-white/10">
                                            <button
                                                onClick={closeUnknownQuiz}
                                                className="w-full py-2 text-white/50 hover:text-white text-sm font-medium transition"
                                            >
                                                Testi İptal Et
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20 w-full max-w-md animate-fadeIn">
                                        <div className="w-24 h-24 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-rose-500/30">
                                            <BrainCircuit size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2">Test Tamamlandı!</h2>
                                        <p className="text-white/60 mb-8 text-lg">
                                            Toplam Skorun: <strong className="text-rose-400">{unknownQuizScore} / {unknownQuizQuestions.length}</strong>
                                        </p>
                                        <button
                                            onClick={closeUnknownQuiz}
                                            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold hover:from-rose-600 hover:to-pink-600 transition shadow-lg w-full btn-press"
                                        >
                                            Listeye Dön
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {unknownWordIds.length === 0 ? (
                                    <div className="text-center p-12 bg-white/10 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 mt-10 max-w-md">
                                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Listeniz Tertemiz!</h3>
                                        <p className="text-white/60 font-medium">Şu an "Bilmiyorum" olarak işaretlediğiniz kelime yok. Kartlara gidip çalışmaya başlayın.</p>
                                        <button
                                            onClick={() => { playSound('click'); setActiveTab('CARDS'); }}
                                            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark"
                                        >
                                            Kartlara Git
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Word Cards Grid */}
                                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                                            {unknownWordIds.map(id => {
                                                const card = wordList.find(c => c.id === id);
                                                if (!card) return null;

                                                return (
                                                    <div key={id} className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-sm hover:border-primary/50 transition relative group hover:shadow-md">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-xl font-black text-white">{card.word}</h3>
                                                        </div>
                                                        <p className="text-primary font-bold mb-3 border-b border-white/10 pb-2">{card.turkishTranslation}</p>
                                                        <p className="text-xs text-white/60 italic mb-4 line-clamp-2 bg-white/5 p-2 rounded-lg">"{card.exampleSentence}"</p>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => { playSound('click'); removeFromUnknown(id); }}
                                                                className="flex-1 py-2 bg-emerald-500/20 text-emerald-300 text-sm font-bold rounded-lg hover:bg-emerald-500/30 transition flex items-center justify-center gap-2 border border-emerald-500/30"
                                                            >
                                                                <CheckCircle size={14} /> Öğrendim
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Test Oluştur Button */}
                                        {unknownWordIds.length >= 4 && (
                                            <div className="w-full max-w-4xl mt-8 px-2">
                                                <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-2xl p-6">
                                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                        <div className="text-center md:text-left">
                                                            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                                                                <BrainCircuit className="text-rose-400" size={22} />
                                                                Bilmediklerinle Test Yap
                                                            </h3>
                                                            <p className="text-white/60 text-sm mt-1">
                                                                {unknownWordIds.length} kelime ile {Math.min(10, unknownWordIds.length)} soruluk test oluştur
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={generateUnknownQuiz}
                                                            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition shadow-lg flex items-center gap-2 btn-press"
                                                        >
                                                            <Play size={18} /> Teste Başla
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Not Enough Words Warning */}
                                        {unknownWordIds.length < 4 && unknownWordIds.length > 0 && (
                                            <div className="w-full max-w-4xl mt-8 px-2">
                                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                                                    <p className="text-amber-300 text-sm">
                                                        Test oluşturmak için en az 4 kelime gerekli. ({4 - unknownWordIds.length} kelime daha ekleyin)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

            </div>
        </div >
    );
};

export default WordHub;

