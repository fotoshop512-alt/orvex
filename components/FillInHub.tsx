import React, { useState, useEffect } from 'react';
import { FILL_IN_TESTS } from '../data/fillInTestsData';
import { Question } from '../types';
import { PenTool, CheckCircle, XCircle, ChevronRight, BookOpen, Clock, Lock, Crown } from 'lucide-react';
import { playSound } from '../utils/sound';
import CelebrationModal from './CelebrationModal';
import { storageService, UserProfile } from '../services/storage';
import PaymentModal from './PaymentModal';

interface FillInHubProps {
  currentUser?: UserProfile | null;
}

const FillInHub: React.FC<FillInHubProps> = ({ currentUser }) => {
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

  useEffect(() => {
    if (currentUser) {
      storageService.getUserProgress(currentUser.uid, 'completedFillInTests').then(val => {
        if (Array.isArray(val)) setCompletedTests(val);
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

  const currentTest = selectedTestId ? FILL_IN_TESTS.find(t => t.id === selectedTestId) : null;

  const nextQuestion = () => {
    if (!currentTest) return;

    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    } else {
      let correctCount = 0;
      currentTest.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctOptionIndex) correctCount++;
      });
      setTestScore(correctCount);

      if (selectedTestId && !completedTests.includes(selectedTestId)) {
        const updated = [...completedTests, selectedTestId];
        setCompletedTests(updated);
        if (currentUser) {
          storageService.saveUserProgress(currentUser.uid, 'completedFillInTests', updated);
        }
      }

      const points = correctCount * 10;
      if (currentUser && points > 0) {
        storageService.incrementUserScore(currentUser.uid, points);
      }

      setShowCongrats(true);
    }
  };

  const prevQuestion = () => {
    if (!currentTest) return;
    if (currentQuestionIndex === 0) return;
    const targetIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(targetIndex);
    // Eğer önceki soruya daha önce cevap verildiyse sonucu göster, yoksa gizle
    setShowResult(userAnswers[targetIndex] !== undefined);
  };

  if (!selectedTestId || !currentTest) {
    return (
      <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Boşluk Doldurma Testleri</h2>
          <p className="text-slate-300">50 test, her biri 10 soru. İlk test ücretsiz, diğerleri PRO.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {FILL_IN_TESTS.map(test => {
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
                    ${isLocked ? 'opacity-75' : ''}`}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 z-20">
                    <Lock size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider">PRO</span>
                  </div>
                )}
                {test.id === 1 && !isPro && !isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 z-20">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">ÜCRETSİZ</span>
                  </div>
                )}
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

                <h3 className="text-lg font-bold text-white group-hover:text-primary transition mb-2 relative z-10">Boşluk Doldurma</h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto relative z-10">
                  <div className="flex items-center gap-1"><BookOpen size={12} /> 10 Soru</div>
                  <div className="flex items-center gap-1"><Clock size={12} /> 15 Dk</div>
                </div>

                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110">
                  <PenTool size={80} />
                </div>
              </button>
            );
          })}
        </div>

        {showPaymentModal && currentUser && (
          <PaymentModal user={currentUser} onClose={() => setShowPaymentModal(false)} />
        )}
      </div>
    );
  }

  const currentQ = currentTest.questions[currentQuestionIndex];
  const isAnswered = showResult;
  const isCorrect = isAnswered && userAnswers[currentQuestionIndex] === currentQ.correctOptionIndex;

  return (
    <>
      {showCongrats && (
        <CelebrationModal
          type="grammar"
          title="Tebrikler!"
          subtitle="Boşluk doldurma testini tamamladın!"
          score={testScore}
          maxScore={10}
          points={testScore * 10}
          onClose={() => {
            setShowCongrats(false);
            setSelectedTestId(null);
          }}
          colorTheme="blue"
        />
      )}

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-slate-400">TEST {currentTest.id} · Boşluk Doldurma</p>
            <h2 className="text-2xl font-bold text-white">Soru {currentQuestionIndex + 1} / {currentTest.questions.length}</h2>
          </div>
          <button
            onClick={() => setSelectedTestId(null)}
            className="text-sm text-white/60 hover:text-white font-medium border border-white/10 px-3 py-2 rounded-lg"
          >
            Çık
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <p className="text-white text-lg font-semibold leading-relaxed">{currentQ.text.replace('____', '___')}</p>
          </div>

          <div className="grid gap-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full text-left px-4 py-3 rounded-xl border-2 transition relative btn-press ";
              if (isAnswered) {
                if (idx === currentQ.correctOptionIndex) btnClass += "border-emerald-500 bg-emerald-500/15 text-emerald-200";
                else if (idx === userAnswers[currentQuestionIndex]) btnClass += "border-rose-500 bg-rose-500/15 text-rose-200";
                else btnClass += "border-white/10 text-white/40";
              } else {
                btnClass += "border-white/15 hover:border-primary hover:bg-white/5 text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => { if (!isAnswered) { playSound('click'); handleAnswer(idx); } }}
                  className={btnClass}
                >
                  {opt}
                  {isAnswered && idx === currentQ.correctOptionIndex && (
                    <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  )}
                  {isAnswered && idx === userAnswers[currentQuestionIndex] && idx !== currentQ.correctOptionIndex && (
                    <XCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

                {isAnswered && (
                  <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <button
                      onClick={() => { playSound('click'); prevQuestion(); }}
                      disabled={currentQuestionIndex === 0}
                      className={`w-full md:w-1/2 border border-white/15 text-white py-3 rounded-xl font-semibold transition ${currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary hover:bg-white/5'}`}
                    >
                      Önceki Soru
                    </button>
                    <button
                      onClick={() => { playSound('click'); nextQuestion(); }}
                      className="w-full md:w-1/2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
                    >
                      {currentQuestionIndex === currentTest.questions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}
                    </button>
                  </div>
                )}
        </div>
      </div>
    </>
  );
};

export default FillInHub;

