import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFTvXkhesG59Ew38OzSPdm7ve_O25TKMU",
    authDomain: "winrock-international.firebaseapp.com",
    projectId: "winrock-international",
    storageBucket: "winrock-international.firebasestorage.app",
    messagingSenderId: "174098694912",
    appId: "1:174098694912:web:fb265dd399579046cc69e5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };