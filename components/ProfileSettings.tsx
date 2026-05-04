
import React, { useState, useEffect } from 'react';
import { UserProfile, storageService } from '../services/storage';
import { auth } from '../services/firebase';
import { User, Key, Bell, Globe, Shield, Mail, CheckCircle, AlertCircle, Loader2, Save, Smartphone, Camera } from 'lucide-react';
import { playSound } from '../utils/sound';

// Avatar görselleri - 3D ve Emoji tabanlı avatarlar
const AVATAR_OPTIONS = [
    { id: 1, img: 'assets/avatars/male1.png', bg: 'from-indigo-600 to-violet-700' },
    { id: 2, img: 'assets/avatars/female1.png', bg: 'from-rose-600 to-pink-700' },
    { id: 3, img: 'assets/avatars/male2.png', bg: 'from-blue-700 to-indigo-800' },
    { id: 4, img: 'assets/avatars/female2.png', bg: 'from-emerald-600 to-teal-700' },
    { id: 5, emoji: '🦁', bg: 'from-amber-500 to-yellow-600' },
    { id: 6, emoji: '🐯', bg: 'from-orange-600 to-red-600' },
    { id: 7, emoji: '🦄', bg: 'from-purple-500 to-pink-600' },
    { id: 8, emoji: '🐉', bg: 'from-emerald-500 to-teal-600' },
    { id: 9, emoji: '🦅', bg: 'from-sky-500 to-blue-600' },
    { id: 10, emoji: '🐺', bg: 'from-slate-600 to-zinc-700' },
];

interface ProfileSettingsProps {
    user: UserProfile;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'PREFERENCES' | 'LEGAL'>('PROFILE');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Visual Preferences State
    const [pushEnabled, setPushEnabled] = useState(user.notificationsEnabled !== false); // Default true if undefined

    // Username Change State
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);

    // Avatar State
    const [selectedAvatar, setSelectedAvatar] = useState<number>(user.avatarId || 1);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Load avatar on mount
    useEffect(() => {
        const loadAvatar = async () => {
            const progress = await storageService.getUserProgress(user.uid, 'avatarId');
            if (progress) {
                setSelectedAvatar(progress);
            }
        };
        loadAvatar();
    }, [user.uid]);

    const handleAvatarSelect = async (avatarId: number) => {
        setSelectedAvatar(avatarId);
        setShowAvatarPicker(false);
        try {
            // Ana kullanıcı dökümanına kaydet (diğer kullanıcılar görebilsin)
            await storageService.updateUserAvatar(user.uid, avatarId);
            // Progress'e de kaydet (yedek)
            await storageService.saveUserProgress(user.uid, 'avatarId', avatarId);
            setMessage({ type: 'success', text: 'Profil fotoğrafınız güncellendi!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Profil fotoğrafı güncellenemedi.' });
        }
    };

    const currentAvatarData = AVATAR_OPTIONS.find(a => a.id === selectedAvatar) || AVATAR_OPTIONS[0];



    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            return;
        }

        setLoading(true);
        try {
            // 1. Re-authenticate
            await storageService.reauthenticate(currentPassword);

            // 2. Update Password
            await storageService.updateUserPassword(user.uid, newPassword);

            setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setMessage({ type: 'error', text: 'Mevcut şifreniz yanlış.' });
            } else if (err.code === 'auth/too-many-requests') {
                setMessage({ type: 'error', text: 'Çok fazla deneme yapıldı. Lütfen bekleyin.' });
            } else {
                setMessage({ type: 'error', text: 'Şifre güncellenirken bir hata oluştu: ' + err.message });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUsername = async () => {
        if (!newUsername || newUsername.trim().length < 3) {
            setMessage({ type: 'error', text: 'Kullanıcı adı en az 3 karakter olmalıdır.' });
            return;
        }

        setLoading(true);
        try {
            await storageService.updateUsername(user.uid, newUsername.trim());
            setMessage({ type: 'success', text: 'Kullanıcı adınız başarıyla güncellendi. Değişiklikler lider tablosunda görünecektir.' });
            setIsEditingUsername(false);
            // Reload page to reflect changes
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Kullanıcı adı güncellenirken bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        setLoading(true);
        try {
            await storageService.updateNotificationSettings(user.uid, pushEnabled);
            setMessage({ type: 'success', text: 'Tercihleriniz başarıyla kaydedildi.' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Ayarlar kaydedilemedi.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-8 pt-safe">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative group">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentAvatarData.bg} flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 hover:scale-110 hover:-rotate-3 premium-glow overflow-hidden relative`}
                            onClick={() => { playSound('click'); setShowAvatarPicker(true); }}>
                            {currentAvatarData.img ? (
                                <img src={currentAvatarData.img} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl">{currentAvatarData.emoji}</span>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${user.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : user.isPro ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/10 text-white/60 border-white/10'}`}>
                                {user.role === 'ADMIN' ? 'Yönetici' : user.isPro ? 'Pro Üye' : 'Standart Üye'}
                            </span>
                            <span className="text-white/60 flex items-center gap-1">
                                <Mail size={14} /> {user.username}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Avatar Picker Modal */}
            {showAvatarPicker && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarPicker(false)}>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md animate-fadeIn" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Profil Fotoğrafı Seç</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {AVATAR_OPTIONS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => handleAvatarSelect(avatar.id)}
                                    className={`aspect-square rounded-xl bg-gradient-to-br ${avatar.bg} overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg ${selectedAvatar === avatar.id ? 'ring-4 ring-indigo-500 ring-offset-4 ring-offset-slate-900 border-2 border-white' : ''}`}
                                >
                                    {avatar.img ? (
                                        <img src={avatar.img} alt="Option" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">{avatar.emoji}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { playSound('click'); setShowAvatarPicker(false); }}
                            className="w-full mt-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1 space-y-2">
                        <button
                            onClick={() => { playSound('click'); setActiveTab('PROFILE'); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${activeTab === 'PROFILE' ? 'bg-primary/20 text-white shadow-md border border-primary/30' : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'}`}
                        >
                            <User size={18} /> Profil Bilgileri
                        </button>
                        <button
                            onClick={() => { playSound('click'); setActiveTab('SECURITY'); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${activeTab === 'SECURITY' ? 'bg-primary/20 text-white shadow-md border border-primary/30' : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'}`}
                        >
                            <Shield size={18} /> Güvenlik
                        </button>
                        <button
                            onClick={() => { playSound('click'); setActiveTab('PREFERENCES'); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${activeTab === 'PREFERENCES' ? 'bg-primary/20 text-white shadow-md border border-primary/30' : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'}`}
                        >
                            <Globe size={18} /> Tercihler
                        </button>
                        <button
                            onClick={() => { playSound('click'); setActiveTab('LEGAL'); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${activeTab === 'LEGAL' ? 'bg-primary/20 text-white shadow-md border border-primary/30' : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'}`}
                        >
                            <Shield size={18} /> Yasal & Hakkında
                        </button>
                    </div>

                    {/* Main Area */}
                    <div className="lg:col-span-3 space-y-6">

                        {activeTab === 'PROFILE' && (
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 p-6 animate-fadeIn space-y-6">
                                {message && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                        {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                        {message.text}
                                    </div>
                                )}

                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <User size={20} className="text-primary" /> Kişisel Bilgiler
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-white/60 uppercase mb-2">Kullanıcı Adı</label>
                                        {isEditingUsername ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newUsername}
                                                    onChange={(e) => setNewUsername(e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition"
                                                    placeholder="Yeni kullanıcı adı"
                                                />
                                                <button
                                                    onClick={handleUpdateUsername}
                                                    disabled={loading}
                                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center gap-2"
                                                >
                                                    {loading && <Loader2 className="animate-spin" size={18} />}
                                                    Kaydet
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingUsername(false);
                                                        setNewUsername(user.username);
                                                        setMessage(null);
                                                    }}
                                                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition"
                                                >
                                                    İptal
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium">
                                                    {user.username}
                                                </div>
                                                <button
                                                    onClick={() => setIsEditingUsername(true)}
                                                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition shadow-md"
                                                >
                                                    Değiştir
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-xs text-white/40 mt-2">Bu isim lider tablosunda görünecektir.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">E-Posta</label>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white/60 font-medium flex items-center justify-between">
                                                <span>{user.username}</span>
                                                {auth.currentUser?.emailVerified ? (
                                                    <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded">
                                                        <CheckCircle size={12} /> Doğrulanmış
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-400 text-xs flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded">
                                                        <AlertCircle size={12} /> Doğrulanmamış
                                                    </span>
                                                )}
                                            </div>
                                            {!auth.currentUser?.emailVerified && (
                                                <button
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        try {
                                                            await storageService.sendVerificationEmail();
                                                            setMessage({ type: 'success', text: 'Doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.' });
                                                        } catch (e) {
                                                            setMessage({ type: 'error', text: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="px-4 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition text-sm whitespace-nowrap"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Doğrula'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Hesap Türü</label>
                                        <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-white/60 font-medium">
                                            {user.isPro ? 'Premium Hesap' : 'Ücretsiz Hesap'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Kayıt Tarihi</label>
                                        <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-white/60 font-medium">
                                            2025
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'SECURITY' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Key size={20} className="text-indigo-600" /> Şifre Değiştir
                                </h3>

                                {message && (
                                    <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                        {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mevcut Şifre</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Şu anki şifreniz"
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="En az 6 karakter"
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre (Tekrar)</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Yeni şifrenizi tekrar girin"
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center gap-2 w-full justify-center">
                                            {loading && <Loader2 className="animate-spin" size={18} />}
                                            Şifreyi Güncelle
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-8 border-t border-slate-200">
                                    <h3 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
                                        <AlertCircle size={20} /> Tehlikeli Bölge
                                    </h3>
                                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                                        <p className="text-rose-800 font-bold mb-2">Hesabı Sil</p>
                                        <p className="text-rose-600 text-sm mb-4">
                                            Hesabınızı sildiğinizde tüm ilerlemeniz, istatistikleriniz ve verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                                        </p>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
                                                    try {
                                                        setLoading(true);
                                                        await storageService.deleteAccount();
                                                        // Başarılı olursa App.tsx zaten auth state değişimini algılar
                                                    } catch (e: any) {
                                                        console.error(e);
                                                        setLoading(false);

                                                        // Eğer oturum eskiyse, çıkış yaptırıp tekara girmesini isteyelim
                                                        if (e.code === 'auth/requires-recent-login') {
                                                            alert('Güvenlik gereği hesabınızı silmek için oturumunuzu yenilemeniz gerekiyor. Şimdi çıkış yapılıyor. Lütfen tekrar giriş yapıp işlemi tekrarlayın.');
                                                            await storageService.logout();
                                                            window.location.reload();
                                                        } else {
                                                            setMessage({ type: 'error', text: 'Hesap silinirken bir hata oluştu: ' + e.message });
                                                        }
                                                    }
                                                }
                                            }}
                                            className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition shadow-sm"
                                        >
                                            Hesabımı Kalıcı Olarak Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'PREFERENCES' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fadeIn space-y-8">
                                {message && (
                                    <div className={`p-4 mb-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                        {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                        {message.text}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Bell size={20} className="text-indigo-600" /> Bildirim Ayarları
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Smartphone size={18} /></div>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">Uygulama Bildirimleri</p>
                                                    <p className="text-xs text-slate-400">Yeni içerikler ve hatırlatıcılar</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => { playSound('click'); setPushEnabled(!pushEnabled); }}
                                                className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${pushEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 italic px-1">
                                            * Bildirimler açık olduğunda Admin duyuruları mobil cihazınıza Push Bildirimi olarak gönderilir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleSavePreferences}
                                        disabled={loading}
                                        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'LEGAL' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fadeIn space-y-6 max-h-[600px] overflow-y-auto">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 sticky top-0 bg-white pb-2 border-b border-slate-100">
                                    <Shield size={20} className="text-indigo-600" /> Yasal Bilgiler
                                </h3>

                                <div className="prose prose-sm prose-slate max-w-none space-y-6">
                                    {/* Privacy Policy */}
                                    <div className="border-b border-slate-200 pb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">YDS PRO – Gizlilik Politikası</h3>
                                                <p className="text-xs text-slate-500">Son Güncelleme: 28/01/2025</p>
                                            </div>
                                            <a
                                                href="https://sites.google.com/view/ydspro-privacypolicy/home"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
                                            >
                                                <Globe size={14} /> Web'de Görüntüle
                                            </a>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">Bu Gizlilik Politikası, YDS PRO'nun kullanıcı bilgilerini nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklar.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">1. Toplanan Bilgiler</h4>
                                        <p className="text-sm text-slate-600 mb-2"><strong>1.1. Kullanıcı Tarafından Sağlanan Bilgiler:</strong></p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>E-posta adresi (kayıt/iletişim için)</li>
                                            <li>Profil bilgileri (isteğe bağlı)</li>
                                            <li>Ödeme bilgileri (App Store / Google Play tarafından işlenir, YDS PRO ödeme bilgilerine erişmez)</li>
                                        </ul>

                                        <p className="text-sm text-slate-600 mb-2 mt-3"><strong>1.2. Otomatik Toplanan Bilgiler:</strong></p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Cihaz bilgileri (model, işletim sistemi, dil)</li>
                                            <li>Kullanım verileri (çökmeler, performans kayıtları, test ilerlemesi)</li>
                                            <li>IP adresi ve lokasyon (yaklaşık bölge)</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">2. Bilgilerin Kullanım Amaçları</h4>
                                        <p className="text-sm text-slate-600">Toplanan bilgiler:</p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Uygulamanın çalışmasını sağlamak</li>
                                            <li>Kullanıcı deneyimini geliştirmek</li>
                                            <li>Abonelik işlemlerini yönetmek</li>
                                            <li>Hata tespiti ve performans analizi yapmak</li>
                                            <li>Kişiselleştirilmiş öğrenme deneyimi sunmak amacıyla kullanılır</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">3. Üçüncü Taraf Hizmetleri</h4>
                                        <p className="text-sm text-slate-600">Uygulama şu sağlayıcıları kullanabilir:</p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Google Analytics</li>
                                            <li>Firebase</li>
                                            <li>App Store / Google Play ödeme sistemi</li>
                                        </ul>
                                        <p className="text-sm text-slate-600 mt-2">Bu hizmetlerin kendi gizlilik politikaları geçerlidir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">4. Çerezler ve İzleme Teknolojileri</h4>
                                        <p className="text-sm text-slate-600">Uygulama kullanıcı davranışlarını anlamak için analiz çerezleri ve benzeri teknolojiler kullanabilir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">5. Verilerin Saklanması</h4>
                                        <p className="text-sm text-slate-600">Kullanıcı verileri, yasal gereklilikler ve uygulamanın ihtiyaçları doğrultusunda güvenli şekilde saklanır. Veriler kullanıcı hesabı silindiğinde makul süre içinde silinir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">6. Kullanıcı Hakları</h4>
                                        <p className="text-sm text-slate-600">Kullanıcılar:</p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Bilgilerine erişme</li>
                                            <li>Düzenleme talep etme</li>
                                            <li>Hesabını silme</li>
                                            <li>Verilerinin işlenmesini durdurma haklarına sahiptir</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">7. Güvenlik</h4>
                                        <p className="text-sm text-slate-600">Veriler modern güvenlik protokolleriyle korunur. Veri ihlali olursa kullanıcılara bildirilir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">8. Politika Değişiklikleri</h4>
                                        <p className="text-sm text-slate-600">Gizlilik politikası gerektiğinde güncellenebilir. Değişiklikler uygulamada duyurulur.</p>
                                    </div>

                                    {/* User Agreement */}
                                    <div className="border-b border-slate-200 pb-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">YDS PRO – Kullanıcı Sözleşmesi</h3>
                                        <p className="text-sm text-slate-600 mb-4">Bu sözleşme, YDS PRO ile kullanıcı arasında yapılan hukuki anlaşmadır.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">1. Taraflar</h4>
                                        <p className="text-sm text-slate-600"><strong>Hizmet Sağlayıcı:</strong> YDS PRO<br /><strong>Kullanıcı:</strong> Uygulamayı kullanan kişi</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">2. Sözleşmenin Konusu</h4>
                                        <p className="text-sm text-slate-600">Bu sözleşme, uygulamanın kullanımı, içeriklere erişim ve abonelik haklarını kapsar.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">3. Kullanım Şartlarının Kabulü</h4>
                                        <p className="text-sm text-slate-600">Uygulama indirildiğinde veya kullanıldığında sözleşme kabul edilmiş sayılır.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">4. Ücretlendirme</h4>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Kullanıcı, abonelik ücretlerini kabul eder</li>
                                            <li>Abonelik otomatik yenilenir</li>
                                            <li>Ödeme mağaza sağlayıcısı tarafından yapılır</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">5. Fikri Mülkiyet</h4>
                                        <p className="text-sm text-slate-600">Uygulamadaki tüm içerikler YDS PRO'ya aittir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">6. Kullanım Kısıtlamaları</h4>
                                        <p className="text-sm text-slate-600">Kullanıcı içeriği çoğaltamaz, dağıtamaz, satamaz, uygulamayı manipüle edemez.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">7. Sözleşme İhlalleri</h4>
                                        <p className="text-sm text-slate-600">İhlal durumunda hesap kapatılabilir veya erişim sınırlandırılabilir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">8. Uygulanacak Hukuk</h4>
                                        <p className="text-sm text-slate-600">Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir.</p>
                                    </div>

                                    {/* Terms of Service */}
                                    <div className="pb-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">YDS PRO – Hizmet Şartları</h3>
                                        <p className="text-xs text-slate-500 mb-4">Son Güncelleme: 28/01/2025 | Yürürlük Tarihi: 28/01/2025</p>
                                        <p className="text-sm text-slate-600 mb-4">Bu Hizmet Şartları, YDS PRO mobil uygulamasını kullanırken uyacağınız hak ve yükümlülükleri düzenlemektedir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">1. Uygulamanın Tanımı</h4>
                                        <p className="text-sm text-slate-600">YDS PRO, İngilizce gramer, kelime, okuma, dinleme ve sınav pratiği sunan bir eğitim uygulamasıdır.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">2. Uygulamayı Kullanma</h4>
                                        <p className="text-sm text-slate-600">Uygulamayı kullanmak için en az 13 yaşında olmalısınız. 18 yaşın altındaki kullanıcılar ebeveyn veya yasal temsilci onayıyla uygulamayı kullanabilir.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">3. Abonelikler ve Ödemeler</h4>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Uygulama, aylık otomatik yenilenen abonelikler içerir</li>
                                            <li>Abonelikler App Store veya Google Play ödeme sistemleri üzerinden yönetilir</li>
                                            <li>Ücretlendirme ülkeden ülkeye değişebilir</li>
                                            <li>Abonelik, mevcut dönem bitmeden 24 saat önce iptal edilmezse otomatik yenilenir</li>
                                            <li>Ödenen ücretler iade edilemez</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">4. İçerik Kullanımı</h4>
                                        <p className="text-sm text-slate-600">Uygulamadaki tüm içerikler YDS PRO'ya aittir ve telif hakkı ile korunur. Kullanıcılar içerikleri kopyalayamaz, satamaz, dağıtamaz veya ticari amaçla kullanamaz.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">5. Yasaklı Kullanımlar</h4>
                                        <p className="text-sm text-slate-600">Kullanıcı aşağıdakileri yapamaz:</p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 ml-4 space-y-1">
                                            <li>Uygulamayı kötüye kullanmak</li>
                                            <li>Saldırgan, taciz edici, uygunsuz içerik üretmek</li>
                                            <li>Reverse engineering, decompile, hackleme girişimi</li>
                                            <li>Hesap satışı, paylaşımı</li>
                                            <li>Sistemlere zarar verecek davranışlar</li>
                                        </ul>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">6. Hesabın Sonlandırılması</h4>
                                        <p className="text-sm text-slate-600">YDS PRO, Şartlara aykırı davranan kullanıcıların erişimini bildirimli veya bildirimsiz olarak sonlandırma hakkını saklı tutar.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">7. Sorumluluk Reddi</h4>
                                        <p className="text-sm text-slate-600">YDS PRO, kesinti, veri kaybı veya kullanım sırasında oluşabilecek teknik sorunlardan doğrudan veya dolaylı bir sorumluluk kabul etmez.</p>

                                        <h4 className="font-bold text-slate-800 mt-4 mb-2">8. Şartların Güncellenmesi</h4>
                                        <p className="text-sm text-slate-600">YDS PRO bu Şartları güncelleme hakkına sahiptir. Önemli değişiklikler uygulama içinde duyurulur.</p>
                                    </div>

                                    {/* Contact & Support Section */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Mail size={20} className="text-indigo-600" /> İletişim & Destek
                                        </h3>
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                                            <p className="text-sm text-slate-600 mb-4">
                                                Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz:
                                            </p>
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                    <Mail size={20} className="text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-500 font-medium mb-1">Destek E-postası</p>
                                                    <a
                                                        href="mailto:ydspro2025@gmail.com"
                                                        className="text-indigo-600 font-bold hover:text-indigo-700 transition"
                                                    >
                                                        ydspro2025@gmail.com
                                                    </a>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-4 italic">
                                                * Genellikle 24-48 saat içinde yanıt veriyoruz.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                                    YDS PRO v1.0.0 © 2025 Tüm Hakları Saklıdır.
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProfileSettings;
