
import React, { useState, useEffect } from 'react';
import BottomMenu from './components/BottomMenu';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard'; // Imported Leaderboard
import WordHub from './components/WordHub';
import GrammarHub from './components/GrammarHub';
import BooksZone from './components/BooksZone';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import ProfileSettings from './components/ProfileSettings';
import PaymentModal from './components/PaymentModal';
import Onboarding from './components/Onboarding';
import MiniExams from './components/MiniExams';
import ProBooks from './components/ProBooks';
import SentenceExamples from './components/SentenceExamples';
import FillInHub from './components/FillInHub';
import PodcastZone from './components/PodcastZone';
import { AppView, ExamResult } from './types';
import { Loader2 } from 'lucide-react';
import { storageService, UserProfile } from './services/storage';
import { fcmService } from './services/fcm';
import { billingService } from './services/billing';


// Data Imports
import { STATIC_VOCAB_LIST } from './data/vocabData';
import { VOCAB_TESTS } from './data/vocabQuizData';
import { STATIC_NOUNS_LIST } from './data/nounsData';
import { NOUNS_TESTS } from './data/nounsQuizData';
import { STATIC_ADJECTIVES_LIST } from './data/adjectivesData';
import { ADJECTIVES_TESTS } from './data/adjectivesQuizData';

import { SplashScreen } from '@capacitor/splash-screen';
import { cleanupAudio } from './utils/sound';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LEADERBOARD); // Default to Leaderboard
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Hide splash screen immediately
  useEffect(() => {
    // Show the splash for a bit, then hide
    const timeout = setTimeout(() => {
      SplashScreen.hide().catch(() => { });
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // Separate effect for auth subscription
  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => { };

    try {
      unsubscribe = storageService.subscribeToAuth(async (user) => {
        if (!isMounted) return;

        setCurrentUser(user);

        if (user) {
          // Abonelik durumunu kontrol et (sadece bilgi amaçlı)
          // NOT: Ödeme yapıldıysa Play Store aktif abonelik döndürür
          // Pro üyeliği otomatik iptal edilmez - Play Store yönetir
          try {
            await billingService.initialize();
            const subscriptionStatus = await billingService.checkSubscriptionStatus(user.uid);
            console.log('[App] Subscription status:', subscriptionStatus);

            // Play Store'dan aktif abonelik varsa Pro'yu güncelle
            if (subscriptionStatus.isActive && !user.isPro) {
              console.log('[App] Active subscription found, updating Pro status...');
              setCurrentUser({ ...user, isPro: true });
            }
          } catch (error) {
            console.error('[App] Subscription check error:', error);
          }

          // Initialize FCM with delay
          setTimeout(() => {
            fcmService.initialize(user.uid).catch(console.error);
          }, 2000);

          // Check onboarding
          storageService.hasCompletedOnboarding(user.uid).then((hasCompleted) => {
            if (isMounted && !hasCompleted) {
              setShowOnboarding(true);
            }
          }).catch(console.error);
        }
      });
    } catch (error) {
      console.error('Auth subscription failed:', error);
      setInitError('Firebase bağlantı hatası');
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);



  const handleOnboardingComplete = async () => {
    if (currentUser) {
      await storageService.markOnboardingComplete(currentUser.uid);
      setShowOnboarding(false);
      setCurrentView(AppView.LEADERBOARD); // Ensure we go to Leaderboard
    }
  };

  const handleLogout = async () => {
    // Cleanup FCM listeners before logout
    await fcmService.cleanup();
    await storageService.logout();
    setCurrentView(AppView.LEADERBOARD);
  };

  const handleViewChange = (view: AppView) => {
    // Pro Feature Lock Logic - İlk içerik ücretsiz, kilitlenmesi component içinde yapılıyor
    // Sadece SENTENCE_EXAMPLES view seviyesinde kilitli (1 ücretsiz kullanım hakkı component içinde)
    // PRO_BOOKS, GRAMMAR, MINI_EXAMS artık component içinde ilk öğe ücretsiz
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.LEADERBOARD:
        return <Leaderboard currentUser={currentUser} />;
      case AppView.DASHBOARD:
        // Fallback if needed, but main entry is now Leaderboard
        return <Leaderboard currentUser={currentUser} />;
      case AppView.VERBS:
        return (
          <WordHub
            key="verbs"
            currentUser={currentUser}
            title="Fiiller"
            wordList={STATIC_VOCAB_LIST}
            testList={VOCAB_TESTS}
            storagePrefix="vocab"
            colorTheme="indigo"
          />
        );
      case AppView.NOUNS:
        return (
          <WordHub
            key="nouns"
            currentUser={currentUser}
            title="İsimler"
            wordList={STATIC_NOUNS_LIST}
            testList={NOUNS_TESTS}
            storagePrefix="noun"
            colorTheme="blue"
          />
        );
      case AppView.ADJECTIVES:
        return (
          <WordHub
            key="adjectives"
            currentUser={currentUser}
            title="Sıfatlar"
            wordList={STATIC_ADJECTIVES_LIST}
            testList={ADJECTIVES_TESTS}
            storagePrefix="adjective"
            colorTheme="purple"
          />
        );
      case AppView.BOOKS:
        return <BooksZone currentUser={currentUser} onFullscreenChange={setIsFullscreen} />;
      case AppView.MINI_EXAMS:
        return <MiniExams currentUser={currentUser} onFullscreenChange={setIsFullscreen} />;
      case AppView.SENTENCE_EXAMPLES:
        return <SentenceExamples currentUser={currentUser} />;
      case AppView.PRO_BOOKS:
        return <ProBooks currentUser={currentUser} onFullscreenChange={setIsFullscreen} />;
      case AppView.GRAMMAR:
        return <GrammarHub currentUser={currentUser} />;
      case AppView.FILL_IN:
        return <FillInHub currentUser={currentUser} />;
      case AppView.PODCAST:
        return <PodcastZone currentUser={currentUser} onFullscreenChange={setIsFullscreen} />;
      case AppView.ADMIN:
        return currentUser?.role === 'ADMIN' ? <AdminPanel /> : <Leaderboard currentUser={currentUser} />;
      case AppView.SETTINGS:
        return currentUser ? <ProfileSettings user={currentUser} /> : null;
      default:
        return <Leaderboard currentUser={currentUser} />;
    }
  };



  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0d1e] overflow-hidden relative">
        {/* Placeholder Image (Phoenix) */}
        <div className="flex items-center justify-center z-20">
          <img
            src="/icon.png"
            alt="YDS PRO Loading"
            className="w-48 h-48 object-cover rounded-[22%] border border-white/10 animate-pulse"
          />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Auth />;
  }

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-background-dark font-display text-white bg-gradient-radial-dark relative overflow-hidden">

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header - Hidden in Fullscreen */}
        {!isFullscreen && (
          <header
            className="bg-gradient-to-b from-background-dark/95 to-background-dark/80 backdrop-blur-xl border-b border-white/10 sticky top-0 pt-safe"
            style={{
              zIndex: 99999,
            }}
          >
            <div className="px-4 py-1 flex items-center justify-between min-h-[50px]">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="YDS PRO" className="w-8 h-8 rounded-[22%] object-cover shadow-lg shadow-indigo-900/20 border border-white/10" />
                <div>
                  <span className="font-bold text-white tracking-tight text-base block leading-none">YDS PRO</span>
                  <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Akademik</span>
                </div>
              </div>

              {/* Optional: Add profile/settings hint or just leave empty balancing the layout */}
              <div className="w-[32px]"></div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative w-full">
          {renderContent()}
        </main>
      </div>

      {showPaymentModal && (
        <PaymentModal
          user={currentUser}
          onClose={() => setShowPaymentModal(false)}
          onPurchaseSuccess={() => {
            // Re-fetch user profile to update UI immediately
            if (currentUser) {
              storageService.login(currentUser.username, "internal_refresh").then(updatedUser => {
                setCurrentUser(updatedUser);
              }).catch(() => {
                // Fallback: manually update isPro
                setCurrentUser({ ...currentUser, isPro: true });
              });
            }
          }}
        />
      )}

      <BottomMenu
        currentUser={currentUser}
        currentView={currentView}
        onChangeView={handleViewChange}
        onLogout={handleLogout}
        visible={!isFullscreen}
      />
    </div>
  );
};

export default App;