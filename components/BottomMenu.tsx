
import React, { useRef, useEffect } from 'react';
import { AppView } from '../types';
import { UserProfile } from '../services/storage';
import { Library, BookOpen, PenTool, LogOut, Lock, ShieldCheck, Crown, Settings, Trophy, Sparkles, FileText, GraduationCap, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { playSound } from '../utils/sound';

interface BottomMenuProps {
    currentUser: UserProfile | null;
    currentView: AppView;
    onChangeView: (view: AppView) => void;
    onLogout: () => void;
    visible: boolean;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ currentUser, currentView, onChangeView, onLogout, visible }) => {
    const isPro = currentUser?.isPro || false;
    const isAdmin = currentUser?.role === 'ADMIN';
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [dragPos, setDragPos] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const dragRef = useRef<HTMLDivElement>(null);

    const menuItems = [
        { id: AppView.LEADERBOARD, label: 'Liderlik', icon: <i className="ri-trophy-fill text-2xl" />, activeColor: 'text-yellow-400', isPro: false },
        { id: AppView.VERBS, label: 'Fiiller', icon: <i className="ri-book-open-line text-2xl" />, activeColor: 'text-indigo-400', isPro: false },
        { id: AppView.NOUNS, label: 'İsimler', icon: <i className="ri-text-snippet text-2xl" />, activeColor: 'text-blue-400', isPro: false },
        { id: AppView.ADJECTIVES, label: 'Sıfatlar', icon: <i className="ri-sparkling-2-line text-2xl" />, activeColor: 'text-purple-400', isPro: false },
        { id: AppView.SENTENCE_EXAMPLES, label: 'Orvex AI', icon: <i className="ri-magic-line text-2xl" />, activeColor: 'text-emerald-400', isPro: true },
        { id: AppView.BOOKS, label: 'Kitaplar', icon: <i className="ri-book-3-line text-2xl" />, activeColor: 'text-amber-400', isPro: false },
        { id: AppView.PODCAST, label: 'Podcast', icon: <i className="ri-headphone-line text-2xl" />, activeColor: 'text-rose-400', isPro: false },
        { id: AppView.MINI_EXAMS, label: 'Denemeler', icon: <i className="ri-file-list-3-line text-2xl" />, activeColor: 'text-pink-400', isPro: true },
        { id: AppView.PRO_BOOKS, label: 'Pro Kitap', icon: <i className="ri-graduation-cap-line text-2xl" />, activeColor: 'text-cyan-400', isPro: true },
        { id: AppView.GRAMMAR, label: 'Gramer', icon: <i className="ri-ball-pen-line text-2xl" />, activeColor: 'text-orange-400', isPro: true },
        { id: AppView.FILL_IN, label: 'Boşluk', icon: <i className="ri-edit-box-line text-2xl" />, activeColor: 'text-pink-400', isPro: true },
    ];

    if (isAdmin) {
        menuItems.push({ id: AppView.ADMIN, label: 'Admin', icon: <i className="ri-shield-star-line text-2xl" />, activeColor: 'text-red-400', isPro: false });
    }

    const settingsItem = { id: AppView.SETTINGS, label: 'Ayarlar', icon: <i className="ri-settings-4-line text-2xl" />, activeColor: 'text-slate-200' };

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // Calculate position from bottom-right
        const x = window.innerWidth - clientX - 28; // 28 is half of button width
        const y = window.innerHeight - clientY - 28;

        setDragPos({ x, y });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleTouchMove as any);
            window.addEventListener('mouseup', handleTouchEnd);
            window.addEventListener('touchmove', handleTouchMove as any, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleTouchMove as any);
            window.removeEventListener('mouseup', handleTouchEnd);
            window.removeEventListener('touchmove', handleTouchMove as any);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    if (!visible) return null;

    if (isCollapsed) {
        return (
            <div
                className="fixed z-[99999]"
                style={{
                    bottom: dragPos.y ? `${dragPos.y}px` : '1.5rem',
                    right: dragPos.x ? `${dragPos.x}px` : '1rem',
                    touchAction: 'none'
                }}
                onMouseDown={handleTouchStart}
                onTouchStart={handleTouchStart}
            >
                <button
                    onClick={() => {
                        if (!isDragging) {
                            playSound('click');
                            setIsCollapsed(false);
                        }
                    }}
                    className="w-14 h-14 bg-[#1a1b2e] rounded-full flex items-center justify-center text-white shadow-2xl border border-white/10 active:scale-90 transition-transform cursor-move"
                >
                    <i className="ri-menu-5-line text-2xl" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[99999] flex flex-col items-center animate-in slide-in-from-bottom-10 fade-in duration-500 pointer-events-none p-4 pb-safe">

            {/* Collapse Button */}
            <div className="pointer-events-auto mb-2">
                <button
                    onClick={() => {
                        playSound('click');
                        setIsCollapsed(true);
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/50 hover:text-white flex items-center justify-center border border-white/10 transition hover:bg-black/60"
                >
                    <i className="ri-arrow-down-s-line" />
                </button>
            </div>

            <div
                className="pointer-events-auto bg-[#1a1b2e] shadow-2xl shadow-black/50 rounded-full px-2 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full border border-white/10 relative"
                ref={scrollRef}
            >
                {menuItems.map((item, index) => {
                    const isLocked = item.isPro && !isPro && !isAdmin;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                playSound('click');
                                onChangeView(item.id);
                            }}
                            className={`
                                flex flex-col items-center justify-center min-w-[72px] h-[72px] px-2 rounded-2xl transition-all duration-300 relative group shrink-0
                                ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                                active:scale-90
                            `}
                        >
                            <div className={`
                                flex items-center justify-center transition-all duration-300
                                ${isActive ? `${item.activeColor} scale-110` : 'text-slate-400 group-hover:text-slate-200'}
                            `}>
                                {item.icon}
                            </div>

                            <span className={`
                                text-[10px] font-bold mt-1 transition-all duration-300 whitespace-nowrap
                                ${isActive ? 'text-white' : 'text-slate-400 opacity-60'}
                            `}>
                                {item.label}
                            </span>

                            {isLocked && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-amber-500/50">
                                    <i className="ri-lock-2-fill text-[8px] text-amber-400" />
                                </div>
                            )}

                            {isActive && (
                                <div className={`absolute bottom-1 w-6 h-0.5 rounded-full ${item.activeColor.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
                            )}
                        </button>
                    );
                })}

                <div className="w-[1px] h-8 bg-white/10 mx-1 shrink-0" />

                {/* Settings Button */}
                <button
                    onClick={() => {
                        playSound('click');
                        onChangeView(settingsItem.id);
                    }}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[72px] rounded-2xl transition-all ${currentView === settingsItem.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                    <div className={`${currentView === settingsItem.id ? settingsItem.activeColor : 'text-slate-400'} flex items-center justify-center`}>
                        {settingsItem.icon}
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${currentView === settingsItem.id ? 'text-white' : 'text-slate-400 opacity-60'}`}>
                        {settingsItem.label}
                    </span>
                </button>

                {/* Logout Button */}
                <button
                    onClick={() => {
                        playSound('click');
                        onLogout();
                    }}
                    className="flex flex-col items-center justify-center min-w-[70px] h-[72px] rounded-2xl hover:bg-white/5 group"
                >
                    <div className="text-slate-400 group-hover:text-rose-400 transition-colors flex items-center justify-center">
                        <i className="ri-logout-box-r-line text-2xl" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-400 opacity-60 group-hover:text-rose-400 transition-all">
                        Çıkış
                    </span>
                </button>
            </div>
        </div>
    );
};

export default BottomMenu;
