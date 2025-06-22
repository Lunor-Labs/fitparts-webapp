import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAr3E1cue5xOWw6ZDOw4N-n8_idgETEOQU",
  authDomain: "fitparts-373bc.firebaseapp.com",
  projectId: "fitparts-373bc",
  storageBucket: "fitparts-373bc.firebasestorage.app",
  messagingSenderId: "1069385301519",
  appId: "1:1069385301519:web:1a71031b97023c3ef32d7a",
  measurementId: "G-43BPLNZ09N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);