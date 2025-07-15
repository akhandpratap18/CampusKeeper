// src/firebase-config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Replace with your real Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0Sl4ApJpUs8YfyQyCcz_oV4DK4THf-Ns",
  authDomain: "campuskeeper-d7531.firebaseapp.com",
  projectId: "campuskeeper-d7531",
  storageBucket: "campuskeeper-d7531.appspot.com",
  messagingSenderId: "983941932831",
  appId: "1:983941932831:web:a0de20de08938d9f4d722a",
  measurementId: "G-Z5TDLEWZ7P",
};

// ✅ Avoid duplicate initialization
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export initialized services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
