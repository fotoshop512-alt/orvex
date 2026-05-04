
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// User provided configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP_ojqBfrdYL0ro3PnfdJvRSnI1RGM6ds",
  authDomain: "yds-master.firebaseapp.com",
  projectId: "yds-master",
  storageBucket: "yds-master.firebasestorage.app",
  messagingSenderId: "261073850792",
  appId: "1:261073850792:web:22e5de4e7cf0dd70900d9d",
  measurementId: "G-TWXMNYHCZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
