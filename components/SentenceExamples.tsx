import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Copy, Check, RefreshCw, BookOpen, Crown, Lock } from 'lucide-react';
import { storageService, UserProfile } from '../services/storage';
import { generateSentenceExamples, AIResponse } from '../services/groqAI';
import { playSound } from '../utils/sound';
import PaymentModal from './PaymentModal';

interface SentenceExamplesProps {
  currentUser: UserProfile | null;
}

const FREE_USAGE_LIMIT = 1; // Normal kullanıcılar için ücretsiz kullanım limiti

const SentenceExamples: React.FC<SentenceExamplesProps> = ({ currentUser }) => {
  const [searchWord, setSearchWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isPro = currentUser?.isPro || currentUser?.role === 'ADMIN';
  const hasRemainingFreeUse = usageCount < FREE_USAGE_LIMIT;
  const canUse = isPro || hasRemainingFreeUse;

  useEffect(() => {
    if (currentUser) {
      // Son aramaları Firebase'den yükle
      storageService.getUserProgress(currentUser.uid, 'orvex_search_history')
        .then(val => {
          if (Array.isArray(val)) setRecentSearches(val);
        });

      // Kullanım sayısını yükle (Firebase'den)
      storageService.getUserProgress(currentUser.uid, 'orvex_usage_count')
        .then(val => {
          if (typeof val === 'number') setUsageCount(val);
        });
    }
  }, [currentUser]);

  const handleSearch = async () => {
    if (!searchWord.trim()) return;

    // Pro değilse ve ücretsiz hakkı bittiyse modal göster
    if (!canUse) {
      setShowPaymentModal(true);
      playSound('click');
      return;
    }

    playSound('click');
    setLoading(true);
    setResult(null);

    const word = searchWord.trim().toLowerCase();
    const response = await generateSentenceExamples(word);
    setResult(response);
    setLoading(false);

    // Başarılı aramada işlemleri yap
    if (!response.error && currentUser) {
      // Son aramalara ekle ve Firebase'e kaydet
      const newSearches = [word, ...recentSearches.filter(s => s !== word)].slice(0, 10);
      setRecentSearches(newSearches);
      storageService.saveUserProgress(currentUser.uid, 'orvex_search_history', newSearches);

      // Kullanım sayısını artır (sadece Pro değilse)
      if (!isPro) {
        const newUsageCount = usageCount + 1;
        setUsageCount(newUsageCount);
        storageService.saveUserProgress(currentUser.uid, 'orvex_usage_count', newUsageCount);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    playSound('click');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const popularWords = ['determine', 'significant', 'approach', 'establish', 'evidence', 'consequence', 'acquire', 'perceive'];

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Orvex AI
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            Bir kelime yaz, yapay zeka örnek cümleler üretsin
          </p>

          {/* Usage Info for non-Pro users */}
          {!isPro && (
            <div className="mt-4">
              {hasRemainingFreeUse ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <span className="text-emerald-400 text-sm font-medium">
                    🎁 {FREE_USAGE_LIMIT - usageCount} ücretsiz deneme hakkınız var
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
                  <Lock size={16} className="text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    Ücretsiz hakkınız bitti - Pro'ya geçin
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Pro Badge */}
          {isPro && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <Crown size={16} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Sınırsız kullanım</span>
            </div>
          )}
        </div>

        {/* Search Box */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-white/40" size={22} />
          </div>
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="İngilizce bir kelime yazın... (örn: determine)"
            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-32 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchWord.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${canUse
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
              }`}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : canUse ? (
              <>
                <Sparkles size={18} />
                Üret
              </>
            ) : (
              <>
                <Crown size={18} />
                Pro
              </>
            )}
          </button>
        </div>

        {/* Pro Upgrade Banner for users who used their free trial */}
        {!isPro && !hasRemainingFreeUse && !result && !loading && (
          <div className="mb-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center">
            <Crown size={40} className="text-amber-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Orvex AI'ın Gücünü Keşfedin!</h3>
            <p className="text-white/60 text-sm mb-4">
              Pro üyelik ile sınırsız kelime arayın, örnek cümleler üretin ve İngilizcenizi geliştirin.
            </p>
            <button
              onClick={() => {
                setShowPaymentModal(true);
                playSound('click');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition shadow-lg shadow-amber-500/30"
            >
              <span className="flex items-center gap-2">
                <Crown size={20} />
                Pro'ya Yükselt
              </span>
            </button>
          </div>
        )}

        {/* Popular Words */}
        {!result && !loading && canUse && (
          <div className="mb-8">
            <p className="text-white/40 text-sm mb-3">Popüler YDS Kelimeleri:</p>
            <div className="flex flex-wrap gap-2">
              {popularWords.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    setSearchWord(word);
                    playSound('click');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-full text-white/70 hover:text-white text-sm transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!result && !loading && recentSearches.length > 0 && canUse && (
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 group">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-white/40 text-sm font-bold uppercase tracking-wider">Son Aramalar</p>
              <button
                onClick={() => {
                  setRecentSearches([]);
                  if (currentUser) {
                    storageService.saveUserProgress(currentUser.uid, 'orvex_search_history', []);
                  }
                  playSound('click');
                }}
                className="text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors py-1 px-2 hover:bg-white/10 rounded-md"
              >
                Geçmişi Sil
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((word, i) => (
                <div key={i} className="flex items-center gap-1 group/item">
                  <button
                    onClick={() => {
                      setSearchWord(word);
                      playSound('click');
                    }}
                    className="px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-xl text-violet-300 hover:text-violet-200 text-sm transition-all"
                  >
                    {word}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-violet-400" size={28} />
            </div>
            <p className="text-white/60 mt-6">Orvex AI cümle üretiyor...</p>
          </div>
        )}

        {/* Error State */}
        {result?.error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
            <p className="text-rose-300">{result.error}</p>
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6 animate-fadeIn">
            {/* Word Header */}
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 rounded-2xl p-6">
              <h2 className="text-3xl font-bold text-white capitalize mb-2">{result.word}</h2>
              <p className="text-violet-300 text-lg">{result.meaning}</p>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <BookOpen size={20} className="text-violet-400" />
                  Örnek Cümleler
                </h3>
                {canUse && (
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition"
                  >
                    <RefreshCw size={16} />
                    Yenile
                  </button>
                )}
              </div>

              {result.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition group"
                >
                  {/* English Sentence */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-white text-lg leading-relaxed flex-1">
                      {example.english.split(new RegExp(`(${result.word})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === result.word.toLowerCase() ? (
                          <span key={i} className="text-violet-400 font-semibold">{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                    <button
                      onClick={() => handleCopy(example.english, index)}
                      className="p-2 hover:bg-white/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Kopyala"
                    >
                      {copiedIndex === index ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="text-white/60" />
                      )}
                    </button>
                  </div>

                  {/* Turkish Translation */}
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">TR</span>
                    <p className="text-sm">{example.turkish}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Another or Upgrade */}
            <div className="text-center pt-4">
              {canUse ? (
                <button
                  onClick={() => {
                    setResult(null);
                    setSearchWord('');
                    playSound('click');
                  }}
                  className="text-white/60 hover:text-white transition"
                >
                  Başka bir kelime ara →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowPaymentModal(true);
                    playSound('click');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition shadow-lg shadow-amber-500/30 flex items-center gap-2 mx-auto"
                >
                  <Crown size={20} />
                  Daha fazla arama için Pro'ya geçin
                </button>
              )}
            </div>
          </div>
        )}

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
};

export default SentenceExamples;
