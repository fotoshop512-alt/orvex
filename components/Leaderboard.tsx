
import React, { useEffect, useState } from 'react';
import { UserProfile, storageService } from '../services/storage';
import { Trophy, Medal, Crown, User, Loader2, Star, Activity, TrendingUp, RefreshCw, BookOpen } from 'lucide-react';

// Avatar seçenekleri - ProfileSettings ile aynı
const AVATAR_OPTIONS = [
    { id: 1, img: 'assets/avatars/male1.png', bg: 'from-indigo-600 to-violet-700' },
    { id: 2, img: 'assets/avatars/female1.png', bg: 'from-rose-600 to-pink-700' },
    { id: 3, img: 'assets/avatars/male2.png', bg: 'from-blue-700 to-indigo-800' },
    { id: 4, img: 'assets/avatars/female2.png', bg: 'from-emerald-600 to-teal-700' },
    { id: 5, emoji: '🦁', bg: 'from-amber-500 to-orange-600' },
    { id: 6, emoji: '🐯', bg: 'from-orange-600 to-red-700' },
    { id: 7, emoji: '🦄', bg: 'from-purple-500 to-fuchsia-600' },
    { id: 8, emoji: '🐉', bg: 'from-emerald-600 to-green-700' },
    { id: 9, emoji: '🦅', bg: 'from-sky-500 to-blue-700' },
    { id: 10, emoji: '🐺', bg: 'from-slate-600 to-zinc-800' },
];

interface LeaderboardProps {
    currentUser: UserProfile | null;
}

// Kullanıcı avatar cache
interface UserAvatarCache {
    [uid: string]: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
    const [leaders, setLeaders] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [myScore, setMyScore] = useState(0);
    const [userAvatars, setUserAvatars] = useState<UserAvatarCache>({});
    const [userStats, setUserStats] = useState({
        wordTests: 0,
        completedBooks: 0,
        grammarTests: 0,
        miniExams: 0
    });

    const calculateAndUpdateScore = async () => {
        if (!currentUser) return;

        // 1. Calculate Current User's Score locally from Progress
        const completedVocabQuizzes = await storageService.getUserProgress(currentUser.uid, 'completedVocabQuizzes') || [];
        const completedNounQuizzes = await storageService.getUserProgress(currentUser.uid, 'completedNounQuizzes') || [];
        const completedAdjectiveQuizzes = await storageService.getUserProgress(currentUser.uid, 'completedAdjectiveQuizzes') || [];
        const completedMiniExams = await storageService.getUserProgress(currentUser.uid, 'miniExamResults') || {};
        const completedGrammar = await storageService.getUserProgress(currentUser.uid, 'completedGrammarTests') || [];
        const bookProgress = await storageService.getUserProgress(currentUser.uid, 'bookProgress') || {};

        // Count completed books (where progress equals total pages)
        // Level A and B books have 20 pages, Level C books have 30 pages
        const completedBooksCount = Object.entries(bookProgress).filter(([bookId, progress]) => {
            const id = parseInt(bookId);
            // Level A: ids 1-10 (20 pages)
            // Level B: ids 1-10 (20 pages) 
            // Level C: ids 1-15 (30 pages)
            // We need to check if progress >= required pages
            // For simplicity, if progress >= 20, it's completed (covers A and B)
            // If progress >= 30, it's a completed C level book
            return (progress as number) >= 20;
        }).length;

        // Update stats
        setUserStats({
            wordTests: completedVocabQuizzes.length + completedNounQuizzes.length + completedAdjectiveQuizzes.length,
            completedBooks: completedBooksCount,
            grammarTests: completedGrammar.length,
            miniExams: Array.isArray(completedMiniExams)
                ? completedMiniExams.filter((v: any) => v !== undefined && v !== null).length
                : typeof completedMiniExams === 'object'
                    ? Object.keys(completedMiniExams).length
                    : 0
        });

        // Use the actual user score from Firebase
        const score = currentUser.score || 0;
        setMyScore(score);

        // Note: Score is updated by individual components (WordHub, GrammarHub, etc.)
        // when tests/books/readings are completed
    };

    const fetchLeaders = async () => {
        const fetchedLeaders = await storageService.getLeaderboard(50);
        // Admin kullanıcıları liderlik tablosundan filtrele
        const nonAdminLeaders = fetchedLeaders.filter(user => user.role !== 'ADMIN');
        setLeaders(nonAdminLeaders);

        // Avatarları direkt user.avatarId'den al (daha hızlı ve güncel)
        const avatarCache: UserAvatarCache = {};
        nonAdminLeaders.forEach((user) => {
            avatarCache[user.uid] = user.avatarId || 1; // Default avatar 1
        });
        setUserAvatars(avatarCache);
    };

    const init = async () => {
        setLoading(true);
        try {
            await calculateAndUpdateScore();
            await fetchLeaders();
        } catch (error) {
            console.error("Leaderboard sync error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await calculateAndUpdateScore(); // Recalculate my score just in case
            await fetchLeaders();
        } catch (error) {
            console.error("Refresh error:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            init();
        }
    }, [currentUser?.uid]); // Only re-run when user ID changes, not the whole object

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center text-indigo-600">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    const getRankStyle = (index: number) => {
        if (index === 0) return "bg-gradient-to-br from-yellow-300 to-amber-500 text-white border-transparent shadow-yellow-500/20";
        if (index === 1) return "bg-gradient-to-br from-slate-200 to-slate-400 text-white border-transparent shadow-slate-400/20";
        if (index === 2) return "bg-gradient-to-br from-orange-300 to-orange-500 text-white border-transparent shadow-orange-500/20";
        return "bg-white/10 text-white/60 border-white/10";
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown size={20} className="text-yellow-500 fill-yellow-500" />;
        if (index === 1) return <Medal size={20} className="text-slate-400 fill-slate-300" />;
        if (index === 2) return <Medal size={20} className="text-orange-500 fill-orange-400" />;
        return <span className="font-bold text-sm w-5 text-center">{index + 1}</span>;
    };

    return (
        <div className="p-4 md:p-8 pt-safe pb-32 h-full overflow-y-auto">
            {/* Header Stats */}
            <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden animate-fadeIn border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30 shadow-2xl relative group">
                            <Trophy size={40} className="text-amber-400 drop-shadow-[0_4px_8px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent rounded-2xl"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Liderlik Tablosu</h1>
                            <p className="text-white/60 text-sm font-medium">En çalışkan öğrencilerle yarış!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                            <div className="bg-black/20 p-3 md:p-4 rounded-2xl backdrop-blur-sm border border-white/10 min-w-[100px] text-center">
                                <span className="text-[10px] md:text-xs text-white/60 font-bold uppercase block mb-1">Puanım</span>
                                <span className="text-xl md:text-2xl font-black flex items-center justify-center gap-1">
                                    {myScore} <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                </span>
                            </div>
                            <div className="bg-black/20 p-3 md:p-4 rounded-2xl backdrop-blur-sm border border-white/10 min-w-[100px] text-center">
                                <span className="text-[10px] md:text-xs text-white/60 font-bold uppercase block mb-1">Sıralamam</span>
                                <span className="text-xl md:text-2xl font-black flex items-center justify-center gap-1">
                                    #{leaders.findIndex(u => u.uid === currentUser?.uid) + 1 > 0 ? leaders.findIndex(u => u.uid === currentUser?.uid) + 1 : '-'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white border border-white/10 active:scale-95"
                            title="Listeyi Yenile"
                        >
                            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Progress Stats */}
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-2">
                        <Star size={18} className="text-blue-400" />
                        <span className="text-xs text-white/60 font-bold uppercase">Kelime</span>
                    </div>
                    <div className="text-2xl font-black text-white">{userStats.wordTests}</div>
                    <div className="text-xs text-white/40 mt-1">Tamamlandı</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={18} className="text-emerald-400" />
                        <span className="text-xs text-white/60 font-bold uppercase">Okuma</span>
                    </div>
                    <div className="text-2xl font-black text-white">{userStats.completedBooks}</div>
                    <div className="text-xs text-white/40 mt-1">Okundu</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={18} className="text-purple-400" />
                        <span className="text-xs text-white/60 font-bold uppercase">Gramer</span>
                    </div>
                    <div className="text-2xl font-black text-white">{userStats.grammarTests}</div>
                    <div className="text-xs text-white/40 mt-1">Çözüldü</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy size={18} className="text-orange-400" />
                        <span className="text-xs text-white/60 font-bold uppercase">Deneme</span>
                    </div>
                    <div className="text-2xl font-black text-white">{userStats.miniExams}</div>
                    <div className="text-xs text-white/40 mt-1">Tamamlandı</div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-4xl mx-auto animate-fadeIn">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-primary" /> En İyi 50 Öğrenci
                        </h3>
                        {refreshing && <span className="text-xs text-primary font-medium animate-pulse">Güncelleniyor...</span>}
                    </div>

                    <div className="divide-y divide-white/5">
                        {leaders.map((user, index) => {
                            const isMe = user.uid === currentUser?.uid;
                            const avatarId = userAvatars[user.uid] || 1;
                            const avatarData = AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];
                            return (
                                <div
                                    key={user.uid}
                                    className={`flex items-center p-4 transition hover:bg-white/5 ${isMe ? 'bg-primary/10 ring-1 ring-primary/20' : ''}`}
                                >
                                    {/* Sıralama */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border shrink-0 font-black shadow-lg text-sm transition-all duration-300 ${getRankStyle(index)}`}>
                                        {getRankIcon(index)}
                                    </div>

                                    {/* Avatar */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shrink-0 bg-gradient-to-br ${avatarData.bg} shadow-xl overflow-hidden border border-white/20 relative group`}>
                                        {avatarData.img ? (
                                            <img src={avatarData.img} alt="Ava" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-2xl drop-shadow-md">{avatarData.emoji}</span>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold truncate ${isMe ? 'text-primary' : 'text-white'}`}>
                                                {user.username.split('@')[0]}
                                            </span>
                                            {user.isPro && (
                                                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 border border-amber-500/30 shadow-sm">
                                                    <Crown size={8} /> PRO
                                                </span>
                                            )}
                                            {isMe && (
                                                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-primary/20">
                                                    SEN
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-white/40 flex items-center gap-1">
                                            <Activity size={10} /> {user.role === 'ADMIN' ? 'Yönetici' : 'Öğrenci'}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-mono font-black text-white text-lg tracking-tight">
                                            {user.score || 0}
                                        </div>
                                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">XP</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {leaders.length === 0 && (
                        <div className="p-12 text-center text-white/40 flex flex-col items-center">
                            <Trophy size={48} className="text-white/20 mb-4" />
                            <p>Henüz sıralama verisi yok. İlk çözen sen ol!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
