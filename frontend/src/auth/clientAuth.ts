import { auth } from "../firebaseConfig.js";
import { type User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface ClientSignupInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface ClientLoginInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// https://firebase.google.com/docs/auth/web/start
async function handleClientSignup({ firstName, lastName, email, password }: ClientSignupInfo) {
    try {
        // Firebase automatically updates the user to be used throughout the app.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        // Firebase manages users via email and password.
        // To track other info e.g. firstName and lastName, we'll need to store it in the Firestore database.
    } catch (error) {
        console.error("Error signing up: ", error);
    }
}

// https://firebase.google.com/docs/auth/web/start
async function handleClientLogin({ email, password }: ClientLoginInfo) {
    try {
        // Firebase automatically updates the user to be used throughout the app.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        // We can use user.uid to access fields like firstName and lastName from Firestore.
    } catch (error) {
        console.error("Error signing in: ", error);
    }
}