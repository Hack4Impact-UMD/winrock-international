import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Result, { handleFirebaseError } from "../../types/Result"

export interface Message {
	projectId: string;
	senderId: string;
	text: string;
	timestamp: Date;
}

export const sendMessage = async (projectId: string, senderId: string, message: string): Promise<Result> => {

	try {
		await addDoc(collection(db, "projectMessages"), {
			projectId: projectId,
			senderId: senderId,
			message: message,
			timestamp: serverTimestamp()
		});

		return { success: true };
	}
	catch (e) {
		return handleFirebaseError(e);
	}
}