import styles from "../css-modules/Chat.module.css";
import { Message, SenderRole, sendMessage, getMessages } from "../chatUtils";
import { useEffect, useRef, useState } from "react";
import Result from "../../../types/Result"

interface ChatProps {
	senderRole: SenderRole;
	projectId: string;
	active: boolean;
}

const Chat = ({ senderRole, projectId, active }: ChatProps) => {
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
		if (!messageToSend) {
			return;
		}
		setNewMessageText("");
		const result: Result = await sendMessage(projectId, "", senderRole, messageToSend);
		if (result.success) {
			const newMessage = result.data;
			setMessages([...messages, newMessage]);
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
			<label htmlFor="newMessageText">Request Additional Information</label>
			<input type="text" id="newMessageText" className={styles.newMessageInput}
				placeholder="Enter text here" value={newMessageText} onChange={handleTextChange} autoComplete="off"></input>
			<button className={styles.sendButton} type="submit">Send</button>
		</form>

	return <div>
		{loadingMessages ? <div>Loading messages...</div> : messageBubblesContainer}
		{active ? newMessageContainer : <div className={styles.archivedNotice}>This project is archived. Messaging is disabled.</div>}
	</div>
}

export default Chat;