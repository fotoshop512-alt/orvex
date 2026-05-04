import React, { useState } from 'react';
import { GRAMMAR_TESTS } from '../data/grammarData';
import { Question } from '../types';
import { PenTool, CheckCircle, XCircle, ChevronRight, BookOpen, Clock, Lock, Crown } from 'lucide-react';
import { playSound } from '../utils/sound';
import CelebrationModal from './CelebrationModal';
import { storageService, UserProfile } from '../services/storage';
import PaymentModal from './PaymentModal';


interface GrammarHubProps {
  currentUser?: UserProfile | null;
}

const GrammarHub: React.FC<GrammarHubProps> = ({ currentUser }) => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [completedTests, setCompletedTests] = useState<number[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isPro = currentUser?.isPro || false;
  const isAdmin = currentUser?.role === 'ADMIN';

  // Load completed tests from storage
  React.useEffect(() => {
    if (currentUser) {
      storageService.getUserProgress(currentUser.uid, 'completedGrammarTests').then(val => {
        if (Array.isArray(val)) {
          setCompletedTests(val);
        }
      });
    }
  }, [currentUser]);

  const startQuiz = (testId: number) => {
    setSelectedTestId(testId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResult(false);
  };

  const handleAnswer = (optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    setShowResult(true);

    const currentQ = currentTest?.questions[currentQuestionIndex];
    if (currentQ && optionIndex === currentQ.correctOptionIndex) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const currentTest = selectedTestId ? GRAMMAR_TESTS.find(t => t.id === selectedTestId) : null;

  const nextQuestion = () => {
    if (!currentTest) return;

    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    } else {
      // Calculate score
      let correctCount = 0;
      currentTest.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });
      setTestScore(correctCount);

      // Finish Test
      if (selectedTestId && !completedTests.includes(selectedTestId)) {
        const newCompleted = [...completedTests, selectedTestId];
        setCompletedTests(newCompleted);
        // Save to storage
        if (currentUser) {
          storageService.saveUserProgress(currentUser.uid, 'completedGrammarTests', newCompleted);
        }
      }

      // Calculate points (10 points per correct answer = 100 points total)
      const points = correctCount * 10;

      // Update user's total score
      if (currentUser && points > 0) {
        storageService.incrementUserScore(currentUser.uid, points);
      }

      // Show congratulations modal
      setShowCongrats(true);
    }
  };

  // --- MENU VIEW ---
  if (!selectedTestId || !currentTest) {
    return (
      <div className="p-8 pt-safe max-w-6xl mx-auto h-full overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Gramer Sınavları</h2>
          <p className="text-slate-300">YDS'ye hazırlık için özel olarak hazırlanmış 50 adet deneme sınavı.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {GRAMMAR_TESTS.map(test => {
            const isCompleted = completedTests.includes(test.id);
            const isLocked = test.id > 1 && !isPro && !isAdmin;

            return (
              <button
                key={test.id}
                onClick={() => {
                  if (isLocked) {
                    setShowPaymentModal(true);
                  } else {
                    startQuiz(test.id);
                  }
                }}
                className={`flex flex-col items-start p-5 border rounded-2xl hover:shadow-lg transition group text-left relative overflow-hidden btn-press
                    ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/30'}
                    ${isLocked ? 'opacity-75' : ''}
                `}
              >
                {/* Lock Badge */}
                {isLocked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 z-20">
                    <Lock size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider">PRO</span>
                  </div>
                )}
                {/* Free Badge for first test */}
                {test.id === 1 && !isPro && !isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 z-20">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">ÜCRETSİZ</span>
                  </div>
                )}
                {/* Pro Crown */}
                {(isPro || isAdmin) && (
                  <div className="absolute top-3 right-3 z-20">
                    <Crown size={16} className="text-amber-400" />
                  </div>
                )}

                <div className="flex w-full justify-between items-center mb-3 relative z-10">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
                    TEST {test.id}
                  </span>
                  {isCompleted ? <CheckCircle size={18} className="text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-primary transition mb-2 relative z-10">Grammar Challenge</h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto relative z-10">
                  <div className="flex items-center gap-1"><BookOpen size={12} /> 10 Soru</div>
                  <div className="flex items-center gap-1"><Clock size={12} /> 15 Dk</div>
                </div>

                {/* Decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110">
                  <PenTool size={80} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && currentUser && (
          <PaymentModal
            user={currentUser}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    );
  }

  // --- QUIZ VIEW ---
  const currentQ = currentTest.questions[currentQuestionIndex];
  const isAnswered = showResult;
  const isCorrect = isAnswered && userAnswers[currentQuestionIndex] === currentQ.correctOptionIndex;

  return (
    <>
      {showCongrats && (
        <CelebrationModal
          type="grammar"
          title="Tebrikler!"
          subtitle="Gramer testini başarıyla tamamladın!"
          score={testScore}
          maxScore={10}
          points={testScore * 10}
          onClose={() => {
            setShowCongrats(false);
            setSelectedTestId(null);
          }}
          colorTheme="emerald"
        />
      )}
      <div className="h-full flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => { playSound('click'); setSelectedTestId(null); }} className="text-sm font-bold text-white/50 hover:text-white flex items-center gap-2 transition-colors">
              <i className="ri-arrow-left-line" /> Listeye Dön
            </button>
            <div className="bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-white/10 shadow-sm text-xs font-black text-white/60 tracking-widest uppercase">
              {currentTest.title} — Soru {currentQuestionIndex + 1} / {currentTest.questions.length}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            <div className="p-8 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white leading-relaxed">{currentQ.text}</h3>
            </div>

            <div className="p-6 space-y-3 bg-white/5">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "w-full p-4 rounded-xl text-left border-2 transition font-bold text-white/80 relative overflow-hidden btn-press ";

                if (isAnswered) {
                  if (idx === currentQ.correctOptionIndex) btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-300 pl-12";
                  else if (idx === userAnswers[currentQuestionIndex]) btnClass += "border-rose-500 bg-rose-500/20 text-rose-300 pl-12";
                  else btnClass += "border-white/5 text-white/20 opacity-40";
                } else {
                  btnClass += "border-white/10 hover:border-primary hover:bg-white/10";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && handleAnswer(idx)}
                    className={btnClass}
                    disabled={isAnswered}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctOptionIndex && <i className="ri-checkbox-circle-fill text-emerald-400 absolute -left-8 text-xl" />}
                      {isAnswered && idx === userAnswers[currentQuestionIndex] && idx !== currentQ.correctOptionIndex && <i className="ri-close-circle-fill text-rose-400 absolute -left-8 text-xl" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`p-6 text-center border-t border-white/10 ${isCorrect ? 'bg-emerald-500/10' : 'bg-rose-500/10'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <p className={`mb-4 font-black uppercase tracking-widest text-xs ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? 'Tebrikler, Doğru Cevap!' : 'Maalesef Yanlış.'}
                </p>
                <button
                  onClick={() => { playSound('click'); nextQuestion(); }}
                  className="px-12 py-4 bg-white text-black rounded-2xl text-base font-black hover:bg-white/90 transition shadow-2xl flex items-center gap-3 mx-auto transform hover:scale-105 active:scale-95 relative z-30"
                >
                  {currentQuestionIndex < currentTest.questions.length - 1 ? 'Sonraki Soru' : 'Testi Bitir'} <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GrammarHub;