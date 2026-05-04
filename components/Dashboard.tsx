
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExamResult } from '../types';
import { Trophy, BookOpen, Brain, Activity, Loader2, Calendar, RefreshCw, X, Shield } from 'lucide-react';
import { UserProfile, storageService } from '../services/storage';
import { playSound } from '../utils/sound';

interface DashboardProps {
  results: ExamResult[];
  currentUser: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ results, currentUser }) => {
  const [stats, setStats] = useState({
    solvedQuestions: 0,
    learnedWords: 0,
    averageScore: 0,
    weeklyGoal: 0,
    vocabProgress: 0,
    nounProgress: 0,
    readingProgress: 0,
    grammarProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [showLegalModal, setShowLegalModal] = useState<'TERMS' | 'PRIVACY' | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;

      try {
        // Fetch specific progress metrics
        const vocabIndex = await storageService.getUserProgress(currentUser.uid, 'vocabIndex') || 0;
        const nounIndex = await storageService.getUserProgress(currentUser.uid, 'nounIndex') || 0;

        const completedReadings = await storageService.getUserProgress(currentUser.uid, 'completedReadings') || [];
        const completedVocabQuizzes = await storageService.getUserProgress(currentUser.uid, 'completedVocabQuizzes') || [];
        const completedNounQuizzes = await storageService.getUserProgress(currentUser.uid, 'completedNounQuizzes') || [];

        const completedGrammar = await storageService.getUserProgress(currentUser.uid, 'completedGrammarTests') || [];

        // --- CALCULATIONS ---

        // 1. Solved Questions
        const totalSolved = (completedVocabQuizzes.length * 10) + (completedNounQuizzes.length * 10) + (completedReadings.length * 3) + (completedGrammar.length * 10);

        // 2. Learned Words (Verbs + Nouns)
        const learned = vocabIndex + nounIndex;

        // 3. Average Score (Simulation based on activity)
        let calculatedScore = 0;
        if (totalSolved > 0) {
          calculatedScore = Math.min(95, 50 + (totalSolved / 15));
        }

        // 4. Weekly Goal % (Arbitrary target: 500 questions or 200 words)
        const goalPercent = Math.min(100, Math.round((totalSolved / 200) * 100));

        // 5. Category Progress (for Bar Chart)
        const vProg = Math.min(100, Math.round((vocabIndex / 1000) * 100)); // 1000 verbs
        const nProg = Math.min(100, Math.round((nounIndex / 200) * 100)); // 200 nouns (approx)
        const rProg = Math.min(100, Math.round((completedReadings.length / 40) * 100)); // 40 readings total
        const gProg = Math.min(100, Math.round((completedGrammar.length / 50) * 100)); // 50 tests total

        setStats({
          solvedQuestions: totalSolved,
          learnedWords: learned,
          averageScore: Math.round(calculatedScore),
          weeklyGoal: goalPercent,
          vocabProgress: vProg,
          nounProgress: nProg,
          readingProgress: rProg,
          grammarProgress: gProg
        });

      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  const skillData = [
    { name: 'Fiiller', score: stats.vocabProgress },
    { name: 'İsimler', score: stats.nounProgress },
    { name: 'Okuma', score: stats.readingProgress },
    { name: 'Gramer', score: stats.grammarProgress },
  ];

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 pt-safe space-y-6 overflow-y-auto h-full pb-28 animate-fadeIn">
      {/* Welcome Message */}
      <div className="mb-2">
        <h1 className="text-2xl font-black text-white">Hoş geldin, {currentUser?.username.split('@')[0]} 👋</h1>
        <p className="text-white/50 text-sm font-medium">Bugünkü ilerlemen harika görünüyor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center space-x-4 hover:bg-white/10 transition premium-glow">
          <div className="p-3 bg-yellow-400/10 text-yellow-500 rounded-xl">
            <i className="ri-trophy-line text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Ortalama Skor</p>
            <h3 className="text-2xl font-black text-white">{stats.averageScore}</h3>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center space-x-4 hover:bg-white/10 transition premium-glow">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <i className="ri-book-open-line text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Çözülen Soru</p>
            <h3 className="text-2xl font-black text-white">{stats.solvedQuestions}</h3>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center space-x-4 hover:bg-white/10 transition premium-glow">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <i className="ri-brain-line text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Görülen Kelime</p>
            <h3 className="text-2xl font-black text-white">{stats.learnedWords}</h3>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center space-x-4 hover:bg-white/10 transition premium-glow">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <i className="ri-pulse-line text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Haftalık Hedef</p>
            <h3 className="text-2xl font-black text-white">%{stats.weeklyGoal}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3 relative z-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <i className="ri-bar-chart-2-line text-indigo-500" />
                Günlük Beceri Analizi
              </h3>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg w-fit">
                <i className="ri-refresh-line" /> Her gün Yenilenir
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <i className="ri-calendar-line text-indigo-400" />
              {today}
            </div>
          </div>

          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#1a1b2e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.5)', padding: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-bl-[100px] blur-3xl pointer-events-none"></div>
        </div>
      </div>

      {/* Recent Activity Mini List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 overflow-hidden relative">
        <h3 className="text-lg font-black text-white mb-6">Son Aktiviteler</h3>
        <div className="space-y-4">
          {stats.solvedQuestions === 0 ? (
            <p className="text-white/20 text-sm font-medium py-4">Henüz bir aktivite yok. Test çözmeye başla!</p>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <i className="ri-checkbox-circle-line text-xl" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">İlerleme Kaydedildi</p>
                  <p className="text-xs text-white/40 font-medium tracking-tight">Verileriniz başarıyla senkronize edildi.</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 active:scale-95 transition-transform">+10 XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Legal Links */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/40 mb-2">YDS PRO © 2025 Tüm Hakları Saklıdır</p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <button onClick={() => { playSound('click'); setShowLegalModal('TERMS'); }} className="text-white/50 hover:text-white/80 transition underline">
            Kullanım Koşulları
          </button>
          <span className="text-white/30">•</span>
          <button onClick={() => { playSound('click'); setShowLegalModal('PRIVACY'); }} className="text-white/50 hover:text-white/80 transition underline">
            Gizlilik Politikası
          </button>
        </div>
      </div>

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-fadeIn">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600" />
                {showLegalModal === 'TERMS' ? 'Kullanım Koşulları' : 'Gizlilik Politikası'}
              </h3>
              <button onClick={() => { playSound('click'); setShowLegalModal(null); }} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
              {showLegalModal === 'TERMS' ? (
                <>
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900">YDS PRO – Kullanıcı Sözleşmesi</h4>
                    <p><strong>1. Taraflar:</strong> Hizmet Sağlayıcı: YDS PRO | Kullanıcı: Uygulamayı kullanan kişi</p>
                    <p><strong>2. Sözleşmenin Konusu:</strong> Bu sözleşme, uygulamanın kullanımı, içeriklere erişim ve abonelik haklarını kapsar.</p>
                    <p><strong>3. Kullanım Şartlarının Kabulü:</strong> Uygulama indirildiğinde veya kullanıldığında sözleşme kabul edilmiş sayılır.</p>
                    <p><strong>4. Ücretlendirme:</strong> Kullanıcı, abonelik ücretlerini kabul eder. Abonelik otomatik yenilenir.</p>
                    <p><strong>5. Fikri Mülkiyet:</strong> Uygulamadaki tüm içerikler YDS PRO'ya aittir.</p>
                    <p><strong>6. Kullanım Kısıtlamaları:</strong> Kullanıcı içeriği çoğaltamaz, dağıtamaz, satamaz.</p>
                    <p><strong>7. Sözleşme İhlalleri:</strong> İhlal durumunda hesap kapatılabilir.</p>
                    <p><strong>8. Uygulanacak Hukuk:</strong> Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir.</p>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-slate-900">YDS PRO – Gizlilik Politikası</h4>
                  <p className="text-xs text-slate-500">Son Güncelleme: 28/01/2025</p>
                  <p>Bu Gizlilik Politikası, YDS PRO'nun kullanıcı bilgilerini nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklar.</p>
                  <p><strong>1. Toplanan Bilgiler:</strong> E-posta adresi, profil bilgileri, cihaz bilgileri, kullanım verileri.</p>
                  <p><strong>2. Bilgilerin Kullanım Amaçları:</strong> Uygulamanın çalışması, kullanıcı deneyimini geliştirme, abonelik yönetimi.</p>
                  <p><strong>3. Üçüncü Taraf Hizmetleri:</strong> Google Analytics, Firebase, App Store/Google Play.</p>
                  <p><strong>4. Verilerin Saklanması:</strong> Kullanıcı verileri güvenli şekilde saklanır.</p>
                  <p><strong>5. Kullanıcı Hakları:</strong> Bilgilerine erişme, düzenleme, hesabını silme hakları vardır.</p>
                  <p><strong>6. Güvenlik:</strong> Veriler modern güvenlik protokolleriyle korunur.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t bg-slate-50 rounded-b-2xl text-right">
              <button onClick={() => { playSound('click'); setShowLegalModal(null); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
