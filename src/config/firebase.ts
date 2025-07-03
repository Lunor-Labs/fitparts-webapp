import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDDlcCyoTTX0xNKL2QPfoaTG5OadJLOh_U",
  authDomain: "spare-parts-finder-4fe2b.firebaseapp.com",
  projectId: "spare-parts-finder-4fe2b",
  storageBucket: "spare-parts-finder-4fe2b.firebasestorage.app",
  messagingSenderId: "193708650850",
  appId: "1:193708650850:web:b66f056ac40b1323933c3b",
  measurementId: "G-C9E61RPYWD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);