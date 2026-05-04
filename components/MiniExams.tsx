import React, { useState, useEffect } from 'react';
import { UserProfile, storageService } from '../services/storage';
import { MINI_YDS_EXAMS, MiniExam, MiniExamQuestion } from '../data/miniExamsData';
import { Clock, CheckCircle, XCircle, ArrowLeft, Trophy, Target, BookOpen, Loader2, Lock, Crown, Maximize2, Minimize2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import CelebrationModal from './CelebrationModal';
import PaymentModal from './PaymentModal';

interface MiniExamsProps {
  currentUser: UserProfile | null;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const MiniExams: React.FC<MiniExamsProps> = ({ currentUser, onFullscreenChange }) => {
  const [selectedExam, setSelectedExam] = useState<MiniExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExams, setCompletedExams] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPro = currentUser?.isPro || false;
  const isAdmin = currentUser?.role === 'ADMIN';

  // Load completed exams from storage
  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) return;
      const progress = await storageService.getUserProgress(currentUser.uid, 'miniExamResults');
      if (!progress) {
        setCompletedExams({});
        return;
      }

      // Normalize progress regardless of storage shape (object or array)
      if (Array.isArray(progress)) {
        const normalized: Record<number, number> = {};
        progress.forEach((val, idx) => {
          if (val !== undefined && val !== null) normalized[idx + 1] = val;
        });
        setCompletedExams(normalized);
      } else if (typeof progress === 'object') {
        const normalized: Record<number, number> = {};
        Object.entries(progress).forEach(([k, v]) => {
          const id = Number(k);
          if (!Number.isNaN(id)) normalized[id] = v as number;
        });
        setCompletedExams(normalized);
      } else {
        setCompletedExams({});
      }
    };
    loadProgress();
  }, [currentUser]);

  // Timer effect
  useEffect(() => {
    if (examStarted && !examFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, examFinished, timeLeft]);

  const startExam = (exam: MiniExam) => {
    setSelectedExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamStarted(true);
    setExamFinished(false);
    setTimeLeft((exam.timeLimit || exam.duration) * 60);
    playSound('click');
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    if (examFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    playSound('click');
  };

  const finishExam = async () => {
    if (!selectedExam) return;

    setExamFinished(true);
    playSound('success');

    // Calculate score - only count answered questions
    let correct = 0;
    selectedExam.questions.forEach(q => {
      // Only count as correct if user answered AND answer matches
      if (selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / selectedExam.questions.length) * 100);
    setScore(scorePercent);

    // Save progress
    if (currentUser) {
      const newCompletedExams: Record<number, number> = { ...completedExams, [selectedExam.id]: scorePercent };
      setCompletedExams(newCompletedExams);
      await storageService.saveUserProgress(currentUser.uid, 'miniExamResults', newCompletedExams);

      // Award points
      const points = correct * 5;
      setEarnedPoints(points);
      if (points > 0) {
        await storageService.incrementUserScore(currentUser.uid, points);
      }

      // Increment completed count (only if first time)
      if (completedExams[selectedExam.id] === undefined) {
        await storageService.incrementUserStat(currentUser.uid, 'miniExamsCompleted', 1);
      }

      // Show celebration for good scores
      if (scorePercent >= 70) {
        setShowCelebration(true);
      }
    }
  };

  const goBack = () => {
    playSound('click');
    setSelectedExam(null);
    setExamStarted(false);
    setExamFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    playSound('click');
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (onFullscreenChange) {
      onFullscreenChange(newState);
    }
    // You might want to call a parent function if the layout depends on it
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({ type: 'TOGGLE_FULLSCREEN', isFullscreen: newState }, '*');
    }
  };

  // Exam List View
  if (!selectedExam) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-6 pt-safe">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Mini YDS Denemeleri</h1>
            <p className="text-white/60">10 soruluk mini denemeler ile kendinizi test edin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MINI_YDS_EXAMS.map((exam) => {
              const isCompleted = completedExams[exam.id] !== undefined;
              const examScore = completedExams[exam.id];
              const isLocked = exam.id > 1 && !isPro && !isAdmin;

              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    if (isLocked) {
                      setShowPaymentModal(true);
                    } else {
                      startExam(exam);
                    }
                  }}
                  className={`bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-left transition-all group relative ${isLocked ? 'opacity-75' : ''}`}
                >
                  {/* Lock Badge */}
                  {isLocked && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                      <Lock size={12} className="text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider">PRO</span>
                    </div>
                  )}
                  {/* Free Badge for first exam */}
                  {exam.id === 1 && !isPro && !isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">ÜCRETSİZ</span>
                    </div>
                  )}
                  {/* Pro Crown */}
                  {(isPro || isAdmin) && (
                    <div className="absolute top-3 right-3">
                      <Crown size={16} className="text-amber-400" />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {exam.id}
                    </div>
                    {isCompleted && (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${examScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} ${isLocked || exam.id === 1 || isPro || isAdmin ? 'mt-8' : ''}`}>
                        {examScore}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{exam.title}</h3>
                  <p className="text-white/50 text-sm mb-3">{exam.description || `${exam.questionCount} soruluk mini deneme`}</p>
                  <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span className="flex items-center gap-1">
                      <Target size={14} />
                      {exam.questions.length} Soru
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {exam.timeLimit || exam.duration} Dakika
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Yenileri Çok Yakında */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full">
              <span className="text-lg">🚀</span>
              <span className="text-indigo-300 font-medium">Yenileri çok yakında!</span>
            </div>
          </div>
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

  // Exam View
  const currentQuestion = selectedExam.questions[currentQuestionIndex];

  if (examFinished) {
    // Results View
    let correct = 0;
    selectedExam.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    return (
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={goBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition">
            <ArrowLeft size={20} />
            Denemelere Dön
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-6">
            <Trophy size={48} className={`mx-auto mb-4 ${score >= 70 ? 'text-amber-400' : 'text-white/40'}`} />
            <h2 className="text-2xl font-bold text-white mb-2">Sınav Tamamlandı!</h2>
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {score}%
            </div>
            <p className="text-white/60">
              {correct} / {selectedExam.questions.length} doğru cevap
            </p>
            <p className="text-emerald-400 text-sm mt-2">+{correct * 5} puan kazandınız!</p>
          </div>

          {/* Answer Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Cevap Anahtarı</h3>
            {selectedExam.questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className={`bg-white/5 border rounded-xl p-4 ${isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle size={20} className="text-emerald-400 mt-1 shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-rose-400 mt-1 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white/80 text-sm mb-2">
                        <span className="font-bold text-white">Soru {idx + 1}:</span> {q.question.substring(0, 100)}...
                      </p>
                      <div className="text-xs space-y-1">
                        <p className="text-white/50">Sizin cevabınız: <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAnswer !== undefined ? ['A', 'B', 'C', 'D', 'E'][userAnswer] : 'Boş'}</span></p>
                        {!isCorrect && <p className="text-emerald-400">Doğru cevap: {['A', 'B', 'C', 'D', 'E'][q.correctAnswer]}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showCelebration && (
          <CelebrationModal
            title="Tebrikler!"
            message={`${score}% başarı ile sınavı tamamladınız! +${earnedPoints} puan kazandınız!`}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </div>
    );
  }

  // Question View
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-4 pt-safe">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-2 text-white/60 hover:text-white transition">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Çık</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition"
              title={isFullscreen ? "Yarım Ekran" : "Tam Ekran"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeLeft < 60 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white'}`}>
              <Clock size={16} />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-12">
          {selectedExam.questions.map((q, idx) => {
            // Only show passage if it's the first question using it
            const showPassage = q.passage && (idx === 0 || selectedExam.questions[idx - 1].passage !== q.passage);

            return (
              <div key={q.id} className="space-y-6">
                {showPassage && (
                  <div className="bg-white/5 border border-indigo-500/20 rounded-2xl p-5 mb-6 border-l-4 border-l-indigo-500">
                    <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                      <BookOpen size={18} />
                      Paragraf
                    </h4>
                    <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                      {q.passage}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-white/40 text-xs font-medium tracking-wider">SORU</span>
                  </div>
                  <p className="text-white text-lg leading-relaxed font-medium">{q.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {q.options.map((option, oIdx) => {
                    const optionLetters = ['A', 'B', 'C', 'D', 'E'];
                    const optionLetter = optionLetters[oIdx];
                    const isSelected = selectedAnswers[q.id] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => selectAnswer(q.id, oIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${isSelected
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 mt-0.5 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'
                          }`}>
                          {optionLetter}
                        </span>
                        <span className="flex-1 pt-1.5 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="pt-8 pb-12">
            <button
              onClick={finishExam}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              <CheckCircle size={22} />
              Sınavı Bitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniExams;

