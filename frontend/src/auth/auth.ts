import { 
    type User,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    OAuthProvider
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebaseConfig.js";
import Result from "../types/Result.js";

interface SignupInfo {
    email: string;
    password: string;
    role: string;
}

interface OutlookSignupInfo {
    role: string;
}

interface LoginInfo {
    email: string;
    password: string;
}

/**
 * Sign up a user (client, supplier, or Winrock employee)
 * with an email and password.
 * 
 * @param email of the user.
 * @param password of the user. 
 * @returns a Promise<AuthResult>.
 */
async function handleSignup({ email, password, role }: SignupInfo): Promise<Result> {
    try {
        const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = newUserCredential.user;
        return { success: true, data: newUser.uid };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Sign up a user (client, supplier, or Winrock employee)
 * via Microsoft Outlook.
 * 
 * @returns a Promise<Result>.
 */
async function handleOutlookSignup({ role } : OutlookSignupInfo): Promise<Result> {
    try {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('email');
        provider.addScope('profile');
        
        const newUserCredential = await signInWithPopup(auth, provider);
        const newUser: User = newUserCredential.user;
        return { success: true, data: newUser.uid };
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
 * @returns a Promise<AuthResult>.
 */
async function handleLogin({ email, password }: LoginInfo): Promise<Result> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user: User = userCredential.user;
        return { success: true, data: user.uid };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Log in a user via Microsoft Outlook.
 * 
 * @returns a Promise<Result>.
 */
async function handleOutlookLogin(): Promise<Result> {
    try {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('email');
        provider.addScope('profile');
        
        const userCredential = await signInWithPopup(auth, provider);
        const user: User = userCredential.user;
        return { success: true, data: user.uid };
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
        await(signOut(auth));
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
    handleSignup,
    handleOutlookSignup,
    handleLogin,
    handleOutlookLogin,
    handleLogout
};