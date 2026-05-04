
import React, { useState, useEffect } from 'react';
import { UserProfile, storageService } from '../services/storage';
import { Trash2, Shield, ShieldOff, Crown, User as UserIcon, Search, Bell, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Notification State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifBody, setNotifBody] = useState('');
    const [sendingNotif, setSendingNotif] = useState(false);
    const [notifMessage, setNotifMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const list = await storageService.getAllUsers();
            setUsers(list);
        } catch (e) {
            console.error("Failed to load users", e);
        } finally {
            setLoading(false);
        }
    }

    const togglePro = async (uid: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setUsers(users.map(u => u.uid === uid ? { ...u, isPro: !currentStatus } : u));
            await storageService.updateUserRole(uid, !currentStatus);
        } catch (e) {
            console.error("Update failed", e);
            loadUsers(); // Revert on error
        }
    };

    const deleteUser = async (uid: string, username: string) => {
        if (confirm(`${username} kullanıcısını veritabanından silmek istediğinize emin misiniz? (Kullanıcı Auth kaydı silinmez, sadece veritabanı)`)) {
            try {
                setUsers(users.filter(u => u.uid !== uid));
                await storageService.deleteUser(uid);
            } catch (e) {
                console.error(e);
                loadUsers();
            }
        }
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifTitle.trim() || !notifBody.trim()) return;

        setSendingNotif(true);
        setNotifMessage(null);

        try {
            await storageService.sendSystemNotification(notifTitle, notifBody, "ADMIN");
            setNotifMessage({ type: 'success', text: 'Bildirim başarıyla gönderildi. Mobil uygulamayı kullanan ve bildirimleri açık olan kullanıcılara iletilecektir.' });
            setNotifTitle('');
            setNotifBody('');
        } catch (error: any) {
            console.error("Notification Error:", error);
            let errorMsg = 'Bildirim gönderilirken bir hata oluştu.';

            if (error.code === 'permission-denied') {
                errorMsg = 'YETKİ HATASI: Firebase Konsolunda "system_notifications" koleksiyonuna yazma izni (Rules) verilmemiş.';
            } else if (error.message) {
                errorMsg = `Hata: ${error.message}`;
            }

            setNotifMessage({ type: 'error', text: errorMsg });
        } finally {
            setSendingNotif(false);
        }
    };

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto h-full overflow-y-auto pb-32 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Yönetici Paneli</h2>
                    <p className="text-sm md:text-base text-slate-300">Kullanıcıları yönetin ve duyuru gönderin.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 bg-white text-slate-900 placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* USER MANAGEMENT TABLE */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                        <span>Kullanıcı Listesi ({filteredUsers.length})</span>
                    </div>

                    <div className="w-full block overflow-x-auto scrolling-touch flex-1">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Kullanıcı</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Rol</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Durum</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin" size={20} /> Yükleniyor...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">Kullanıcı bulunamadı.</td>
                                    </tr>
                                ) : filteredUsers.map(user => (
                                    <tr key={user.uid} className="hover:bg-slate-50 transition">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-xs">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800 text-sm">{user.username.split('@')[0]}</div>
                                                <div className="text-[10px] text-slate-400">{user.username}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-white text-[10px] font-bold">
                                                    <Shield size={10} /> ADMIN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                    <UserIcon size={10} /> USER
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.isPro ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
                                                    <Crown size={10} /> PRO
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                    FREE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => togglePro(user.uid, user.isPro)}
                                                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition font-medium text-[10px] ${user.isPro ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'}`}
                                                    title={user.isPro ? "Pro'yu Kaldır" : "Pro Yap"}
                                                >
                                                    {user.isPro ? (
                                                        <>
                                                            <ShieldOff size={12} /> Kaldır
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Crown size={12} /> PRO
                                                        </>
                                                    )}
                                                </button>

                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => deleteUser(user.uid, user.username)}
                                                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition font-medium text-[10px]"
                                                        title="Kullanıcıyı Sil"
                                                    >
                                                        <Trash2 size={12} /> Sil
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NOTIFICATION PANEL */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell size={20} className="text-indigo-600" />
                            Mobil Bildirim Gönder
                        </h3>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm mb-1">Firebase Console Kullanın</h4>
                                    <p className="text-xs text-indigo-700 leading-relaxed">
                                        Bildirim göndermek için Firebase Console'u kullanmanız gerekmektedir. Bu daha güvenli ve ücretsiz bir yöntemdir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">
                                Tüm kullanıcılara anlık bildirim göndermek için aşağıdaki butona tıklayarak Firebase Cloud Messaging paneline gidin.
                            </p>

                            <a
                                href="https://console.firebase.google.com/project/yds-master/notification/compose"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                Firebase Console'a Git
                            </a>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-700 mb-2">Nasıl Yapılır?</h4>
                                <ol className="text-xs text-slate-500 space-y-2 list-decimal pl-4">
                                    <li>"Firebase Console'a Git" butonuna tıklayın.</li>
                                    <li>"New campaign" -&gt; "Notifications" seçin.</li>
                                    <li>Başlık ve metni girin.</li>
                                    <li>Hedef olarak Android uygulamanızı seçin.</li>
                                    <li>"Review" ve "Publish" diyerek gönderin.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
