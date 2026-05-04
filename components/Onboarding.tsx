import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Sparkles,
    BookOpen,
    Brain,
    Trophy,
    Headphones,
    Flame,
    Navigation2,
    CheckCircle2
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            id: 'welcome',
            title: 'Hoş Geldin Akademisyen!',
            description: "Ben Orvex, YDS ve YÖKDİL yolculuğunda senin rehberin olacağım. Başarıya giden bu yolda birlikte yükselmeye hazır mısın?",
            phoenixAction: 'wave',
            color: '#6366f1', // Indigo
            icon: Sparkles
        },
        {
            id: 'vocab',
            title: 'Kelime Bilgini Güçlendir',
            description: "WordHub ile binlerce fiil, isim ve sıfatı interaktif testlerle öğren. Kelimeler artık hafızandan silinmeyecek.",
            phoenixAction: 'study',
            color: '#3b82f6', // Blue
            icon: Brain
        },
        {
            id: 'reading',
            title: 'Okuma Becerisi Kazan',
            description: "Seviyene özel seçilmiş kitaplar ve Pro versiyon kitaplarla okuma hızını artır. Bilmediğin kelimelere anında dokunarak bak!",
            phoenixAction: 'read',
            color: '#8b5cf6', // Violet
            icon: BookOpen
        },
        {
            id: 'practice',
            title: 'Sınavlara Hükmet',
            description: "Mini sınavlar ve özel gramer modülleri ile gerçek sınav heyecanını yaşa. Eksiklerini anında tespit et ve kapat.",
            phoenixAction: 'fire',
            color: '#ec4899', // Pink
            icon: Navigation2
        },
        {
            id: 'community',
            title: 'Rekabet Et ve Dinlen',
            description: "Akademik podcastlerimizi dinleyerek kulağını alıştır ve Liderlik Tablosunda en iyiler arasında yerini al.",
            phoenixAction: 'lead',
            color: '#f59e0b', // Amber
            icon: Trophy
        }
    ];

    // Correction for icon name
    steps[3].icon = Flame;

    const handleNext = () => {
        playSound('click');
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] z-[99999] flex flex-col items-center justify-center overflow-hidden font-display text-white">
            {/* Background Magic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px]"
                    style={{ background: `radial-gradient(circle, ${step.color}44 0%, transparent 70%)` }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px]"
                    style={{ background: `radial-gradient(circle, ${step.color}33 0%, transparent 70%)` }}
                />
            </div>

            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
                {/* Orvex Container - Persistent across steps to prevent flicker */}
                <div className="relative w-72 h-72 mb-8">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Orvex Image */}
                        <div className="relative z-20">
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative"
                            >
                                <img
                                    src="/phoenix.png"
                                    alt="Orvex"
                                    className="w-64 h-64 object-contain drop-shadow-[0_0_35px_rgba(255,165,0,0.3)]"
                                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                                />
                            </motion.div>

                            {/* Glow Effect */}
                            <motion.div
                                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-t from-orange-500/15 to-transparent blur-3xl rounded-full -z-10"
                            />
                        </div>

                        {/* Particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400/60 rounded-full blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: [-20, -120],
                                    x: (i - 2.5) * 25,
                                    scale: [1, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Card - Animates only this part */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${currentStep}`}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Icon */}
                        <div className="absolute -top-10 -right-10 opacity-5">
                            <step.icon size={160} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                                style={{ backgroundColor: `${step.color}22`, border: `1px solid ${step.color}44` }}
                            >
                                <step.icon size={32} style={{ color: step.color }} />
                            </div>

                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight leading-tight">
                                {step.title}
                            </h2>

                            <p className="text-slate-300 text-base leading-relaxed mb-8">
                                {step.description}
                            </p>

                            <div className="flex gap-2 mb-8">
                                {steps.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        animate={{
                                            width: i === currentStep ? 32 : 8,
                                            backgroundColor: i === currentStep ? step.color : 'rgba(255,255,255,0.1)'
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full relative group overflow-hidden py-4 rounded-2xl font-bold text-lg transition-all"
                            >
                                {/* Button Background Animation */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                    initial={false}
                                    animate={{ backgroundColor: step.color }}
                                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)` }}
                                />

                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />

                                <span className="relative flex items-center justify-center gap-2">
                                    {currentStep === steps.length - 1 ? 'Başarıya Kanat Çırp' : 'Devam Et'}
                                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="mt-8 flex items-center gap-6">
                    <button
                        onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                        className={`text-slate-500 font-medium text-sm transition-opacity ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        Geri Git
                    </button>
                    <button
                        onClick={onComplete}
                        className="text-slate-500 font-medium text-sm hover:text-white transition-colors"
                    >
                        Tanıtımı Atla
                    </button>
                </div>
            </div>

            {/* Global Styles for Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float-soft {
                    animation: float-soft 3s ease-in-out infinite;
                }
            `}} />
        </div>
    );
};

export default Onboarding;
