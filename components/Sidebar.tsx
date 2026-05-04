
import React, { useState } from 'react';
import { AppView } from '../types';
import { UserProfile } from '../services/storage';
import { Library, BookOpen, PenTool, LogOut, Lock, ShieldCheck, Crown, Settings, X, Tag, Trophy, Sparkles, FileText, GraduationCap } from 'lucide-react';
import { playSound } from '../utils/sound';
import PaymentModal from './PaymentModal';

interface SidebarProps {
  currentUser: UserProfile | null;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onChangeView, isOpen, toggleSidebar, onLogout }) => {
  const isPro = currentUser?.isPro || false;
  const isAdmin = currentUser?.role === 'ADMIN';
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const menuItems = [
    { id: AppView.LEADERBOARD, label: 'Liderlik Tablosu', icon: <Trophy size={20} />, emoji: '🏆', isPro: false },
    { id: AppView.VERBS, label: 'Fiiller', icon: <Library size={20} />, emoji: '📖', isPro: false },
    { id: AppView.NOUNS, label: 'İsimler', icon: <Tag size={20} />, emoji: '🏷️', isPro: false },
    { id: AppView.ADJECTIVES, label: 'Sıfatlar', icon: <Sparkles size={20} />, emoji: '✨', isPro: false },
    { id: AppView.SENTENCE_EXAMPLES, label: 'Orvex AI', icon: <Sparkles size={20} />, emoji: '🤖', isPro: true },
    { id: AppView.BOOKS, label: 'Kitaplar', icon: <BookOpen size={20} />, emoji: '📚', isPro: false },
    { id: AppView.MINI_EXAMS, label: 'Mini Denemeler', icon: <FileText size={20} />, emoji: '📝', isPro: true },
    { id: AppView.PRO_BOOKS, label: 'Pro Kitaplar', icon: <GraduationCap size={20} />, emoji: '📕', isPro: true },
    { id: AppView.GRAMMAR, label: 'Gramer', icon: <PenTool size={20} />, emoji: '✍️', isPro: true },
    { id: AppView.FILL_IN, label: 'Boşluk Doldurma', icon: <PenTool size={20} />, emoji: '✒️', isPro: true },
  ];

  if (isAdmin) {
    menuItems.push({ id: AppView.ADMIN, label: 'Admin Paneli', icon: <ShieldCheck size={20} />, emoji: '🛡️', isPro: false });
  }

  return (
    <>
      {/* Mobile Overlay - Click anywhere to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100001] md:hidden backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={toggleSidebar}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Visible close button on the right side */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 active:scale-95 transition-all shadow-lg backdrop-blur-sm"
            style={{
              touchAction: 'manipulation',
              paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'
            }}
          >
            <X size={24} />
          </button>

          {/* Tap to close hint */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white/40 flex flex-col items-center gap-2">
            <div className="w-1 h-16 bg-white/20 rounded-full" />
            <span className="text-xs font-medium writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>Kapatmak için tıkla</span>
            <div className="w-1 h-16 bg-white/20 rounded-full" />
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-background-dark/95 backdrop-blur-xl border-r border-white/10 text-white z-[100002] transform transition-transform duration-300 ease-out md:translate-x-0 md:static flex flex-col shadow-2xl safe-area-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[60px]">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="YDS PRO" className="w-10 h-10 rounded-[22.5%] object-cover shadow-lg shadow-primary/30 border border-white/10" />
            <div>
              <span className="text-xl font-bold text-white tracking-tight block leading-none">YDS PRO</span>
              <span className="text-[10px] font-bold text-primary-dark tracking-widest uppercase">Akademik</span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white/50 hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation active:scale-95"
            aria-label="Menüyü Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {currentUser && (
          <div className="px-6 py-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate text-sm">{currentUser.username.split('@')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {currentUser.role === 'ADMIN' ? (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 rounded font-bold border border-rose-500/20">Yönetici</span>
                  ) : currentUser.isPro ? (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded font-bold border border-amber-500/20 flex items-center gap-1">
                      <Crown size={10} /> Pro Üye
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/10 text-white/60 px-1.5 rounded font-bold border border-white/10">Ücretsiz</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isLocked = item.isPro && !isPro && !isAdmin;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  onChangeView(item.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 group relative btn-press min-h-[56px] touch-manipulation
                    ${isActive
                    ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                    : 'hover:bg-white/5 hover:text-white text-white/60'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium tracking-wide text-base">{item.label}</span>
                </div>
                {/* Locked Pro feature badge */}
                {isLocked && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                    <Lock size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider">PRO</span>
                  </div>
                )}
                {/* Pro user crown */}
                {item.isPro && !isLocked && <Crown size={16} className="text-amber-400 drop-shadow-sm animate-pulse" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
          {/* Subscribe Button (Only for non-Pro users) */}
          {!isPro && !isAdmin && (
            <button
              type="button"
              onClick={() => { playSound('click'); setShowPaymentModal(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition shadow-lg shadow-amber-500/30 btn-press font-bold min-h-[52px] touch-manipulation active:scale-95"
            >
              <Crown size={20} className="animate-pulse" />
              <span>Abone Ol - PRO</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => { playSound('click'); onChangeView(AppView.SETTINGS); if (window.innerWidth < 768) toggleSidebar(); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition text-sm btn-press min-h-[48px] touch-manipulation active:scale-95 ${currentView === AppView.SETTINGS ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings size={18} />
            <span>Ayarlar / Profil</span>
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 transition mt-2 shadow-sm border border-white/5 btn-press min-h-[52px] touch-manipulation active:scale-95"
          >
            <LogOut size={20} className="text-white/40 group-hover:text-rose-400" />
            <span className="font-bold">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && currentUser && (
        <PaymentModal
          user={currentUser}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
};

export default Sidebar;