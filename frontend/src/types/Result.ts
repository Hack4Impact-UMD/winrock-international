import { FirebaseError } from "firebase/app";

type Result =
    | { success: true, data?: any }
    | { success: false; errorCode: string };

function handleFirebaseError(error: any): Result {
    return {
        success: false,
        errorCode: error instanceof FirebaseError ? error.code : "unknown"
    }
}

function toReadableError(errorCode: string): string {
    let readableError = errorCode.replace("auth/", "").replaceAll("-", " ");
    return readableError.charAt(0).toUpperCase() + readableError.slice(1);
}

export default Result;
export {
    handleFirebaseError,
    toReadableError
};