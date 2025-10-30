import styles from "../css-modules/Chat.module.css";
import { Message, SenderRole, sendMessage, getMessages } from "../chatUtils";
import { useEffect, useRef, useState } from "react";
import Result from "../../../types/Result"

interface ChatProps {
	senderRole: SenderRole;
	projectId: string;
}

const Chat = ({ senderRole, projectId }: ChatProps) => {
	const messageContainerRef = useRef<HTMLDivElement | null>(null);
	const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessageText, setNewMessageText] = useState("");

	useEffect(() => {
		const fetchMessages = async () => {
			const result : Result = await getMessages(projectId);
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

	const handleSendClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!newMessageText.trim()) {
			return;
		}
		const result : Result = await sendMessage(projectId, "leia@umd.edu", senderRole, newMessageText);
		if (result.success) {
			const newMessage = result.data;
			setMessages([...messages, newMessage]);
		}
		setNewMessageText("");
	}

	const capitalizeRole = (role : SenderRole) : string => {
		return role.charAt(0).toUpperCase() + role.slice(1);
	}

	const messageBubblesContainer =
		<div ref={messageContainerRef} className={styles.messageBubblesContainer}>
			{messages.map((msg, index) => (
				<div key={index} className={msg.senderRole === senderRole ? styles.outgoingMessage : styles.incomingMessage}>
					<span>{capitalizeRole(msg.senderRole)}</span>
					<div className={styles.messageBubble}>{msg.message}</div>
				</div>
			))}
		</div> 

	const newMessageContainer = 
		<form className={styles.newMessageContainer}>
			<label htmlFor="newMessageText">Request Additional Information</label>
			<input type="text" id="newMessageText" className={styles.newMessageInput} 
			placeholder="Enter text here" value={newMessageText} onChange={handleTextChange}></input>
			<button className={styles.sendButton} onClick={handleSendClick}>Send</button>
		</form>

	return <div>
		{loadingMessages ? <div>Loading messages...</div> : messageBubblesContainer}
		{newMessageContainer}
	</div>
}

export default Chat;