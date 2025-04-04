import { auth } from "../firebaseConfig.js";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/auth.css";

interface StandardSignupInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// https://firebase.google.com/docs/auth/web/start
async function handleStandardSignup({ firstName, lastName, email, password }: StandardSignupInfo) {
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

function StandardSignupPage() {
    return (
        <>
        </>
    )
}

export default StandardSignupPage;