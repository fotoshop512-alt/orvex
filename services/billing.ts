/**
 * Play Store & App Store Billing Service
 * 
 * Bu servis, Google Play Store ve Apple App Store üzerinden
 * abonelik satın alma işlemlerini yönetir.
 */

import { storageService } from './storage';

// Abonelik ürün ID'leri - Play Console'da oluşturulacak
// Abonelik ürün ID'leri - Play Console'da oluşturulacak "Subscription" (Abonelik)
export const PRODUCTS = {
    PRO_ANNUAL: 'ydspro_yillik',    // Play Console'daki ürün ID'si ile eşleşmeli
};

// Abonelik durumu
export interface SubscriptionStatus {
    isActive: boolean;
    productId: string | null;
    expiryDate: Date | null;
    autoRenewing: boolean;
}

// YDS Billing Plugin interface
interface YDSBillingPlugin {
    initialize(): Promise<{ success: boolean }>;
    getSubscriptions(options: { productIds: string[] }): Promise<{ products: any[] }>;
    purchaseProduct(options: { productId: string; userId: string; type?: 'inapp' | 'subs' }): Promise<{ success: boolean }>;
    getActiveSubscriptions(): Promise<{ subscriptions: any[] }>;
    restorePurchases(): Promise<{ hasActiveSubscription: boolean }>;
}

// Platform tespiti
const isMobile = (): boolean => {
    return (window as any).Capacitor !== undefined;
};

const isAndroid = (): boolean => {
    return isMobile() && (window as any).Capacitor?.getPlatform?.() === 'android';
};

const isIOS = (): boolean => {
    return isMobile() && (window as any).Capacitor?.getPlatform?.() === 'ios';
};

// Try to get native plugin
const getNativePlugin = (): YDSBillingPlugin | null => {
    try {
        // Check if native plugin is registered on window
        if ((window as any).YDSBilling) {
            return (window as any).YDSBilling;
        }

        // Check Capacitor plugins
        const capacitor = (window as any).Capacitor;
        if (capacitor?.Plugins?.YDSBilling) {
            return capacitor.Plugins.YDSBilling;
        }

        return null;
    } catch {
        return null;
    }
};

// Global plugin reference
let billingPlugin: YDSBillingPlugin | null = null;

/**
 * Billing Service - Abonelik yönetimi
 */
export const billingService = {

    /**
     * Billing sistemini başlat
     */
    async initialize(): Promise<boolean> {
        try {
            console.log('[Billing] Initializing...');

            if (!isMobile()) {
                console.log('[Billing] Running on web, billing not available');
                return false;
            }

            // Try to get native plugin
            billingPlugin = getNativePlugin();

            if (isAndroid()) {
                console.log('[Billing] Android platform detected');
                return await this.initializeAndroid();
            }

            if (isIOS()) {
                console.log('[Billing] iOS platform detected');
                return await this.initializeIOS();
            }

            return false;
        } catch (error) {
            console.error('[Billing] Initialization error:', error);
            return false;
        }
    },

    /**
     * Android için başlatma
     */
    async initializeAndroid(): Promise<boolean> {
        try {
            if (billingPlugin) {
                await billingPlugin.initialize();
                console.log('[Billing] Android billing initialized');
                return true;
            }

            // Fallback: Native plugin yok, simülasyon modu
            console.log('[Billing] Android billing plugin not found, using simulation');
            return true;
        } catch (error) {
            console.error('[Billing] Android init error:', error);
            return true; // Simülasyon modunda devam et
        }
    },

    /**
     * iOS için başlatma
     */
    async initializeIOS(): Promise<boolean> {
        try {
            console.log('[Billing] iOS StoreKit initialization');
            return true;
        } catch (error) {
            console.error('[Billing] iOS init error:', error);
            return true;
        }
    },

    /**
     * Ürün bilgilerini getir
     */
    async getProducts(): Promise<any[]> {
        try {
            if (!isMobile()) {
                // Web için demo ürünler
                return [
                    {
                        id: PRODUCTS.PRO_ANNUAL,
                        title: 'YDS Pro Plus',
                        description: 'Ömür boyu sınırsız erişim',
                        price: '₺59.99',
                        priceAmount: 59.99,
                        currency: 'TRY',
                        period: 'lifetime'
                    }
                ];
            }

            if (isAndroid()) {
                return await this.getAndroidProducts();
            }

            if (isIOS()) {
                return await this.getIOSProducts();
            }

            return [];
        } catch (error) {
            console.error('[Billing] Get products error:', error);
            return [];
        }
    },

    async getAndroidProducts(): Promise<any[]> {
        try {
            if (billingPlugin) {
                const result = await billingPlugin.getSubscriptions({
                    productIds: [PRODUCTS.PRO_ANNUAL] // Native plugin may need update to support getProducts vs getSubscriptions
                });
                return result.products || [];
            }

            // Fallback
            return [{
                id: PRODUCTS.PRO_ANNUAL,
                title: 'YDS Pro Plus',
                description: 'Ömür boyu sınırsız erişim',
                price: '₺59.99',
                priceAmount: 59.99,
                currency: 'TRY',
                period: 'lifetime'
            }];
        } catch (error) {
            console.error('[Billing] Android get products error:', error);
            return [];
        }
    },

    async getIOSProducts(): Promise<any[]> {
        // iOS ürünleri - StoreKit ile alınacak
        return [{
            id: PRODUCTS.PRO_ANNUAL,
            title: 'YDS Pro Plus',
            description: 'Ömür boyu sınırsız erişim',
            price: '₺59.99',
            priceAmount: 59.99,
            currency: 'TRY',
            period: 'lifetime'
        }];
    },

    /**
     * Abonelik satın al
     */
    async purchaseProduct(productId: string, userId: string): Promise<boolean> {
        try {
            console.log('[Billing] Purchasing product:', productId);

            if (!isMobile()) {
                console.log('[Billing] Web platform - simulating purchase');
                // Web'de simülasyon
                return await this.simulatePurchase(userId);
            }

            if (isAndroid()) {
                return await this.purchaseAndroid(productId, userId);
            }

            if (isIOS()) {
                return await this.purchaseIOS(productId, userId);
            }

            return false;
        } catch (error) {
            console.error('[Billing] Purchase error:', error);
            return false;
        }
    },

    /**
     * Android'de satın alma
     */
    async purchaseAndroid(productId: string, userId: string): Promise<boolean> {
        try {
            if (billingPlugin) {
                console.log('[Billing] Launching Android purchase flow...');

                const result = await billingPlugin.purchaseProduct({
                    productId: productId,
                    userId: userId,
                    type: 'subs' // Abonelik
                });

                if (result.success) {
                    console.log('[Billing] Purchase successful, updating user...');

                    const expiryDate = new Date();
                    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 yıl ekle

                    await storageService.updateSubscription(userId, {
                        isPro: true,
                        subscriptionId: productId + '_' + Date.now(),
                        subscriptionPlatform: 'google_play',
                        autoRenewing: true,
                        subscriptionExpiryDate: expiryDate.toISOString()
                    });
                    return true;
                }

                return false;
            }

            // Plugin yoksa simülasyon
            console.log('[Billing] No Android plugin, simulating...');
            return await this.simulatePurchase(userId);
        } catch (error) {
            console.error('[Billing] Android purchase error:', error);
            throw error;
        }
    },

    /**
     * iOS'ta satın alma
     */
    async purchaseIOS(productId: string, userId: string): Promise<boolean> {
        try {
            console.log('[Billing] iOS StoreKit purchase...');
            // iOS StoreKit satın alma akışı
            // Şimdilik simülasyon
            return await this.simulatePurchase(userId);
        } catch (error) {
            console.error('[Billing] iOS purchase error:', error);
            throw error;
        }
    },

    /**
     * Satın alma simülasyonu (test için)
     */
    async simulatePurchase(userId: string): Promise<boolean> {
        console.log('[Billing] Simulating purchase for user:', userId);

        // 2 saniye bekle (gerçek ödeme akışını simüle et)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Yıllık erişim
        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        // Firebase'de Pro yap ve abonelik bilgilerini kaydet
        await storageService.updateSubscription(userId, {
            isPro: true,
            subscriptionId: 'sim_annual_' + Date.now(),
            subscriptionPlatform: 'google_play',
            subscriptionStartDate: startDate.toISOString(),
            subscriptionExpiryDate: expiryDate.toISOString(),
            autoRenewing: true, // Yıllık
        });

        return true;
    },

    /**
     * Abonelik durumunu kontrol et
     */
    async checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
        try {
            console.log('[Billing] Checking subscription status...');

            if (!isMobile()) {
                // Web'de firebase'den kontrol et
                return {
                    isActive: false,
                    productId: null,
                    expiryDate: null,
                    autoRenewing: false
                };
            }

            if (isAndroid()) {
                return await this.checkAndroidSubscription(userId);
            }

            if (isIOS()) {
                return await this.checkIOSSubscription(userId);
            }

            return {
                isActive: false,
                productId: null,
                expiryDate: null,
                autoRenewing: false
            };
        } catch (error) {
            console.error('[Billing] Check subscription error:', error);
            return {
                isActive: false,
                productId: null,
                expiryDate: null,
                autoRenewing: false
            };
        }
    },

    async checkAndroidSubscription(userId: string): Promise<SubscriptionStatus> {
        try {
            if (billingPlugin) {
                const result = await billingPlugin.getActiveSubscriptions();

                if (result.subscriptions && result.subscriptions.length > 0) {
                    const sub = result.subscriptions[0];
                    const expiryDate = new Date(sub.expiryTimeMillis);

                    // Aktif abonelik varsa Firebase'i güncelle
                    await storageService.updateSubscription(userId, {
                        isPro: true,
                        subscriptionId: sub.productId,
                        subscriptionPlatform: 'google_play',
                        subscriptionExpiryDate: expiryDate.toISOString(),
                        autoRenewing: sub.autoRenewing
                    });

                    return {
                        isActive: true,
                        productId: sub.productId,
                        expiryDate: expiryDate,
                        autoRenewing: sub.autoRenewing
                    };
                } else {
                    // Aktif abonelik yok - Play Store'dan kontrol edildi
                    // NOT: Kullanıcı ödeme yaptıysa Play Store zaten aktif abonelik döndürür
                    // Bu durumda sadece log yapıyoruz, Pro'yu iptal etmiyoruz
                    // Çünkü kullanıcı daha önce ödeme yapmış olabilir ve Play Store geçici olarak yanıt vermemiş olabilir
                    console.log('[Billing] No active subscription from Play Store query');
                }
            } else {
                // Plugin yoksa Firebase'den kontrol et
                const isStillPro = await storageService.checkAndUpdateSubscriptionStatus(userId);
                return {
                    isActive: isStillPro,
                    productId: null,
                    expiryDate: null,
                    autoRenewing: false
                };
            }

            return {
                isActive: false,
                productId: null,
                expiryDate: null,
                autoRenewing: false
            };
        } catch (error) {
            console.error('[Billing] Android check error:', error);
            return {
                isActive: false,
                productId: null,
                expiryDate: null,
                autoRenewing: false
            };
        }
    },

    async checkIOSSubscription(userId: string): Promise<SubscriptionStatus> {
        // iOS subscription check - placeholder
        console.log('[Billing] Checking iOS subscription for:', userId);
        return {
            isActive: false,
            productId: null,
            expiryDate: null,
            autoRenewing: false
        };
    },

    /**
     * Satın alımları geri yükle (Restore Purchases)
     */
    async restorePurchases(userId: string): Promise<boolean> {
        try {
            console.log('[Billing] Restoring purchases...');

            if (!isMobile()) {
                console.log('[Billing] Web platform - no purchases to restore');
                return false;
            }

            if (isAndroid()) {
                return await this.restoreAndroid(userId);
            }

            if (isIOS()) {
                return await this.restoreIOS(userId);
            }

            return false;
        } catch (error) {
            console.error('[Billing] Restore error:', error);
            return false;
        }
    },

    async restoreAndroid(userId: string): Promise<boolean> {
        try {
            if (billingPlugin) {
                const result = await billingPlugin.restorePurchases();

                if (result.hasActiveSubscription) {
                    await storageService.updateUserRole(userId, true);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error('[Billing] Android restore error:', error);
            return false;
        }
    },

    async restoreIOS(userId: string): Promise<boolean> {
        // iOS restore logic - placeholder
        console.log('[Billing] Restoring iOS purchases for:', userId);
        return false;
    }
};

export default billingService;
