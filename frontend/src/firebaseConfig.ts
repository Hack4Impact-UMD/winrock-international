// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyBFTvXkhesG59Ew38OzSPdm7ve_O25TKMU",
//     authDomain: "winrock-international.firebaseapp.com",
//     projectId: "winrock-international",
//     storageBucket: "winrock-international.firebasestorage.app",
//     messagingSenderId: "174098694912",
//     appId: "1:174098694912:web:fb265dd399579046cc69e5"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { db, auth };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyoTGTizVdHeiXn4GwGuMmHo4-_TbT5hM",
  authDomain: "dummy-winrock.firebaseapp.com",
  projectId: "dummy-winrock",
  storageBucket: "dummy-winrock.firebasestorage.app",
  messagingSenderId: "951740568595",
  appId: "1:951740568595:web:2a52308c1408dbf0575be6",
  measurementId: "G-VZ8T8SFDQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
