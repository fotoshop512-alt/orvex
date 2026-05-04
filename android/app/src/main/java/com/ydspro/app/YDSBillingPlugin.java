package com.ydspro.app;

import android.util.Log;
import androidx.annotation.NonNull;
import com.android.billingclient.api.*;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

/**
 * YDS Billing Plugin
 * 
 * Google Play Billing Library v7 entegrasyonu.
 * Abonelik satın alma, kontrol ve geri yükleme işlemleri.
 */
@CapacitorPlugin(name = "YDSBilling")
public class YDSBillingPlugin extends Plugin implements PurchasesUpdatedListener, BillingClientStateListener {
    
    private static final String TAG = "YDSBilling";
    private static final String DEFAULT_PRODUCT_ID = "yds_pro_lifetime";
    
    private BillingClient billingClient;
    private boolean isClientReady = false;
    private PluginCall pendingPurchaseCall;
    
    @Override
    public void load() {
        super.load();
        Log.d(TAG, "YDSBillingPlugin loaded");
        
        // Initialize Billing Client
        billingClient = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases()
            .build();
    }
    
    /**
     * Billing client'ı başlat
     */
    @PluginMethod
    public void initialize(PluginCall call) {
        Log.d(TAG, "Initializing billing client...");
        
        if (billingClient.isReady()) {
            isClientReady = true;
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
            return;
        }
        
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isClientReady = true;
                    Log.d(TAG, "Billing client connected successfully");
                    JSObject result = new JSObject();
                    result.put("success", true);
                    call.resolve(result);
                } else {
                    Log.e(TAG, "Billing setup failed: " + billingResult.getDebugMessage());
                    JSObject result = new JSObject();
                    result.put("success", false);
                    result.put("error", billingResult.getDebugMessage());
                    call.resolve(result);
                }
            }
            
            @Override
            public void onBillingServiceDisconnected() {
                Log.w(TAG, "Billing service disconnected");
                isClientReady = false;
            }
        });
    }
    
    /**
     * Ürünleri getir (Eski adıyla getSubscriptions, şimdi genel)
     */
    @PluginMethod
    public void getSubscriptions(PluginCall call) { // İsim uyumluluğu için getSubscriptions bıraktık ama INAPP de destekler
        getProducts(call);
    }

    @PluginMethod
    public void getProducts(PluginCall call) {
        if (!isClientReady) {
            call.reject("Billing client not ready");
            return;
        }

        JSArray productIds = call.getArray("productIds");
        String type = call.getString("type", "inapp"); // default inapp
        String productType = type.equals("subs") ? BillingClient.ProductType.SUBS : BillingClient.ProductType.INAPP;
        
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();

        if (productIds != null) {
            try {
                for (int i = 0; i < productIds.length(); i++) {
                    productList.add(
                        QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(productIds.getString(i))
                            .setProductType(productType)
                            .build()
                    );
                }
            } catch (Exception e) {
                call.reject("Invalid product IDs");
                return;
            }
        } else {
             // Fallback default
             productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(DEFAULT_PRODUCT_ID)
                    .setProductType(productType)
                    .build()
            );
        }
        
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();
        
        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                try {
                    JSONArray products = new JSONArray();
                    for (ProductDetails product : productDetailsList) {
                        JSONObject productJson = new JSONObject();
                        productJson.put("id", product.getProductId());
                        productJson.put("title", product.getTitle());
                        productJson.put("description", product.getDescription());
                        
                        // Fiyat detayları (One-time purchase)
                        if (product.getOneTimePurchaseOfferDetails() != null) {
                             ProductDetails.OneTimePurchaseOfferDetails details = product.getOneTimePurchaseOfferDetails();
                             productJson.put("price", details.getFormattedPrice());
                             productJson.put("priceAmountMicros", details.getPriceAmountMicros());
                             productJson.put("currency", details.getPriceCurrencyCode());
                        } 
                        // Fiyat detayları (Subscription)
                        else {
                            List<ProductDetails.SubscriptionOfferDetails> offers = product.getSubscriptionOfferDetails();
                            if (offers != null && !offers.isEmpty()) {
                                ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
                                List<ProductDetails.PricingPhase> pricingPhases = offer.getPricingPhases().getPricingPhaseList();
                                if (!pricingPhases.isEmpty()) {
                                    ProductDetails.PricingPhase phase = pricingPhases.get(0);
                                    productJson.put("price", phase.getFormattedPrice());
                                    productJson.put("priceAmountMicros", phase.getPriceAmountMicros());
                                    productJson.put("currency", phase.getPriceCurrencyCode());
                                }
                            }
                        }
                        
                        products.put(productJson);
                    }
                    
                    JSObject result = new JSObject();
                    result.put("products", products.toString());
                    call.resolve(result);
                } catch (Exception e) {
                    call.reject("Error parsing products: " + e.getMessage());
                }
            } else {
                call.reject("Failed to get products: " + billingResult.getDebugMessage());
            }
        });
    }
    
    /**
     * Ürün/Abonelik satın al
     */
    @PluginMethod
    public void purchaseProduct(PluginCall call) {
        if (!isClientReady) {
            call.reject("Billing client not ready");
            return;
        }
        
        String productId = call.getString("productId", DEFAULT_PRODUCT_ID);
        String type = call.getString("type", "inapp"); // 'inapp' or 'subs'
        String productType = type.equals("subs") ? BillingClient.ProductType.SUBS : BillingClient.ProductType.INAPP;

        pendingPurchaseCall = call;
        
        // First, get product details
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(productType)
                .build()
        );
        
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();
        
        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && !productDetailsList.isEmpty()) {
                ProductDetails productDetails = productDetailsList.get(0);
                
                BillingFlowParams.Builder billingFlowParamsBuilder = BillingFlowParams.newBuilder();
                BillingFlowParams.ProductDetailsParams.Builder productDetailsParamsBuilder = BillingFlowParams.ProductDetailsParams.newBuilder()
                            .setProductDetails(productDetails);

                // Abonelik için offerToken gerekli
                if (productType.equals(BillingClient.ProductType.SUBS)) {
                    List<ProductDetails.SubscriptionOfferDetails> offers = productDetails.getSubscriptionOfferDetails();
                    if (offers == null || offers.isEmpty()) {
                        call.reject("No subscription offers available");
                        pendingPurchaseCall = null;
                        return;
                    }
                    // Varsayılan olarak ilk teklifi kullan
                    productDetailsParamsBuilder.setOfferToken(offers.get(0).getOfferToken());
                }

                billingFlowParamsBuilder.setProductDetailsParamsList(List.of(productDetailsParamsBuilder.build()));
                BillingFlowParams billingFlowParams = billingFlowParamsBuilder.build();
                
                getActivity().runOnUiThread(() -> {
                    BillingResult result = billingClient.launchBillingFlow(getActivity(), billingFlowParams);
                    if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject("Failed to launch billing flow: " + result.getDebugMessage());
                        pendingPurchaseCall = null;
                    }
                });
            } else {
                call.reject("Product not found: " + productId);
                pendingPurchaseCall = null;
            }
        });
    }

    // Geriye dönük uyumluluk için alias
    @PluginMethod
    public void purchaseSubscription(PluginCall call) {
        // Force type to subs for backward compatibility
        try {
            JSObject newData = call.getData();
            newData.put("type", "subs");
            // Not: Capacitor PluginCall verisini değiştirmek doğrudan mümkün olmayabilir, 
            // bu yüzden purchaseProduct mantığını buraya kopyalamak yerine purchaseProduct'ı JS tarafında kullanmalıyız.
            // Ancak JS tarafını güncellediğimiz için bu metoda çok ihtiyaç kalmayacak.
            // Yine de fallback olarak purchaseProduct'ı çağırıyoruz (type default inapp olacak eğer js göndermezse, ama biz js'te subs gönderirdik eskiden)
            // Bu metodun doğru çalışması için JS tarafında 'type: subs' eklenmeliydi. 
            // Biz JS tarafını purchaseProduct kullanacak şekilde güncelledik.
            purchaseProduct(call); 
        } catch(Exception e) {
            call.reject("Error redirecting to purchaseProduct");
        }
    }
    
    /**
     * Aktif satın alımları kontrol et
     */
    @PluginMethod
    public void getActiveSubscriptions(PluginCall call) {
        // Bu metod artık hem INAPP hem SUBS için kullanılmalı veya yeni metod eklenmeli.
        // Şimdilik sadece SUBS dönüyor gibi bırakabiliriz veya güncelleyebiliriz.
        // Genelde restorePurchases kullanılır ama aktif durum kontrolü için her ikisine de bakalım.
        // Ancak bu metodun ismi getActiveSubscriptions olduğu için sadece SUBS bakması daha mantıklı olabilir
        // veya JS tarafında ne beklendiğine göre değişir.
        // Bizim JS kodumuzda bu metod checkAndroidSubscription içinde kullanılıyor.
        
        if (!isClientReady) {
            call.reject("Billing client not ready");
            return;
        }

        // Check SUBS
         billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build(),
            (billingResult, purchases) -> {
                // ... (Original logic)
                 if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    try {
                        JSONArray subscriptions = new JSONArray();
                        for (Purchase purchase : purchases) {
                             if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                                JSONObject subJson = new JSONObject();
                                subJson.put("productId", purchase.getProducts().get(0));
                                subJson.put("purchaseToken", purchase.getPurchaseToken());
                                subJson.put("purchaseTime", purchase.getPurchaseTime());
                                subJson.put("autoRenewing", purchase.isAutoRenewing());
                                subscriptions.put(subJson);
                             }
                        }
                        JSObject result = new JSObject();
                        result.put("subscriptions", subscriptions.toString());
                        call.resolve(result);
                    } catch(Exception e) {
                        call.reject("Error " + e.getMessage());
                    }
                 } else {
                     call.reject("Error checking subs");
                 }
            });
    }
    
    /**
     * Satın alımları geri yükle (Hem SUBS hem INAPP)
     */
    @PluginMethod
    public void restorePurchases(PluginCall call) {
        if (!isClientReady) {
            call.reject("Billing client not ready");
            return;
        }

        // Önce SUBS, sonra INAPP kontrol edelim. Basitçe birleştirip dönelim. 
        // Asenkron olduğu için iç içe çağıracağız.
        
        final boolean[] hasActive = {false};
        
        // 1. Check SUBS
        billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build(),
            (resSubs, listSubs) -> {
                if (resSubs.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    for (Purchase p : listSubs) {
                        if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                            hasActive[0] = true;
                            if (!p.isAcknowledged()) acknowledgePurchase(p);
                        }
                    }
                }
                
                // 2. Check INAPP
                billingClient.queryPurchasesAsync(
                    QueryPurchasesParams.newBuilder()
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build(),
                    (resInApp, listInApp) -> {
                        if (resInApp.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                             for (Purchase p : listInApp) {
                                if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                                    hasActive[0] = true;
                                    if (!p.isAcknowledged()) acknowledgePurchase(p);
                                }
                            }
                        }
                        
                        JSObject result = new JSObject();
                        result.put("hasActiveSubscription", hasActive[0]); // İsimlendirme legacy kaldı ama içerik doğru
                        call.resolve(result);
                    }
                );
            }
        );
    }
    
    /**
     * Satın almayı onayla (acknowledge)
     */
    private void acknowledgePurchase(Purchase purchase) {
        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.getPurchaseToken())
            .build();
        
        billingClient.acknowledgePurchase(params, billingResult -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                Log.d(TAG, "Purchase acknowledged successfully");
            } else {
                Log.e(TAG, "Failed to acknowledge purchase: " + billingResult.getDebugMessage());
            }
        });
    }
    
    // PurchasesUpdatedListener implementation
    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "User canceled the purchase");
            if (pendingPurchaseCall != null) {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("code", "USER_CANCELED");
                pendingPurchaseCall.resolve(result);
                pendingPurchaseCall = null;
            }
        } else {
            Log.e(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            if (pendingPurchaseCall != null) {
                pendingPurchaseCall.reject("Purchase failed: " + billingResult.getDebugMessage());
                pendingPurchaseCall = null;
            }
        }
    }
    
    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            // Acknowledge the purchase
            if (!purchase.isAcknowledged()) {
                acknowledgePurchase(purchase);
            }
            
            // Notify JavaScript
            if (pendingPurchaseCall != null) {
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("productId", purchase.getProducts().get(0));
                result.put("purchaseToken", purchase.getPurchaseToken());
                pendingPurchaseCall.resolve(result);
                pendingPurchaseCall = null;
            }
            
            // Also emit an event for any listeners
            JSObject eventData = new JSObject();
            eventData.put("productId", purchase.getProducts().get(0));
            eventData.put("purchaseToken", purchase.getPurchaseToken());
            notifyListeners("purchaseCompleted", eventData);
        } else if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) {
            Log.d(TAG, "Purchase is pending");
             // Pending durumunda success:false, pending:true dönebiliriz veya bekleriz.
             // Kullanıcıya bilgi vermek için döndürmek daha iyi.
             if (pendingPurchaseCall != null) {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("pending", true);
                pendingPurchaseCall.resolve(result);
                pendingPurchaseCall = null;
             }
        }
    }
    
    // BillingClientStateListener implementation
    @Override
    public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
            isClientReady = true;
            Log.d(TAG, "Billing setup finished successfully");
        }
    }
    
    @Override
    public void onBillingServiceDisconnected() {
        isClientReady = false;
        Log.w(TAG, "Billing service disconnected");
        
        // Try to reconnect
        if (billingClient != null) {
             billingClient.startConnection(this);
        }
    }
    
    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (billingClient != null) {
            billingClient.endConnection();
        }
    }
}
