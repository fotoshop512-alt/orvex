import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ydspro.app',
  appName: 'YDS PRO',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: "#0f0d1e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#6366f1",
      splashFullScreen: true,
      splashImmersive: true
    },
    SocialLogin: {
      google: {
        webClientId: '261073850792-he1n3bevad64ubbg0gnjncbf5cj0r69d.apps.googleusercontent.com',
        forceCodeForRefreshToken: true
      }
    }
  }
};

export default config;
