import { FirebaseError } from "firebase/app";
import * as firestore from "firebase/firestore";
import { 
    type User,
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { db, auth } from "../firebaseConfig.js";
import Result from "../types/Result.js";

type Role =
    | "admin"
    | "client"
    | "supplier";

interface SignupInfo {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    company?: string;
}

interface LoginInfo {
    email: string;
    password: string;
}

/**
 * Sign up a user with an email and password.
 * 
 * @param email of the user.
 * @param password of the user. 
 * @param firstName of the user.
 * @param lastName of the user.
 * @param role of the user (client, supplier, or Winrock employee).
 * @param company of the user (if role is "client" or "supplier").
 * @returns a Promise<Result>.
 */
async function handleSignup({ email, password, firstName, lastName, role, company }: SignupInfo): Promise<Result> {
    try {
        if (!firstName) return { success: false, errorCode: "missing-firstname"};
        if (!lastName) return { success: false, errorCode: "missing-lastname"};
        if (!role) return { success: false, errorCode: "missing-role"};
        // Email and password fields are checked by Firebase

        let companyField = {};
        if (role === "client" || role === "supplier") {
            if (!company) return { success: false, errorCode: "missing-company"};
            companyField = { company };
        } else if (role === "admin") {
            if (company) return { success: false, errorCode: "company-field-not-allowed"};
        } else {
            return { success: false, errorCode: "invalid-role"};
        }

        const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = newUserCredential.user;

        const docRef = firestore.doc(db, "users", newUser.uid); // Use the user's random UID as the document ID
        const newUserObj = {
            email,
            firstName,
            lastName,
            role,
            ...companyField
        };
        
        await firestore.setDoc(docRef, newUserObj);
        return { success: true };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Log in a user with their email and password.
 * 
 * @param email of the user.
 * @param password of the user.
 * @returns a Promise<Result>.
 */
async function handleLogin({ email, password }: LoginInfo): Promise<Result> {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Log out the current user.
 */
async function handleLogout(): Promise<Result> {
    try {
        await signOut(auth);
        return { success: true };
    } catch(error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Send a password reset email to the given email address.
 * 
 * @param email to send the password reset email to.
 * @returns a Promise<Result>.
 */
async function sendPasswordResetLink(email: string): Promise<Result> {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch(error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

export { 
    type Role,
    type SignupInfo,
    handleSignup,
    handleLogin,
    handleLogout,
    sendPasswordResetLink
};