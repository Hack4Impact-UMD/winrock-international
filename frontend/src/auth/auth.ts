import { 
    type User,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    OAuthProvider
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../testFirebaseConfig.js";
import Result from "../types/Result.js";

interface WinrockSignupInfo {
    email: string;
    password: string;
}

interface ClientSignupInfo {
    email: string;
    password: string;
}

interface WinrockLoginInfo {
    email: string;
    password: string;
}

interface ClientLoginInfo {
    email: string;
    password: string;
}

/**
 * Sign up a Winrock employee with an email and password.
 * 
 * @param email of the Winrock employee.
 * @param password of the Winrock employee. 
 * @returns a Promise<AuthResult>.
 */
async function handleWinrockStandardSignup({ email, password }: WinrockSignupInfo): Promise<Result> {
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
 * Sign up a Winrock employee via Microsoft Outlook.
 * 
 * @returns a Promise<Result>.
 */
async function handleWinrockOutlookSignup(): Promise<Result> {
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
 * Sign up a client with an email and password.
 * 
 * @param email of the client.
 * @param password of the client.
 * @returns a Promise<Result>.
 */
async function handleClientSignup({ email, password }: ClientSignupInfo): Promise<Result> {
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
 * Log in a Winrock employee with an email and password.
 * 
 * @param email of the Winrock employee.
 * @param password of the Winrock employee. 
 * @returns a Promise<AuthResult>.
 */
async function handleWinrockStandardLogin({ email, password }: WinrockLoginInfo): Promise<Result> {
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
 * Log in a Winrock employee via Microsoft Outlook.
 * 
 * @returns a Promise<Result>.
 */
async function handleWinrockOutlookLogin(): Promise<Result> {
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
 * Log in a client with an email and password.
 * 
 * @param email of the client.
 * @param password of the client.
 * @returns a Promise<Result>.
 */
async function handleClientLogin({ email, password }: ClientLoginInfo): Promise<Result> {
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
 * Log out the current user.
 */
async function handleLogout() {
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
    handleWinrockStandardSignup, 
    handleWinrockOutlookSignup,
    handleClientSignup,
    handleWinrockStandardLogin,
    handleWinrockOutlookLogin,
    handleClientLogin,
    handleLogout
};