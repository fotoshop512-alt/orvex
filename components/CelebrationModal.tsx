import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, X, Zap, Award, Target } from 'lucide-react';
import { playSound } from '../utils/sound';

interface CelebrationModalProps {
    type: 'test' | 'book' | 'reading' | 'grammar';
    title: string;
    subtitle?: string;
    score?: number;
    maxScore?: number;
    points: number;
    onClose: () => void;
    colorTheme?: 'indigo' | 'blue' | 'purple' | 'emerald' | 'amber';
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
    type,
    title,
    subtitle,
    score,
    maxScore,
    points,
    onClose,
    colorTheme = 'indigo'
}) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Play success sound
        playSound('success');

        // Animate content in
        setTimeout(() => setShowContent(true), 100);
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 3000);
    }, []);

    const themeConfig = {
        indigo: {
            gradient: 'from-indigo-600 via-purple-600 to-pink-600',
            glow: 'shadow-indigo-500/50',
            icon: 'text-indigo-400',
            bg: 'bg-indigo-500/20',
            border: 'border-indigo-500/30'
        },
        blue: {
            gradient: 'from-blue-600 via-cyan-600 to-teal-600',
            glow: 'shadow-blue-500/50',
            icon: 'text-blue-400',
            bg: 'bg-blue-500/20',
            border: 'border-blue-500/30'
        },
        purple: {
            gradient: 'from-purple-600 via-pink-600 to-rose-600',
            glow: 'shadow-purple-500/50',
            icon: 'text-purple-400',
            bg: 'bg-purple-500/20',
            border: 'border-purple-500/30'
        },
        emerald: {
            gradient: 'from-emerald-600 via-green-600 to-teal-600',
            glow: 'shadow-emerald-500/50',
            icon: 'text-emerald-400',
            bg: 'bg-emerald-500/20',
            border: 'border-emerald-500/30'
        },
        amber: {
            gradient: 'from-amber-600 via-orange-600 to-red-600',
            glow: 'shadow-amber-500/50',
            icon: 'text-amber-400',
            bg: 'bg-amber-500/20',
            border: 'border-amber-500/30'
        }
    };

    const theme = themeConfig[colorTheme];

    const getIcon = () => {
        switch (type) {
            case 'test':
                return <Target size={64} className={theme.icon} strokeWidth={2} />;
            case 'book':
                return <Award size={64} className={theme.icon} strokeWidth={2} />;
            case 'reading':
                return <Star size={64} className={theme.icon} strokeWidth={2} fill="currentColor" />;
            case 'grammar':
                return <Trophy size={64} className={theme.icon} strokeWidth={2} />;
            default:
                return <Trophy size={64} className={theme.icon} strokeWidth={2} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Content */}
            <div className={`relative bg-gradient-to-br from-[#1a1d3a] to-[#0f0d1e] rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden border-2 ${theme.border} ${theme.glow} shadow-2xl transform transition-all duration-500 scrollbar-hide ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full border border-white animate-ping"
                                style={{
                                    width: `${Math.random() * 80 + 20}px`,
                                    height: `${Math.random() * 80 + 20}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                {/* Header Section */}
                <div className={`relative bg-gradient-to-r ${theme.gradient} p-6 text-center overflow-hidden`}>
                    {/* Sparkles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Sparkles className="absolute top-4 left-4 text-white/30 animate-pulse" size={16} />
                        <Sparkles className="absolute top-6 right-6 text-white/40 animate-pulse delay-100" size={20} />
                        <Sparkles className="absolute bottom-4 left-8 text-white/30 animate-pulse delay-200" size={14} />
                        <Sparkles className="absolute bottom-6 right-4 text-white/40 animate-pulse delay-300" size={18} />
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 mb-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border-2 border-white/30 shadow-xl animate-bounce-slow">
                            {type === 'test' ? <Target size={40} className={theme.icon} strokeWidth={2.5} /> :
                                type === 'book' ? <Award size={40} className={theme.icon} strokeWidth={2.5} /> :
                                    type === 'reading' ? <Star size={40} className={theme.icon} strokeWidth={2.5} fill="currentColor" /> :
                                        <Trophy size={40} className={theme.icon} strokeWidth={2.5} />}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="relative z-10 text-2xl font-black text-white mb-1 drop-shadow-lg animate-slideDown">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="relative z-10 text-white/80 text-sm font-medium animate-slideDown delay-100">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                    {/* Score Display */}
                    {score !== undefined && maxScore !== undefined && (
                        <div className={`${theme.bg} ${theme.border} border border-white/10 rounded-xl p-4 text-center`}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Star className={theme.icon} size={18} fill="currentColor" />
                                <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">SKORUN</span>
                            </div>
                            <div className="text-3xl font-black text-white">
                                {score}
                                <span className="text-white/40 text-xl font-bold"> / {maxScore}</span>
                            </div>
                            {/* Percentage Bar */}
                            <div className="mt-2">
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-1000 ease-out`}
                                        style={{ width: `${(score / maxScore) * 100}%` }}
                                    />
                                </div>
                                <p className="text-white/50 text-[10px] font-bold mt-1.5">
                                    %{Math.round((score / maxScore) * 100)} Başarı
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Points Earned */}
                    <div className={`relative bg-gradient-to-br ${theme.gradient} rounded-xl p-5 shadow-lg overflow-hidden`}>
                        <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Zap className="text-white/80" size={16} fill="white" />
                                <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest">KAZANDIĞIN PUAN</span>
                                <Zap className="text-white/80" size={16} fill="white" />
                            </div>
                            <div className="text-4xl font-black text-white">
                                +{points}
                            </div>
                            <p className="text-white/60 text-[10px] font-medium mt-1">Toplam puanına eklendi!</p>
                        </div>
                    </div>

                    {/* Harika Button */}
                    <button
                        onClick={onClose}
                        className={`w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3.5 rounded-xl font-black text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 group shadow-lg`}
                    >
                        <Trophy className="opacity-60 group-hover:rotate-12 transition-transform" size={18} />
                        <span>Harika!</span>
                        <Trophy className="opacity-60 group-hover:-rotate-12 transition-transform" size={18} />
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .animate-slideDown {
                    animation: slideDown 0.6s ease-out forwards;
                }

                .animate-confetti {
                    animation: confetti linear forwards;
                }

                .delay-100 {
                    animation-delay: 100ms;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }
            `}} />
        </div>
    );
};

export default CelebrationModal;
