import { auth } from "../firebaseConfig.js";
import { User, createUserWithEmailAndPassword } from "firebase/auth";

// Winrock wants to sign up and log in via Outlook.
// For clients, standard signup and login will suffice.

// We can separate the standard and Outlook signup flows into different components

interface StandardSignupInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface OutlookSignupInfo {
    // add fields
}

// https://firebase.google.com/docs/auth/web/start
async function handleStandardSignup({ firstName, lastName, email, password }: StandardSignupInfo) {
    try {
        // Firebase automatically updates the user to be used throughout the app.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;

        // Firebase Authentication manages users via email and password.
        // To track other info e.g. firstName and lastName, we'll need to store it in the Firestore database.
    } catch (error) {
        console.error("Error signing up: ", error);
    }
}

// https://firebase.google.com/docs/auth/web/microsoft-oauth
async function handleOutlookSignup({}: OutlookSignupInfo) {
    return;
}

function SignUpPage() {
    <>
    </>
}

export default SignUpPage;