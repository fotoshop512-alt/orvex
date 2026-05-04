
import React, { useState, useEffect } from 'react';
import { READING_TOPICS, getPassageForTopic } from '../data/readingData';
import { translateWord } from '../services/geminiService';
import { EMBEDDED_DICTIONARY } from '../data/dictionary';
import { playSound } from '../utils/sound';
import { ReadingPassage } from '../types';
import { BookOpen, HelpCircle, Check, AlertCircle, Loader2, ArrowLeft, Search } from 'lucide-react';
import CelebrationModal from './CelebrationModal';
import { storageService, UserProfile } from '../services/storage';

interface ReadingZoneProps {
    currentUser: UserProfile | null;
}

const ReadingZone: React.FC<ReadingZoneProps> = ({ currentUser }) => {
    const [passage, setPassage] = useState<ReadingPassage | null>(null);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [results, setResults] = useState<Record<number, boolean | null>>({});
    const [completedTopics, setCompletedTopics] = useState<string[]>([]);
    const [showCongrats, setShowCongrats] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [readingScore, setReadingScore] = useState(0);

    // Mobile View Logic: 'LIST' or 'CONTENT'
    const [mobileView, setMobileView] = useState<'LIST' | 'CONTENT'>('LIST');

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTopics = READING_TOPICS.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        if (currentUser) {
            storageService.getUserProgress(currentUser.uid, 'completedReadings').then(val => {
                if (Array.isArray(val)) {
                    setCompletedTopics(val);
                }
            });
        }
    }, [currentUser]);

    const handleSelectTopic = async (topic: string) => {
        setLoading(true);
        setPassage(null);
        setAnswers({});
        setResults({});
        setAnswers({});
        setResults({});
        setShowCongrats(false);

        // Switch view immediately for mobile responsiveness
        setMobileView('CONTENT');

        // Simulate network delay for UX
        setTimeout(() => {
            const data = getPassageForTopic(topic);
            setPassage(data);
            setLoading(false);
        }, 500);
    };

    const handleBackToList = () => {
        setMobileView('LIST');
        // We keep the passage in state so if they return it's there, but purely visual toggle
    };

    const handleSelectOption = (qId: number, optIndex: number) => {
        if (results[qId] !== undefined) return;
        setAnswers(prev => ({ ...prev, [qId]: optIndex }));
    };

    const checkAnswers = () => {
        if (!passage) return;
        const newResults: Record<number, boolean> = {};
        passage.questions.forEach(q => {
            newResults[q.id] = answers[q.id] === q.correctOptionIndex;
        });
        setResults(newResults);



        const allCorrect = Object.values(newResults).every(r => r === true);
        if (allCorrect) {
            playSound('success');
        } else {
            playSound('wrong');
        }

        // Calculate score
        const correctCount = Object.values(newResults).filter(r => r === true).length;
        setReadingScore(correctCount);

        // Calculate points (20 points per correct answer)
        const points = correctCount * 20;
        setEarnedPoints(points);

        if (currentUser) {
            const newList = [...completedTopics, passage.title];
            const uniqueList = Array.from(new Set(newList));
            setCompletedTopics(uniqueList);
            storageService.saveUserProgress(currentUser.uid, 'completedReadings', uniqueList);

            // Update total score
            if (points > 0) {
                const newTotalScore = (currentUser.score || 0) + points;
                storageService.updateUserScore(currentUser.uid, newTotalScore);
            }
        }

        // Show congratulations modal
        setShowCongrats(true);
    };





    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden relative">
            {showCongrats && passage && (
                <CelebrationModal
                    type="reading"
                    title="Okuma Tamamlandı!"
                    subtitle="Soruları başarıyla cevapladın!"
                    score={readingScore}
                    maxScore={passage.questions.length}
                    points={earnedPoints}
                    onClose={() => setShowCongrats(false)}
                    colorTheme="blue"
                />
            )}



            {/* 
         LIST SECTION 
         Mobile: Hidden if mobileView is CONTENT
         Desktop: Always Block (w-1/3)
      */}
            <div className={`
        w-full md:w-1/3 lg:w-1/4 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col h-full z-10 shadow-sm
        ${mobileView === 'CONTENT' ? 'hidden md:flex' : 'flex'}
      `}>
                <div className="p-5 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="text-primary" />
                        Okuma Kütüphanesi
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Konu ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm bg-white/5 text-white placeholder-white/40 transition"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredTopics.map((topic, idx) => {
                        const isCompleted = completedTopics.includes(topic);
                        const isSelected = passage?.title.includes(topic);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelectTopic(topic)}
                                disabled={loading}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm font-medium flex justify-between items-center group btn-press
                    ${isSelected
                                        ? 'bg-primary/20 border-primary/30 text-white shadow-md'
                                        : 'bg-white/5 border-white/10 text-white/80 hover:border-primary/30 hover:bg-white/10'}
                `}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <span className={`text-xs font-mono opacity-60 ${isSelected ? 'text-white/60' : 'text-white/40'}`}>{idx + 1}.</span>
                                    <span className="truncate">{topic}</span>
                                </div>
                                {isCompleted ? <Check size={16} className={isSelected ? "text-emerald-300" : "text-emerald-500"} /> : null}
                            </button>
                        );
                    })}
                    {filteredTopics.length === 0 && <div className="text-center text-slate-400 py-4 text-sm">Konu bulunamadı.</div>}
                </div>
            </div>

            {/* 
         CONTENT SECTION 
         Mobile: Hidden if mobileView is LIST
         Desktop: Always Block (w-2/3)
      */}
            <div className={`
        w-full md:w-2/3 lg:w-3/4 h-full flex flex-col relative
        ${mobileView === 'LIST' ? 'hidden md:flex' : 'flex'}
      `}
            >
                {/* Mobile Header for Reading View */}
                <div className="md:hidden bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
                    <button
                        onClick={handleBackToList}
                        className="p-2 -ml-2 text-white/80 hover:bg-white/10 rounded-full active:bg-white/20 transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <span className="font-bold text-white truncate text-lg">
                        {passage ? passage.title : 'Okuma'}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    {!passage && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-fadeIn">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/10">
                                <BookOpen size={40} className="text-indigo-200" />
                            </div>
                            <p className="text-lg font-medium text-center text-slate-200">Başlamak için listeden bir konu seçin.</p>
                            <p className="text-sm mt-2 text-slate-300 text-center">YDS uyumlu 40+ akademik makale.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center text-indigo-400">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                            <p className="font-medium mt-4 text-slate-300">Metin hazırlanıyor...</p>
                        </div>
                    )}

                    {passage && !loading && (
                        <div className="max-w-3xl mx-auto animate-fadeIn pb-24">
                            <div className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-sm border border-white/10 mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

                                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 relative z-10">
                                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{passage.title}</h1>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm
                        ${passage.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            passage.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                        {passage.difficulty}
                                    </span>
                                </div>

                                <div className="prose prose-slate prose-lg text-white/90 leading-8 text-justify font-serif">
                                    {passage.content.split('\n').map((para, i) => (
                                        <p key={i} className="mb-6 last:mb-0">
                                            {para.split(' ').map((word, wIndex) => (
                                                <span
                                                    key={wIndex}
                                                    className="transition-colors duration-200"
                                                >
                                                    {word}{' '}
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>


                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    Okuduğunu Anlama
                                </h3>

                                {passage.questions.map((q, index) => (
                                    <div key={q.id} className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition">
                                        <p className="font-bold text-white mb-6 text-lg flex gap-3">
                                            <span className="text-white/20 font-black text-2xl">0{index + 1}</span>
                                            <span className="pt-1">{q.text}</span>
                                        </p>
                                        <div className="space-y-3">
                                            {q.options.map((opt, optIndex) => {
                                                const isSelected = answers[q.id] === optIndex;
                                                const isCorrect = results[q.id] !== undefined && q.correctOptionIndex === optIndex;
                                                const isWrongSelection = results[q.id] === false && isSelected;

                                                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between group relative overflow-hidden btn-press ";

                                                if (results[q.id] !== undefined) {
                                                    if (isCorrect) btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-medium";
                                                    else if (isWrongSelection) btnClass += "border-rose-500 bg-rose-500/20 text-rose-300 font-medium";
                                                    else btnClass += "border-white/10 text-white/40 opacity-60";
                                                } else {
                                                    if (isSelected) btnClass += "border-primary bg-primary/20 text-white shadow-inner font-medium";
                                                    else btnClass += "border-white/10 hover:border-primary/30 hover:bg-white/10 text-white/80";
                                                }

                                                return (
                                                    <button
                                                        key={optIndex}
                                                        onClick={() => handleSelectOption(q.id, optIndex)}
                                                        className={btnClass}
                                                        disabled={results[q.id] !== undefined}
                                                    >
                                                        <span className="relative z-10">{opt}</span>
                                                        {isCorrect && <Check size={20} className="text-emerald-600 relative z-10" strokeWidth={3} />}
                                                        {isWrongSelection && <AlertCircle size={20} className="text-rose-600 relative z-10" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="sticky bottom-6 mt-8 z-20">
                                    {Object.keys(results).length === 0 ? (
                                        <button
                                            onClick={checkAnswers}
                                            disabled={Object.keys(answers).length !== passage.questions.length}
                                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.98] border border-primary/30"
                                        >
                                            Cevapları Kontrol Et
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-center text-emerald-300 font-bold shadow-lg animate-bounce-short flex items-center justify-center gap-2">
                                            <CheckCircleIcon /> Test tamamlandı! Yeni bir konu seçebilirsiniz.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
)

export default ReadingZone;
