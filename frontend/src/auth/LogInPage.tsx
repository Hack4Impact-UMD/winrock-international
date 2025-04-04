import { auth } from "../firebaseConfig.js";
import { User, signInWithEmailAndPassword } from "firebase/auth";

// Winrock wants to sign up and log in via Outlook.
// For clients, standard signup and login will suffice.

// We can separate the standard and Outlook login flows into different components

interface StandardLoginInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface OutlookLoginInfo {
    // add fields
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

async function handleOutlookLogin({}: OutlookLoginInfo) {

}

async function LogInPage() {
    <>
    </>
}

export default LogInPage;