import { auth } from "../firebaseConfig.js";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/auth.css";

interface StandardLoginInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// https://firebase.google.com/docs/auth/web/start
async function handleStandardLogin({ email, password }: StandardLoginInfo) {
    try {
        // Firebase automatically updates the user to be used throughout the app.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        // We can use user.uid to access fields like firstName and lastName from Firestore.
    } catch (error) {
        console.error("Error signing in: ", error);
    }
}

function StandardLoginPage() {
    <>
    </>
}

export default StandardLoginPage;