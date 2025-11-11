import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD1iMcqaCpG2QmV3gHh6tp1KTMaf7idPzk",
  authDomain: "portfolio-manager-c9b0e.firebaseapp.com",
  projectId: "portfolio-manager-c9b0e",
  storageBucket: "portfolio-manager-c9b0e.firebasestorage.app",
  messagingSenderId: "767253680905",
  appId: "1:767253680905:web:35bb3502c7e50c47a239d8"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
