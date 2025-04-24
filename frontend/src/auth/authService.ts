import  "firebase/firestore";
import {
    type User,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { db, auth } from "../firebaseConfig.js";
import Result, { handleFirebaseError } from "../types/Result.js";
import Role from "../types/Role.js";
import { addDoc, collection, doc, endAt, getDocs, limit, orderBy, query, setDoc, startAfter, where } from "firebase/firestore";

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
const handleSignup = async ({ email, password, firstName, lastName, role, company }: SignupInfo): Promise<Result> => {
    try {
        if (!firstName) return { success: false, errorCode: "missing-firstname" };
        if (!lastName) return { success: false, errorCode: "missing-lastname" };
        if (!role) return { success: false, errorCode: "missing-role" };
        // Email and password fields are checked by Firebase

        let companyField = {};
        if (role === "client" || role === "supplier") {
            if (!company) return { success: false, errorCode: "missing-company" };

            const companiesRef = collection(db, "companies");
            const q = query(companiesRef, where("name", "==", company));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(companiesRef, { name: company });
            }

            companyField = { company };
        } else if (role === "admin") {
            if (company) return { success: false, errorCode: "company-field-not-allowed" };
        } else {
            return { success: false, errorCode: "invalid-role" };
        }

        const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = newUserCredential.user;

        const docRef = doc(db, "users", newUser.uid); // Use the user's random UID as the document ID
        const newUserObj = {
            email,
            firstName,
            lastName,
            role,
            ...companyField
        };

        await setDoc(docRef, newUserObj);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Log in a user with their email and password.
 * 
 * @param email of the user.
 * @param password of the user.
 * @returns a Promise<Result>.
 */
const handleLogin = async ({ email, password }: LoginInfo): Promise<Result> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Log out the current user.
 */
const handleLogout = async (): Promise<Result> =>  {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Send a password reset email to the given email address.
 * 
 * @param email to send the password reset email to.
 * @returns a Promise<Result>.
 */
const sendPasswordResetLink = async (email: string): Promise<Result> => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

const fetchCompanySuggestions = async (input: string): Promise<Result> => {
    if (!input) {
      return { success: false, errorCode: "missing-input" };
    }

    const suggestions: string[] = [];

    try {
        const companiesRef = collection(db, "companies");
        const q = query(companiesRef,
            orderBy("name"),
            limit(5),
            startAfter(input),
            endAt(input + "\uf8ff"));

        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            suggestions.push(doc.data().name);
        });
        
        return {
            success: true,
            data: suggestions
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

export {
    type Role,
    type SignupInfo,
    handleSignup,
    handleLogin,
    handleLogout,
    sendPasswordResetLink,
    fetchCompanySuggestions
};