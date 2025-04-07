import { auth } from "../firebaseConfig.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    OAuthProvider
} from "firebase/auth";

// Winrock wants to be able to use Outlook for signup and login

interface WinrockSignupInfo {
    email: string;
    password: string;
}

interface WinrockLoginInfo {
    email: string;
    password: string;
}


async function handleWinrockSignup({ email, password }: WinrockSignupInfo) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}

async function handleWinrockLogin({ email, password }: WinrockLoginInfo) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

async function handleMicrosoftSignup() {
    try {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('email');
        provider.addScope('profile');
        
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error during Microsoft signup:', error);
        throw error;
    }
}

async function handleMicrosoftLogin() {
    try {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('email');
        provider.addScope('profile');
        
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error during Microsoft login:', error);
        throw error;
    }
}

export { 
    handleWinrockSignup, 
    handleWinrockLogin,
    handleMicrosoftSignup,
    handleMicrosoftLogin 
};