import { auth } from "../testFirebaseConfig.js";
import { type User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface ClientSignupInfo {
    email: string;
    password: string;
}

interface ClientLoginInfo {
    email: string;
    password: string;
}

async function handleClientSignup({ email, password }: ClientSignupInfo) {
    try {
        // Firebase automatically updates the user to be used throughout the app.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        // Firebase manages users via email and password.
        // To track other info e.g. firstName and lastName, we'll need to store it in the Firestore database.

        console.log(user);
    } catch (error) {
        console.error("Error signing up: ", error);
    }
}

async function handleClientLogin({ email, password }: ClientLoginInfo) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;
        console.log(user);
    } catch (error) {
        console.error("Error signing in: ", error);
    }
}

export { handleClientSignup, handleClientLogin }