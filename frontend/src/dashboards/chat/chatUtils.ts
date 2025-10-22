import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Result, { handleFirebaseError } from "../../types/Result"

export type SenderRole = "supplier" | "winrock";

export interface Message {
	projectId: string;
	senderId: string;
	senderRole: SenderRole;
	text: string;
	timestamp: Date;
}

export const sendMessage = async (projectId: string, senderId: string, senderRole: SenderRole, message: string): Promise<Result> => {

	try {
		await addDoc(collection(db, "projectMessages"), {
			projectId: projectId,
			senderId: senderId,
			senderRole: senderRole,
			message: message,
			timestamp: serverTimestamp()
		});

		return { success: true };
	}
	catch (e) {
		return handleFirebaseError(e);
	}
}