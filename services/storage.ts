
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { User } from "../types";

// --- Types ---
export interface UserProfile extends User {
  uid: string;
  notificationsEnabled?: boolean; // New field for push notification preference
  fcmToken?: string; // Firebase Cloud Messaging token
  fcmTokenUpdatedAt?: string; // Last time FCM token was updated
  avatarId?: number; // User's selected avatar ID
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

// --- Storage Service ---
export const storageService = {
  // --- AUTHENTICATION ---

  // Register new user
  async register(data: any): Promise<UserProfile> {
    const { email, password, securityQuestion, securityAnswer } = data;
    const cleanEmail = email.trim();

    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const firebaseUser = userCredential.user;

    const normalizedEmail = cleanEmail.toLowerCase();
    const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

    // 2. Create Firestore Document
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      username: cleanEmail,
      securityQuestion,
      securityAnswer,
      role: isAdmin ? 'ADMIN' : 'USER',
      isPro: isAdmin,
      score: 0,
      notificationsEnabled: true // Default to true
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
    return userProfile;
  },

  // Send Password Reset Email
  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Re-authenticate User
  async reauthenticate(password: string): Promise<void> {
    const user = auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    } else {
      throw new Error("Kullanıcı oturumu açık değil.");
    }
  },



  // Login
  async login(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim();

    // 1. Attempt Auth Login
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const uid = userCredential.user.uid;

    // 2. Try to fetch profile
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        // AUTO-HEAL
        console.warn("User profile missing in DB, auto-creating...");
        const normalizedEmail = cleanEmail.toLowerCase();
        const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

        const newProfile: UserProfile = {
          uid: uid,
          username: cleanEmail,
          securityQuestion: 'first_pet',
          securityAnswer: 'unknown',
          role: isAdmin ? 'ADMIN' : 'USER',
          isPro: isAdmin,
          score: 0,
          notificationsEnabled: true
        };

        await setDoc(doc(db, "users", uid), newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error("Error fetching/creating user profile during login:", error);
      throw error;
    }
  },



  // Send Verification Email
  async sendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error("Kullanıcı oturumu açık değil.");
    }
  },



  // Google Login
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      console.log('[Storage] loginWithGoogle started');
      // Check if running on mobile (Capacitor)
      const isMobile = (window as any).Capacitor !== undefined;
      console.log('[Storage] Platform:', isMobile ? 'Mobile' : 'Web');

      let credential;

      if (isMobile) {
        // Mobile: Use Capacitor SocialLogin plugin
        console.log('[Storage] Using Capacitor SocialLogin');
        const { SocialLogin } = await import('@capgo/capacitor-social-login');

        console.log('[Storage] Initializing SocialLogin...');
        await SocialLogin.initialize({
          google: {
            webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
          }
        });

        console.log('[Storage] Calling SocialLogin.login()...');
        const response = await SocialLogin.login({
          provider: 'google',
          options: {
            // scopes: ['email', 'profile'] // Removed to fix MAIN ACTIVITY error
          }
        });
        console.log('[Storage] SocialLogin.login() successful:', response);

        const idToken = (response.result as any).idToken;
        credential = GoogleAuthProvider.credential(idToken);
        console.log('[Storage] Created Firebase credential');
      } else {
        // Web: Use Firebase popup
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await signInWithPopup(auth, provider);
        // User is already signed in via popup, no need for credential
        const firebaseUser = result.user;
        const email = firebaseUser.email || "";

        // Check if user exists
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        } else {
          // Create new user profile
          const normalizedEmail = email.toLowerCase();
          const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            username: email,
            securityQuestion: 'google_auth',
            securityAnswer: 'google_auth',
            role: isAdmin ? 'ADMIN' : 'USER',
            isPro: isAdmin,
            score: 0,
            notificationsEnabled: true
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
          return newProfile;
        }
      }

      // Mobile path continues here
      if (isMobile && credential) {
        console.log('[Storage] Signing in with Firebase credential...');
        const userCredential = await signInWithCredential(auth, credential);
        console.log('[Storage] Firebase signInWithCredential successful');

        const firebaseUser = userCredential.user;
        const email = firebaseUser.email || "";
        console.log('[Storage] Firebase user:', { uid: firebaseUser.uid, email });

        // Check if user exists
        console.log('[Storage] Checking if user exists in Firestore...');
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          console.log('[Storage] User exists, returning profile');
          return userDoc.data() as UserProfile;
        } else {
          // Create new user profile
          console.log('[Storage] User does not exist, creating new profile...');
          const normalizedEmail = email.toLowerCase();
          const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            username: email,
            securityQuestion: 'google_auth',
            securityAnswer: 'google_auth',
            role: isAdmin ? 'ADMIN' : 'USER',
            isPro: isAdmin,
            score: 0,
            notificationsEnabled: true
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
          console.log('[Storage] New profile created successfully');
          return newProfile;
        }
      }

      throw new Error("Google Sign-In failed");
    } catch (error) {
      console.error("[Storage] Google Sign-In Error:", error);
      throw error;
    }
  },






  // Logout
  async logout() {
    await signOut(auth);
  },



  // Auth State Listener
  subscribeToAuth(callback: (user: UserProfile | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            const currentEmail = userData.username.toLowerCase().trim();
            const targetAdminEmail = ADMIN_EMAIL.toLowerCase().trim();

            const isAdminEmail = currentEmail === targetAdminEmail;

            // Force admin status if email matches (Recovery mechanism)
            if (isAdminEmail && (userData.role !== 'ADMIN' || !userData.isPro)) {
              console.log("Restoring Admin privileges...");
              await updateDoc(doc(db, "users", firebaseUser.uid), { role: 'ADMIN', isPro: true });
              userData.role = 'ADMIN';
              userData.isPro = true;
            }
            callback(userData);
          } else {
            callback(null);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },



  // --- USER MANAGEMENT (Firestore) ---

  async getUserProgress(uid: string, key: string): Promise<any> {
    try {
      const docRef = doc(db, "progress", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()[key];
      }
      return null;
    } catch (e) {
      console.error("Error fetching progress", e);
      return null;
    }
  },



  async saveUserProgress(uid: string, key: string, value: any) {
    try {
      const docRef = doc(db, "progress", uid);
      await setDoc(docRef, { [key]: value }, { merge: true });
    } catch (e) {
      console.error("Error saving progress", e);
    }
  },



  async updateUserScore(uid: string, score: number) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { score: score });
    } catch (e) {
      console.error("Error updating score", e);
    }
  },



  async getLeaderboard(limitCount: number = 50): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("score", "desc"), limit(limitCount));
      const querySnapshot = await getDocs(q);

      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      return users;
    } catch (e) {
      console.error("Error fetching leaderboard. Make sure index exists in Firebase Console.", e);
      return [];
    }
  },



  // --- ADMIN & PROFILE FUNCTIONS ---

  async getAllUsers(): Promise<UserProfile[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  },



  async updateUserRole(uid: string, isPro: boolean) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isPro: isPro });
  },

  // Avatar güncelle
  async updateUserAvatar(uid: string, avatarId: number) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { avatarId: avatarId });
  },

  // Abonelik bilgilerini güncelle
  async updateSubscription(uid: string, subscriptionData: {
    isPro: boolean;
    subscriptionId?: string;
    subscriptionPlatform?: 'google_play' | 'app_store' | 'admin';
    subscriptionStartDate?: string;
    subscriptionExpiryDate?: string;
    autoRenewing?: boolean;
  }) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      isPro: subscriptionData.isPro,
      subscriptionId: subscriptionData.subscriptionId || null,
      subscriptionPlatform: subscriptionData.subscriptionPlatform || null,
      subscriptionStartDate: subscriptionData.subscriptionStartDate || null,
      subscriptionExpiryDate: subscriptionData.subscriptionExpiryDate || null,
      autoRenewing: subscriptionData.autoRenewing ?? false,
    });
  },

  // Abonelik süresini kontrol et ve gerekirse iptal et
  async checkAndUpdateSubscriptionStatus(uid: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) return false;

      const userData = userDoc.data();

      // Admin kullanıcılar her zaman Pro
      if (userData.role === 'ADMIN') return true;

      // Abonelik bitiş tarihi kontrolü
      if (userData.subscriptionExpiryDate) {
        const expiryDate = new Date(userData.subscriptionExpiryDate);
        const now = new Date();

        if (expiryDate < now && !userData.autoRenewing) {
          // Abonelik süresi dolmuş ve otomatik yenileme kapalı - Pro'yu iptal et
          console.log('[Storage] Subscription expired, cancelling Pro status');
          await this.updateSubscription(uid, {
            isPro: false,
            autoRenewing: false,
          });
          return false;
        }
      }

      return userData.isPro || false;
    } catch (error) {
      console.error('[Storage] Check subscription error:', error);
      return false;
    }
  },

  // Pro üyeliği iptal et
  async cancelProMembership(uid: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      isPro: false,
      subscriptionId: null,
      subscriptionExpiryDate: null,
      autoRenewing: false,
    });
  },



  async updateUserPassword(uid: string, newPassword: string) {
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await updatePassword(user, newPassword);
      return true;
    } else {
      throw new Error("Unauthorized password change request");
    }
  },



  async updateNotificationSettings(uid: string, enabled: boolean) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { notificationsEnabled: enabled });
  },



  async updateUsername(uid: string, newUsername: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { username: newUsername });
  },



  async deleteUser(uid: string) {
    // Admin deletes user data
    await deleteDoc(doc(db, "users", uid));
    await deleteDoc(doc(db, "progress", uid));
    // Note: Cannot delete from Auth (Firebase Authentication) via Client SDK for another user.
    // This requires a Cloud Function or Admin SDK.
    // However, deleting the user doc effectively removes them from the app's logic.
  },



  async deleteAccount() {
    // User deletes their own account
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Kullanıcı oturumu açık değil.");
    }

    const uid = user.uid;

    try {
      // 1. Firestore'daki kullanıcı dökümanını sil
      await deleteDoc(doc(db, "users", uid));
      console.log('[Storage] User document deleted');
    } catch (e) {
      console.error('[Storage] Error deleting user doc:', e);
      // Devam et - kritik değil
    }

    try {
      // 2. Progress dökümanını sil (yoksa hata vermeyecek)
      await deleteDoc(doc(db, "progress", uid));
      console.log('[Storage] Progress document deleted');
    } catch (e) {
      console.error('[Storage] Error deleting progress doc:', e);
      // Devam et - kritik değil
    }

    // 3. Firebase Authentication'dan kullanıcıyı sil
    // Bu, requires-recent-login hatası verebilir
    await user.delete();
    console.log('[Storage] Firebase Auth user deleted');
  },



  // --- SYSTEM NOTIFICATIONS (ADMIN ONLY) ---
  // This writes to a collection that the Mobile App (wrapper) would listen to via FCM or Snapshot
  async sendSystemNotification(title: string, body: string, sender: string) {
    await addDoc(collection(db, "system_notifications"), {
      title,
      body,
      sender,
      createdAt: serverTimestamp(),
      target: "ALL_USERS" // Flag for the mobile app logic
    });
  },



  // --- ONBOARDING ---
  async hasCompletedOnboarding(uid: string): Promise<boolean> {
    try {
      const docRef = doc(db, "progress", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().onboardingCompleted === true;
      }
      return false;
    } catch (e) {
      console.error("Error checking onboarding status", e);
      return false;
    }
  },



  async markOnboardingComplete(uid: string) {
    try {
      const docRef = doc(db, "progress", uid);
      await setDoc(docRef, { onboardingCompleted: true }, { merge: true });
    } catch (e) {
      console.error("Error marking onboarding complete", e);
    }
  }
  ,

  async incrementUserScore(uid: string, points: number) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { score: increment(points) });
    } catch (e) {
      console.error("Error incrementing user score", e);
    }
  },

  async incrementUserStat(uid: string, statName: string, value: number = 1) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { [statName]: increment(value) });
    } catch (e) {
      console.error("Error incrementing user stat", e);
    }
  }
};
