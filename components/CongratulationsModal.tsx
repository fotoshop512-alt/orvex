import React from 'react';
import { Trophy, Star, Sparkles, X } from 'lucide-react';

interface CongratulationsModalProps {
    title: string;
    message: string;
    score?: number;
    maxScore?: number;
    points?: number;
    onClose: () => void;
    colorTheme?: 'indigo' | 'blue' | 'purple' | 'emerald';
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
    title,
    message,
    score,
    maxScore,
    points,
    onClose,
    colorTheme = 'indigo'
}) => {
    const themeColors = {
        indigo: 'from-indigo-600 to-purple-600',
        blue: 'from-blue-600 to-cyan-600',
        purple: 'from-purple-600 to-pink-600',
        emerald: 'from-emerald-600 to-teal-600'
    };

    const gradient = themeColors[colorTheme];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${gradient} p-8 text-center relative overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
                        <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full"></div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    {/* Trophy icon with animation */}
                    <div className="relative z-10 mb-4">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border-2 border-white/30 shadow-2xl animate-bounce-slow">
                            <Trophy size={48} className="text-white" />
                        </div>

                        {/* Sparkles */}
                        <div className="flex justify-center gap-3 mb-2">
                            <Sparkles className="text-white/60 animate-pulse" size={16} />
                            <Sparkles className="text-white/80 animate-pulse delay-100" size={20} />
                            <Sparkles className="text-white/60 animate-pulse delay-200" size={16} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                        {message}
                    </p>

                    {/* Score display */}
                    {score !== undefined && maxScore !== undefined && (
                        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Star className="text-yellow-400" size={24} fill="currentColor" />
                                <span className="text-white/60 text-sm font-medium">Skorun</span>
                            </div>
                            <div className="text-4xl font-black text-white">
                                {score} <span className="text-white/40">/ {maxScore}</span>
                            </div>
                        </div>
                    )}

                    {/* Points earned */}
                    {points !== undefined && points > 0 && (
                        <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 mb-6 shadow-lg`}>
                            <div className="flex items-center justify-center gap-2">
                                <Trophy className="text-white" size={20} />
                                <span className="text-white font-bold text-lg">
                                    +{points} Puan Kazandın!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`w-full bg-gradient-to-r ${gradient} text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
                    >
                        <span>Harika!</span>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out forwards;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .delay-100 {
                    animation-delay: 100ms;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }
            `}} />
        </div>
    );
};

export default CongratulationsModal;
