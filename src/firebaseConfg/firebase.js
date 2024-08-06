
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCrO5b48hHjr0Zb5K8D_R75xNJKRz7kvbc",
  authDomain: "react-firebase-e0cf3.firebaseapp.com",
  projectId: "react-firebase-e0cf3",
  storageBucket: "react-firebase-e0cf3.appspot.com",
  messagingSenderId: "9276102519",
  appId: "1:9276102519:web:986526eaa3d1b2e87a7372"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);