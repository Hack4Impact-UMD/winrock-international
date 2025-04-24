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

export default Result;
export { handleFirebaseError };