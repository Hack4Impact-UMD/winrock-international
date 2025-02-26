import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBFTvXkhesG59Ew38OzSPdm7ve_O25TKMU",
    authDomain: "winrock-international.firebaseapp.com",
    projectId: "winrock-international",
    storageBucket: "winrock-international.firebasestorage.app",
    messagingSenderId: "174098694912",
    appId: "1:174098694912:web:fb265dd399579046cc69e5"
};

export const app = initializeApp(firebaseConfig); // Initialize Firebase
export const db = getFirestore(app); // Initialize Cloud Firestore and get a reference to the service