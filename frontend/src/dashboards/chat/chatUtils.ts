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

export const sendNotification = async (projectName: string, senderEmail: string, senderRole: SenderRole, recipientEmail: string, recipientRole: SenderRole): Promise<Result> => {
	console.log("sendNotification called with:", { projectName, senderEmail, senderRole, recipientEmail, recipientRole });
	try {
		const newDocRef = await addDoc(collection(db, "notifications"), {
			projectName: projectName,
			senderEmail: senderEmail,
			senderRole: senderRole,
			recipientEmail: recipientEmail,
			recipientRole: recipientRole,
			timestamp: serverTimestamp(),
			type: "Chat"
		})
		const newDocSnap = await getDoc(newDocRef);
		console.log("DOC CREATED", newDocRef.id);

		return { success: true, data: newDocSnap.data() };
	}
	catch (e) {
		console.log("FAILED")
		console.log(e)
		return handleFirebaseError(e);
	}
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
		const messages: Message[] = querySnapshot.docs.map(d => d.data() as Message);
		messages.sort((a, b) => {
			const secondsDiff = a.timestamp.seconds - b.timestamp.seconds
			return secondsDiff === 0 ? a.timestamp.nanoseconds - b.timestamp.nanoseconds : secondsDiff;
		});
		return { success: true, data: messages };
	} catch (e) {
		return handleFirebaseError(e);
	}
}