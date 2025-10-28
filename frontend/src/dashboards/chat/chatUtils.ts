import { collection, serverTimestamp, addDoc, getDocs, query, where, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Result, { handleFirebaseError } from "../../types/Result"

export type SenderRole = "supplier" | "winrock";

export interface Message {
	projectId: string;
	senderEmail: string;
	senderRole: SenderRole;
	message: string;
	timestamp: Timestamp;
}

export const sendMessage = async (projectId: string, senderEmail: string, senderRole: SenderRole, message: string): Promise<Result> => {

	try {
		const newDocRef = await addDoc(collection(db, "projectMessages"), {
			projectId: projectId,
			senderEmail: senderEmail,
			senderRole: senderRole,
			message: message,
			timestamp: serverTimestamp()
		});

		const newDocSnap = await getDoc(newDocRef);

		return { success: true, data: newDocSnap.data() };
	}
	catch (e) {
		return handleFirebaseError(e);
	}
}

export const getMessages = async (projectId: string): Promise<Result> => {
	try {
		const q = query(
			collection(db, "projectMessages"), 
			where("projectId", "==", projectId), 
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			return { success: true, data: [] };
		}
		const messages : Message[] = querySnapshot.docs.map(d => d.data() as Message);
		messages.sort((a,b) => a.timestamp.seconds - b.timestamp.seconds);
		return { success: true, data : messages };
	} catch (e) {
		return handleFirebaseError(e);
	}
}