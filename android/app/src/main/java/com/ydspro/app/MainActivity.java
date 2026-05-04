package com.ydspro.app;

import android.os.Bundle;
import android.graphics.Color;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Register custom plugins BEFORE calling super.onCreate()
        registerPlugin(YDSBillingPlugin.class);
        
        super.onCreate(savedInstanceState);
        
        // Set WebView background to dark color to prevent white flash
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.setBackgroundColor(Color.parseColor("#0f0d1e"));
        }
        
        // Also set the window background
        getWindow().getDecorView().setBackgroundColor(Color.parseColor("#0f0d1e"));
    }
}
