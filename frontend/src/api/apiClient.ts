import {
    connectFunctionsEmulator,
    getFunctions,
    httpsCallable
} from "firebase/functions";

const functions = getFunctions();

// Connect to the emulator (for testing)
connectFunctionsEmulator(functions, "localhost", 5001);

export const sendEmail = httpsCallable(functions, 'sendEmail');
export const getS3UploadUrl = httpsCallable(functions, 'getS3UploadUrl');
export const confirmS3Upload = httpsCallable(functions, 'confirmS3Upload');
