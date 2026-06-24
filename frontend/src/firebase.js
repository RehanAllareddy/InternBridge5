import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_qtAFxXBPUVft7nNh51_b1IBoEp-U1uo",
  authDomain: "internbridge-20ccc.firebaseapp.com",
  projectId: "internbridge-20ccc",
  storageBucket: "internbridge-20ccc.firebasestorage.app",
  messagingSenderId: "1008596555603",
  appId: "1:1008596555603:web:335cafda89c2eae0bef3a6",
  measurementId: "G-GXQ43HZ25J",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
