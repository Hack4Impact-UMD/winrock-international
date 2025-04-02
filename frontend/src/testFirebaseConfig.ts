import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const testFirebaseConfig = {
  apiKey: "AIzaSyDMy1FHyZ27-OMieBkfzxxBx4bnSf14IEU",
  authDomain: "test-winrock-international.firebaseapp.com",
  projectId: "test-winrock-international",
  storageBucket: "test-winrock-international.firebasestorage.app",
  messagingSenderId: "62086063208",
  appId: "1:62086063208:web:069863d7e14e47a4f107dd",
  measurementId: "G-YJ1TPPDRE0"
};

// Initialize Firebase
const app = initializeApp(testFirebaseConfig, 'test');
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };