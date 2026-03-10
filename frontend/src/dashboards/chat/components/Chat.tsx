import styles from "../css-modules/Chat.module.css";
import { Message, SenderRole, sendMessage, getMessages, sendNotification } from "../chatUtils";
import { useEffect, useRef, useState } from "react";
import Result from "../../../types/Result"

interface ChatProps {
	senderRole: SenderRole;
	projectId: string;
	active: boolean;
	projectName: string;
	supplierEmail: string;
	winrockEmail: string;
}

const Chat = ({ senderRole, projectId, active, projectName, supplierEmail, winrockEmail }: ChatProps) => {
	const messageContainerRef = useRef<HTMLDivElement | null>(null);
	const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessageText, setNewMessageText] = useState("");

	useEffect(() => {
		const fetchMessages = async () => {
			const result: Result = await getMessages(projectId);
			setMessages(result.success ? result.data : []);
			setLoadingMessages(false);
		}
		fetchMessages();
	}, [projectId]);

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessageText(event.target.value);
	}

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const messageToSend = newMessageText.trim();
		event.preventDefault();
		if (!messageToSend) return;

		setNewMessageText("");
		const result: Result = await sendMessage(projectId, "", senderRole, messageToSend);

		if (result.success) {
			setMessages((prevMessages) => [...prevMessages, result.data]);

			const senderEmail = senderRole === "supplier" ? supplierEmail : winrockEmail;
			const recipientEmail = senderRole === "supplier" ? winrockEmail : supplierEmail;

			if (!senderEmail || !recipientEmail) {
				console.error("Notification skipped: missing participant email");
			} else {
				const notificationResult = await sendNotification(
					projectName,
					senderEmail,
					senderRole,
					recipientEmail,
					senderRole === "supplier" ? "winrock" : "supplier"
				);

				if (!notificationResult.success) {
					console.error("Notification failed:", notificationResult);
				}
			}
		} else {
			console.error("sendMessage failed:", result); // add this to check
		}
	}

	const capitalizeRole = (role: SenderRole): string => {
		return role.charAt(0).toUpperCase() + role.slice(1);
	}

	const messageBubblesContainer =
		<div ref={messageContainerRef} className={styles.messageBubblesContainer}>
			{messages.map((msg, index) => (
				<div key={index} className={msg.senderRole === senderRole ? styles.outgoingMessage : styles.incomingMessage}>
					<span>{capitalizeRole(msg.senderRole)}</span>
					<div className={`${styles.messageBubble} ${msg.senderRole === 'winrock' ? styles.winrockMessage : styles.supplierMessage}`}>{msg.message}</div>
				</div>
			))}
		</div>

	const newMessageContainer =
		<form className={styles.newMessageContainer} onSubmit={handleFormSubmit}>
			{
				senderRole === "supplier" &&
				<label htmlFor="newMessageText">Request Additional Information</label>
			}
			<input type="text" id="newMessageText" className={styles.newMessageInput}
				placeholder="Enter text here" aria-label="Enter message text" value={newMessageText} onChange={handleTextChange} autoComplete="off"></input>
			<button className={styles.sendButton} type="submit">Send</button>
		</form>

	return <div>
		{loadingMessages ? <div>Loading messages...</div> : messageBubblesContainer}
		{active ? newMessageContainer : <div className={styles.archivedNotice}>This project is archived. Messaging is disabled.</div>}
	</div>
}

export default Chat;