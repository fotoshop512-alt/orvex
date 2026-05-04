import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { db } from './firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const fcmService = {
    /**
     * Initialize FCM and request permissions
     */
    async initialize(userId: string): Promise<void> {
        // Only run on native platforms
        if (!Capacitor.isNativePlatform()) {
            console.log('FCM: Not a native platform, skipping initialization');
            return;
        }

        try {
            // Request permission to use push notifications
            const permStatus = await PushNotifications.requestPermissions();

            if (permStatus.receive === 'granted') {
                // Register with Apple / Google to receive push via APNS/FCM
                await PushNotifications.register();
                console.log('FCM: Registration successful');
            } else {
                console.log('FCM: Permission denied');
            }

            // Listen for registration success
            await PushNotifications.addListener('registration', async (token) => {
                console.log('FCM Token:', token.value);
                await this.saveFCMToken(userId, token.value);
            });

            // Listen for registration errors
            await PushNotifications.addListener('registrationError', (error) => {
                console.error('FCM Registration Error:', error);
            });

            // Listen for push notifications received
            await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push notification received:', notification);
                // You can show a local notification or update UI here
            });

            // Listen for push notification actions (when user taps notification)
            await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                console.log('Push notification action performed:', notification);
                // Handle navigation or actions here
            });

        } catch (error) {
            console.error('FCM Initialization Error:', error);
        }
    },

    /**
     * Save FCM token to Firestore
     */
    async saveFCMToken(userId: string, token: string): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                fcmToken: token,
                fcmTokenUpdatedAt: new Date().toISOString()
            });
            console.log('FCM Token saved to Firestore');
        } catch (error) {
            console.error('Error saving FCM token:', error);
        }
    },

    /**
     * Remove FCM listeners (call on logout)
     */
    async cleanup(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await PushNotifications.removeAllListeners();
            console.log('FCM: Listeners removed');
        } catch (error) {
            console.error('FCM Cleanup Error:', error);
        }
    }
};
