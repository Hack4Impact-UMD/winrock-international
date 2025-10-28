import styles from "../css-modules/Chat.module.css";
import { Message, SenderRole, sendMessage } from "../chatUtils";
import { useState } from "react";

interface ChatProps {
	senderRole: SenderRole;
	projectId: string;
}

const Chat = ({ senderRole, projectId }: ChatProps) => {

	const [messages, setMessages] = useState<Message[]>([]);

	const [newMessageText, setNewMessageText] = useState("");

	const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessageText(event.target.value);
	}

	const handleSendClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const result = await sendMessage(projectId, "leia@umd.edu", senderRole, newMessageText);
		const newMessage = result.data;
		setMessages([...messages, newMessage]);
		setNewMessageText("");
	}

	const newMessageContainer = 
		<form className={styles.newMessageContainer}>
			<label htmlFor="newMessageText">Request Additional Information</label>
			<input type="text" id="newMessageText" className={styles.newMessageInput} 
			placeholder="Enter text here" value={newMessageText} onChange={handleTextChange}></input>
			<button className={styles.sendButton} onClick={handleSendClick}>Send</button>
		</form>

	return <div>
		{newMessageContainer}
	</div>
}

export default Chat;