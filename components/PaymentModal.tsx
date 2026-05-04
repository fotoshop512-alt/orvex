
import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Star, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';
import { storageService, UserProfile } from '../services/storage';
import { billingService, PRODUCTS } from '../services/billing';

interface PaymentModalProps {
    onClose: () => void;
    user: UserProfile | null;
    onPurchaseSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, user, onPurchaseSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [productPrice, setProductPrice] = useState<string>("349.99₺");

    useEffect(() => {
        // Platform kontrolü
        const checkPlatform = () => {
            const mobile = (window as any).Capacitor !== undefined;
            setIsMobile(mobile);
        };
        checkPlatform();

        // Billing servisini başlat ve fiyatı çek
        const initBilling = async () => {
            const success = await billingService.initialize();
            console.log('[PaymentModal] Billing initialized:', success);

            if (success) {
                const products = await billingService.getProducts();
                const proProduct = products.find(p => p.id === PRODUCTS.PRO_ANNUAL);
                if (proProduct && proProduct.price) {
                    setProductPrice(proProduct.price);
                }
            }
        };

        initBilling();
    }, []);

    const handlePurchase = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            console.log('[PaymentModal] Starting purchase flow...');

            // Gerçek satın alma işlemi (Yıllık Abonelik)
            const success = await billingService.purchaseProduct(
                PRODUCTS.PRO_ANNUAL,
                user.uid
            );

            if (success) {
                console.log('[PaymentModal] Purchase successful!');

                // Başarı bildirimi
                if (isMobile) {
                    alert("🎉 Tebrikler! YDS Pro Plus üyeliğiniz başarıyla etkinleştirildi.");
                } else {
                    alert("🎉 Tebrikler! Üyeliğiniz başarıyla etkinleştirildi. YDS PRO ayrıcalıklarının keyfini çıkarın.");
                }

                if (onPurchaseSuccess) {
                    onPurchaseSuccess();
                }

                onClose();
            } else {
                setError("Satın alma işlemi tamamlanamadı. (Hata: Google Play servisi yanıt vermedi veya ürün bulunamadı)");
            }
        } catch (err: any) {
            console.error('[PaymentModal] Purchase error:', err);

            // Kullanıcı iptal ettiyse hata gösterme
            if (err?.code === 'USER_CANCELED' || err?.message?.includes('cancel')) {
                console.log('[PaymentModal] User canceled purchase');
            } else {
                setError(err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    const restorePurchase = async () => {
        if (!user) return;

        setRestoring(true);
        setError(null);

        try {
            console.log('[PaymentModal] Restoring purchases...');

            const restored = await billingService.restorePurchases(user.uid);

            if (restored) {
                alert("✅ Aboneliğiniz başarıyla geri yüklendi!");

                if (onPurchaseSuccess) {
                    onPurchaseSuccess();
                }

                onClose();
            } else {
                alert("Aktif abonelik bulunamadı.");
            }
        } catch (err: any) {
            console.error('[PaymentModal] Restore error:', err);
            setError("Geri yükleme sırasında bir hata oluştu.");
        } finally {
            setRestoring(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">

                {/* Header Image Area */}
                <div className="h-40 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-900 relative flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/80 hover:bg-black/40 transition z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center relative z-0">
                        <Crown size={64} className="text-amber-400 mx-auto drop-shadow-lg mb-2" />
                        <h2 className="text-2xl font-black text-white tracking-tight">YDS PRO+</h2>
                        <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold">
                            <Star size={14} fill="currentColor" />
                            <span>PREMIUM</span>
                        </div>
                    </div>

                    {/* Decoration */}
                    <div className="absolute bottom-0 w-full h-12 bg-white rounded-t-3xl"></div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 flex-1 overflow-y-auto">
                    <h3 className="text-center text-xl font-bold text-slate-800 mb-2">Potansiyelini Açığa Çıkar</h3>
                    <p className="text-center text-slate-500 text-sm mb-8">Binlerce kullanıcı YDS PRO ile hedeflerine ulaştı.</p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                                <Check size={20} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Sınırsız Erişim</h4>
                                <p className="text-sm text-slate-500">40+ Premium okuma parçası, kelime testleri ve detaylı analizler.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                                <Check size={20} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Reklamsız Deneyim</h4>
                                <p className="text-sm text-slate-500">Kesintisiz ve odaklanmış öğrenme süreci.</p>
                            </div>
                        </div>
                    </div>
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Mobile indicator */}
                    {isMobile && (
                        <div className="mb-4 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs text-center flex items-center justify-center gap-2">
                            <Smartphone size={14} />
                            <span>Play Store üzerinden güvenli ödeme</span>
                        </div>
                    )}

                    {/* Pricing Card */}
                    <div className="border-2 border-indigo-600 rounded-2xl p-4 flex items-center justify-between bg-indigo-50 mb-4 cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                            EN POPÜLER
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider">Yıllık Abonelik</span>
                            <span className="text-2xl font-black text-slate-900">{productPrice}</span>
                            <span className="text-slate-500 text-sm"> / yıl</span>
                        </div>

                    </div>

                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
                        <div className="text-2xl shrink-0">😉</div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            2 kahve parasından daha az, hem de bütün yıl boyunca!
                        </p>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handlePurchase}
                        disabled={loading || restoring}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-xl flex items-center justify-center gap-2 relative overflow-hidden mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-pulse">İşleniyor...</span>
                        ) : (
                            <>
                                <span>Abone Ol</span>
                                <ArrowIcon />
                            </>
                        )}
                    </button>

                    <button
                        onClick={restorePurchase}
                        disabled={loading || restoring}
                        className="w-full py-2 text-slate-500 text-sm font-medium hover:text-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {restoring ? (
                            <span className="animate-pulse">Kontrol ediliyor...</span>
                        ) : (
                            <>
                                <RefreshCw size={14} /> Satın Alımları Geri Yükle
                            </>
                        )}
                    </button>

                    <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck size={14} />
                        <span>Güvenli Ödeme - {isMobile ? 'Google Play' : 'App Store / Play Store'}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-center text-slate-300 leading-tight">
                        Ödeme, satın alma onayı ile hesabınızdan tahsil edilecektir. Bu işlem tek seferliktir ve abonelik gerektirmez.
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default PaymentModal;
