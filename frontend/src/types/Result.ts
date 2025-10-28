import { FirebaseError } from "firebase/app";

type Result =
    | { success: true, data?: unknown }
    | { success: false; errorCode: string };

function handleFirebaseError(error: unknown): Result {
    return {
        success: false,
        errorCode: error instanceof FirebaseError ? error.code : "unknown"
    }
}

function toReadableError(errorCode: string): string {
    const readableError = errorCode.replace("auth/", "").replaceAll("-", " ");
    return readableError.charAt(0).toUpperCase() + readableError.slice(1);
}

export default Result;
export {
    handleFirebaseError,
    toReadableError
};