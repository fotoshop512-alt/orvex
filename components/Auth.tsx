
import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { Lock, User as UserIcon, Loader2, X, AlertCircle, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
    const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        securityQuestion: '',
        securityAnswer: '',
        confirmPassword: ''
    });
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState<'TERMS' | 'PRIVACY' | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            setError('Lütfen kullanıcı sözleşmesini ve gizlilik politikasını kabul ediniz.');
            return;
        }

        const cleanEmail = formData.username.trim();
        const cleanPassword = formData.password.trim();
        const cleanConfirm = formData.confirmPassword.trim();

        if (cleanPassword.length < 6) {
            setError('Şifre en az 6 karakterden oluşmalıdır.');
            return;
        }

        if (cleanPassword !== cleanConfirm) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        if (!formData.securityQuestion || !formData.securityAnswer.trim()) {
            setError('Lütfen güvenlik sorusu ve cevabını giriniz.');
            return;
        }

        setLoading(true);
        try {
            const newUser = await storageService.register({
                email: cleanEmail,
                password: cleanPassword,
                securityQuestion: formData.securityQuestion,
                securityAnswer: formData.securityAnswer
            });
            // Don't mark onboarding as complete - it will show automatically
            // because hasCompletedOnboarding will return false for new users
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Bu e-posta adresi zaten kullanımda. Lütfen giriş yapın.");
                // Optional: Auto switch to login view could happen here
            } else if (err.code === 'auth/weak-password') {
                setError("Şifre en az 6 karakterden oluşmalıdır.");
            } else {
                setError("Kayıt hatası: " + (err.message || "Bilinmeyen hata"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanEmail = formData.username.trim();
        const cleanPassword = formData.password.trim();

        try {
            await storageService.login(cleanEmail, cleanPassword);
        } catch (err: any) {
            console.error("Login Error:", err);
            const code = err.code;
            if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-email') {
                setError("Kullanıcı adı veya şifre hatalı.");
            } else if (code === 'auth/too-many-requests') {
                setError("Çok fazla hatalı deneme yapıldı. Lütfen bir süre bekleyin.");
            } else {
                setError("Giriş hatası. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('[Auth] Starting Google login...');
            const userProfile = await storageService.loginWithGoogle();
            console.log('[Auth] Google login successful!', userProfile);
            // Auth state will be updated automatically, App.tsx will handle navigation
        } catch (err: any) {
            console.error("[Auth] Google Login Error:", err);
            setError("Google ile giriş yapılamadı: " + (err.message || "Bilinmeyen hata"));
        } finally {
            setLoading(false);
        }
    };


    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanEmail = formData.username.trim();
        if (!cleanEmail) {
            setError('Lütfen e-posta adresinizi giriniz.');
            setLoading(false);
            return;
        }

        try {
            await storageService.sendPasswordResetEmail(cleanEmail);
            setError('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. (Spam kutunuzu kontrol edin)');
        } catch (err: any) {
            console.error("Forgot Password Error:", err);
            if (err.code === 'auth/user-not-found') {
                setError("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.");
            } else {
                setError("Hata: " + (err.message || "Bilinmeyen hata"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark bg-gradient-radial-dark flex items-center justify-center p-4 relative font-display overflow-y-auto">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Legal Modals */}
            {showTerms && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-900/90 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                            <h3 className="text-xl font-bold text-white">
                                {showTerms === 'TERMS' ? 'Kullanıcı Sözleşmesi ve Hizmet Şartları' : 'Gizlilik Politikası'}
                            </h3>
                            <button onClick={() => setShowTerms(null)} className="p-2 hover:bg-white/10 rounded-full transition text-white/70 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto text-sm text-slate-300 leading-relaxed space-y-4 custom-scrollbar">
                            {showTerms === 'TERMS' ? (
                                <>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-white text-base">YDS PRO – Kullanıcı Sözleşmesi</h4>
                                        <p><strong className="text-indigo-400">1. Taraflar:</strong> Hizmet Sağlayıcı: YDS PRO | Kullanıcı: Uygulamayı kullanan kişi</p>
                                        <p><strong className="text-indigo-400">2. Sözleşmenin Konusu:</strong> Bu sözleşme, uygulamanın kullanımı, içeriklere erişim ve abonelik haklarını kapsar.</p>
                                        <p><strong className="text-indigo-400">3. Kullanım Şartlarının Kabulü:</strong> Uygulama indirildiğinde veya kullanıldığında sözleşme kabul edilmiş sayılır.</p>
                                        <p><strong className="text-indigo-400">4. Ücretlendirme:</strong> Kullanıcı, abonelik ücretlerini kabul eder. Abonelik otomatik yenilenir. Ödeme mağaza sağlayıcısı tarafından yapılır.</p>
                                        <p><strong className="text-indigo-400">5. Fikri Mülkiyet:</strong> Uygulamadaki tüm içerikler YDS PRO'ya aittir.</p>
                                        <p><strong className="text-indigo-400">6. Kullanım Kısıtlamaları:</strong> Kullanıcı içeriği çoğaltamaz, dağıtamaz, satamaz, uygulamayı manipüle edemez.</p>
                                        <p><strong className="text-indigo-400">7. Sözleşme İhlalleri:</strong> İhlal durumunda hesap kapatılabilir veya erişim sınırlandırılabilir.</p>
                                        <p><strong className="text-indigo-400">8. Uygulanacak Hukuk:</strong> Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir.</p>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mt-6 space-y-4">
                                        <h4 className="font-bold text-white text-base">YDS PRO – Hizmet Şartları</h4>
                                        <p className="text-xs text-slate-500">Son Güncelleme: 28/01/2025</p>
                                        <p><strong className="text-indigo-400">1. Uygulamanın Tanımı:</strong> YDS PRO, İngilizce gramer, kelime, okuma, dinleme ve sınav pratiği sunan bir eğitim uygulamasıdır.</p>
                                        <p><strong className="text-indigo-400">2. Uygulamayı Kullanma:</strong> Uygulamayı kullanmak için en az 13 yaşında olmalısınız. 18 yaşın altındaki kullanıcılar ebeveyn veya yasal temsilci onayıyla uygulamayı kullanabilir.</p>
                                        <p><strong className="text-indigo-400">3. Abonelikler ve Ödemeler:</strong> Uygulama, aylık otomatik yenilenen abonelikler içerir. Abonelikler App Store veya Google Play ödeme sistemleri üzerinden yönetilir. Abonelik, mevcut dönem bitmeden 24 saat önce iptal edilmezse otomatik yenilenir. Ödenen ücretler iade edilemez.</p>
                                        <p><strong className="text-indigo-400">4. İçerik Kullanımı:</strong> Uygulamadaki tüm içerikler YDS PRO'ya aittir ve telif hakkı ile korunur. Kullanıcılar içerikleri kopyalayamaz, satamaz, dağıtamaz veya ticari amaçla kullanamaz.</p>
                                        <p><strong className="text-indigo-400">5. Yasaklı Kullanımlar:</strong> Uygulamayı kötüye kullanmak, saldırgan/taciz edici içerik üretmek, reverse engineering, hesap satışı/paylaşımı yasaktır.</p>
                                        <p><strong className="text-indigo-400">6. Hesabın Sonlandırılması:</strong> YDS PRO, Şartlara aykırı davranan kullanıcıların erişimini bildirimli veya bildirimsiz olarak sonlandırma hakkını saklı tutar.</p>
                                        <p><strong className="text-indigo-400">7. Sorumluluk Reddi:</strong> YDS PRO, kesinti, veri kaybı veya kullanım sırasında oluşabilecek teknik sorunlardan doğrudan veya dolaylı bir sorumluluk kabul etmez. Eğitim içeriği öneri niteliğindedir; sınav başarısı garanti edilmez.</p>
                                        <p><strong className="text-indigo-400">8. Şartların Güncellenmesi:</strong> YDS PRO bu Şartları güncelleme hakkına sahiptir. Önemli değişiklikler uygulama içinde duyurulur.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white text-base">YDS PRO – Gizlilik Politikası</h4>
                                            <p className="text-xs text-slate-500">Son Güncelleme: 28/01/2025</p>
                                        </div>
                                        <a
                                            href="https://sites.google.com/view/ydspro-privacypolicy/home"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                                        >
                                            Web'de Görüntüle
                                        </a>
                                    </div>
                                    <p>Bu Gizlilik Politikası, YDS PRO'nun kullanıcı bilgilerini nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklar.</p>

                                    <p><strong className="text-indigo-400">1. Toplanan Bilgiler:</strong></p>
                                    <p className="ml-4"><strong className="text-white">1.1. Kullanıcı Tarafından Sağlanan:</strong> E-posta adresi, profil bilgileri, ödeme bilgileri (App Store/Google Play tarafından işlenir)</p>
                                    <p className="ml-4"><strong className="text-white">1.2. Otomatik Toplanan:</strong> Cihaz bilgileri, kullanım verileri, IP adresi ve lokasyon (yaklaşık)</p>

                                    <p><strong className="text-indigo-400">2. Bilgilerin Kullanım Amaçları:</strong> Uygulamanın çalışması, kullanıcı deneyimini geliştirme, abonelik yönetimi, hata tespiti, kişiselleştirilmiş öğrenme deneyimi.</p>

                                    <p><strong className="text-indigo-400">3. Üçüncü Taraf Hizmetleri:</strong> Google Analytics, Firebase, App Store/Google Play ödeme sistemi. Bu hizmetlerin kendi gizlilik politikaları geçerlidir.</p>

                                    <p><strong className="text-indigo-400">4. Çerezler ve İzleme:</strong> Uygulama kullanıcı davranışlarını anlamak için analiz çerezleri kullanabilir.</p>

                                    <p><strong className="text-indigo-400">5. Verilerin Saklanması:</strong> Kullanıcı verileri güvenli şekilde saklanır. Hesap silindiğinde veriler makul süre içinde silinir.</p>

                                    <p><strong className="text-indigo-400">6. Kullanıcı Hakları:</strong> Bilgilerine erişme, düzenleme talep etme, hesabını silme, verilerinin işlenmesini durdurma hakları vardır.</p>

                                    <p><strong className="text-indigo-400">7. Güvenlik:</strong> Veriler modern güvenlik protokolleriyle korunur. Veri ihlali olursa kullanıcılara bildirilir.</p>

                                    <p><strong className="text-indigo-400">8. Politika Değişiklikleri:</strong> Gizlilik politikası gerektiğinde güncellenebilir. Değişiklikler uygulamada duyurulur.</p>
                                </>
                            )}
                        </div>
                        <div className="p-4 border-t border-white/10 bg-slate-900/50 rounded-b-2xl text-right">
                            <button onClick={() => setShowTerms(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Anladım</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col relative z-10 max-h-[92vh] overflow-hidden animate-spring-up">
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 text-center relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 flex items-center justify-center mb-6 group transition-transform duration-500 hover:scale-110 overflow-hidden rounded-[22%] shadow-2xl border border-white/10">
                            <img src="/icon.png" alt="YDS PRO Logo" className="w-full h-full object-cover rounded-[22%]" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-2">YDS PRO</h1>
                        <div className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 inline-block">
                            <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-[0.2em]">Akademik İngilizce Platformu</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {view === 'LOGIN' && (
                        <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-black text-white">Hoş Geldiniz</h2>
                                <p className="text-slate-400 text-sm">Hedeflerine ulaşmak için giriş yap</p>
                            </div>

                            {error && (
                                <div className="bg-rose-500/10 text-rose-200 p-4 rounded-2xl text-sm font-medium flex flex-col gap-2 border border-rose-500/20 animate-fadeIn">
                                    <div className="flex items-center gap-2 text-rose-400">
                                        <AlertCircle className="shrink-0" size={18} />
                                        <span className="font-bold">Erişim Hatası</span>
                                    </div>
                                    <p className="text-xs ml-6 opacity-90">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-Posta</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="username"
                                            placeholder="ornek@mail.com"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Şifre</label>
                                        <button
                                            type="button"
                                            onClick={() => { setError(''); setView('FORGOT_PASSWORD'); }}
                                            className="text-[10px] text-indigo-400 hover:text-white transition font-bold uppercase tracking-wider"
                                        >
                                            Şifremi Unuttum
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                            required
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.5)] transition-all flex justify-center items-center gap-2 transform active:scale-[0.97] border border-white/10 btn-press">
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {loading ? 'Bağlanılıyor...' : 'Giriş Yap'}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px]">
                                    <span className="px-4 bg-[#1a1b2e] text-slate-500 font-black uppercase tracking-widest">Global Erişim</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-slate-900 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition shadow-md flex justify-center items-center gap-2 transform active:scale-[0.97] btn-press">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                    Google ile Devam Et
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <button type="button" onClick={() => { setError(''); setView('REGISTER'); }} className="text-sm text-slate-400 font-medium hover:text-white transition group flex items-center justify-center gap-2 mx-auto">
                                    Henüz üye değil misin? <span className="text-indigo-400 font-bold group-hover:underline">Kaydol</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {view === 'REGISTER' && (
                        <form onSubmit={handleRegister} className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-black text-white">Hesap Oluştur</h2>
                                <p className="text-slate-400 text-sm">Hayalindeki başarıya bir adım kaldı</p>
                            </div>

                            {error && (
                                <div className="bg-rose-500/10 text-rose-200 p-4 rounded-2xl text-sm font-medium flex gap-2 border border-rose-500/20">
                                    <AlertCircle className="shrink-0" size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-Posta</label>
                                    <input
                                        type="email"
                                        name="username"
                                        placeholder="E-Posta Adresi"
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Şifre</label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Min 6"
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Onay</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Tekrar"
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 mb-1.5 block">Güvenlik Sorusu</label>
                                    <select
                                        name="securityQuestion"
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 mb-3 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none text-slate-300 text-sm font-medium"
                                        required
                                    >
                                        <option value="">Bir soru seçin...</option>
                                        <option value="first_pet">İlk evcil hayvanının adı nedir?</option>
                                        <option value="birth_city">Hangi şehirde doğdun?</option>
                                        <option value="mother_maiden">Annenizin kızlık soyadı nedir?</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="securityAnswer"
                                        placeholder="Cevabınız"
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                        required
                                    />
                                </div>

                                <div className="flex items-start gap-3 mt-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="agreements"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-indigo-500 rounded-lg border-white/10 focus:ring-indigo-500 bg-slate-900 appearance-none border checked:bg-indigo-600 checked:border-transparent transition-all cursor-pointer relative after:content-['✓'] after:absolute after:hidden checked:after:block after:text-white after:text-[10px] after:left-1.5 after:top-0"
                                    />
                                    <label htmlFor="agreements" className="text-[10px] text-slate-400 leading-relaxed select-none cursor-pointer font-medium">
                                        <button type="button" onClick={() => setShowTerms('TERMS')} className="text-indigo-400 hover:text-white font-bold transition-colors">Kullanıcı Sözleşmesi</button>'ni ve <button type="button" onClick={() => setShowTerms('PRIVACY')} className="text-indigo-400 hover:text-white font-bold transition-colors">Gizlilik Politikası</button>'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg flex justify-center items-center gap-2 transform active:scale-[0.97] btn-press">
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {loading ? 'Oluşturuluyor...' : 'Hesabı Başlat'}
                            </button>

                            <button type="button" onClick={() => { setError(''); setView('LOGIN'); }} className="w-full text-slate-500 text-xs font-bold py-2 hover:text-white transition uppercase tracking-widest">
                                Giriş Yap
                            </button>
                        </form>
                    )}

                    {view === 'FORGOT_PASSWORD' && (
                        <form onSubmit={handleForgotPassword} className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-black text-white">Şifre Kurtarma</h2>
                                <p className="text-slate-400 text-sm">Sana bir erişim bağlantısı göndereceğiz</p>
                            </div>

                            {error && (
                                <div className={`p-4 rounded-2xl text-sm font-medium flex flex-col gap-2 border ${error.includes('gönderildi') ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' : 'bg-rose-500/10 text-rose-200 border-rose-500/20'}`}>
                                    <div className={`flex items-center gap-2 ${error.includes('gönderildi') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        <AlertCircle className="shrink-0" size={18} />
                                        <span className="font-bold">{error.includes('gönderildi') ? 'Sistem Bildirimi' : 'Hata'}</span>
                                    </div>
                                    <p className="text-xs ml-6 opacity-90">{error}</p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">E-Posta</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        name="username"
                                        placeholder="Kayıtlı e-posta adresin"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all text-white placeholder-slate-600 font-medium"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition flex justify-center items-center gap-2 transform active:scale-[0.97] btn-press border border-white/10">
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {loading ? 'İşleniyor...' : 'Sıfırlama Bağlantısı Gönder'}
                            </button>

                            <button type="button" onClick={() => { setError(''); setView('LOGIN'); }} className="w-full text-slate-500 text-xs font-bold py-2 hover:text-white transition uppercase tracking-widest">
                                Vazgeç ve Geri Dön
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
