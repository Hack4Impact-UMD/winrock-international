import React, { useState, useEffect } from 'react';
import styles from '../css-modules/ProjectUpdates.module.css';
import { sendMessage, getMessages, Message, SenderRole } from '../../chat/chatUtils';
import { useParams } from 'react-router-dom';

interface UpdateItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  timestamp: string;
  status: "received" | "sent" | "completed";
  canRequestInfo?: boolean;
  messages?: string[];
}

interface ProjectUpdatesProps {
  updates: UpdateItem[];
}

const ProjectUpdates: React.FC<ProjectUpdatesProps> = ({ updates }) => {
  const [requestTexts, setRequestTexts] = useState<Record<string, string>>({});
  const [updateMessages, setUpdateMessages] = useState<Record<string, { sender: SenderRole; text: string }[]>>({});
  const [selectedCounterparties, setSelectedCounterparties] = useState<Record<string, 'supplier' | 'winrock'>>({});
  const parseRelativeTimestamp = (timestamp: string): number => {
    const regex = /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/;
    const match = timestamp.match(regex);

    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    const now = new Date().getTime();
    const unitsToMs: Record<string, number> = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000, // rough estimate
      year: 365 * 24 * 60 * 60 * 1000, // rough estimate
    };

    return now - value * unitsToMs[unit];
  };


  const generateCounterpartyReply = (userMessage: string, counterpartyType: 'supplier' | 'winrock'): string => {
    userMessage = userMessage.toLowerCase(); //Dummy just for passing build
    const supplierReplies = [
      "Thanks for the update!",
      "We'll look into it.",
      "Can you clarify?",
      "Received, thanks!",
      "Let me check with my team.",
    ];

    const winrockReplies = [
      "Thanks for sending this over.",
      "Can you send more details?",
      "Looks good!",
      "We'll review and revert.",
      "Appreciate the update!",
    ];

    const replies = counterpartyType === "winrock" ? winrockReplies : supplierReplies;
    return replies[Math.floor(Math.random() * replies.length)];
  };



  const handleRequestInfo = async (updateId: string) => {
    const text = requestTexts[updateId];
    if (text && text.trim() !== '') {
      const sender = 'supplier';
      const counterparty = 'winrock';

      await sendMessage(projectId, "1", sender, text.trim());

      setUpdateMessages(prev => ({
        ...prev,
        [updateId]: [...(prev[updateId] || []), { sender, text: text.trim() }],
      }));

      setRequestTexts(prev => ({
        ...prev,
        [updateId]: '',
      }));

      // simulate delay
      await new Promise(r => setTimeout(r, 1500));

      await sendMessage(projectId, "1", counterparty, generateCounterpartyReply(text, counterparty));
      setUpdateMessages(prev => ({
        ...prev,
        [updateId]: [...(prev[updateId] || []), { sender: counterparty, text: generateCounterpartyReply(text, counterparty) }],
      }));
    }
  };




  const handleInputChange = (updateId: string, value: string) => {
    setRequestTexts(prev => ({
      ...prev,
      [updateId]: value,
    }));
  };

  // const sortedUpdates = [...updates].sort((a, b) => b.id - a.id);
  const sortedUpdates = [...updates].sort(
    (a, b) => parseRelativeTimestamp(b.timestamp) - parseRelativeTimestamp(a.timestamp)
  );

  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId ?? updates[0]?.projectId ?? '';
  if (projectId === '') {
    console.error('Project ID could not be retrieved');
  }

  useEffect(() => {
    const loadProjectMessages = async () => {
      if (!projectId) return;
      const result = await getMessages(projectId);
      const messages: Message[] = result.success && result.data ? result.data : [];
      const groupedMessages: Record<string, { sender: SenderRole; text: string }[]> = {};
      const updateId = updates[0].id;
      for (const msg of messages) {
        if (!groupedMessages[updateId]) {
          groupedMessages[updateId] = [];
        }
        groupedMessages[updateId].push({ sender: msg.senderRole, text: msg.message });
      }
      setUpdateMessages(groupedMessages);
    }
    loadProjectMessages();
  }, [projectId, updates]);


  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Updates</h2>
      {sortedUpdates.map((update, index) => {
        const isMostRecent = index === 0;
        const activeColor = '#1a4b8b';
        const inactiveColor = '#000000';
        const displayNumber = sortedUpdates.length - index;
        const messages = updateMessages[update.id] || [];

        return (
          <div key={update.id} className={styles.updateCard}>
            <div className={styles.updateHeader}>
              <div className={styles.leftSide}>
                <div
                  className={styles.updateNumberCircle}
                  style={{
                    backgroundColor: isMostRecent ? '#1a4b8b' : '#d3d3d3',
                    color: isMostRecent ? '#ffffff' : '#ffffff',
                  }}
                >
                  {displayNumber}
                </div>
                <div className={styles.updateTitle}>
                  <h3 style={{ color: isMostRecent ? activeColor : inactiveColor }}>
                    {update.title}
                  </h3>
                  {update.description && (
                    <p className={styles.description}>{update.description}</p>
                  )}
                </div>
              </div>
              <div className={styles.updateTime}>{update.timestamp}</div>
            </div>

            {update.canRequestInfo && (
              <div className={styles.requestInfoSection}>
                <button className={styles.viewFileButton}>View file</button>
                <div className={styles.counterpartySelector}>
                  {/* <label>Select Contact:</label> */}
                  <select
                    value={selectedCounterparties[update.id] || "supplier"}
                    onChange={(e) =>
                      setSelectedCounterparties(prev => ({
                        ...prev,
                        [update.id]: e.target.value as "winrock",
                      }))
                    }
                    className={styles.selectDropdown}
                  >
                    <option value="supplier">Supplier</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                <div className={styles.messageList}>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`${styles.messageItem} ${msg.sender === 'supplier' ? styles.userMessage : styles.winrockMessage}`}
                    >
                      <div className={styles.senderLabel}>
                        {msg.sender === 'supplier' ? 'Supplier (John Doe)' : 'Winrock (Mary Smith)'}
                      </div>

                      <div className={styles.messageText}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.requestDescription}>Request Additional information</div>
                <textarea
                  placeholder="Enter text here"
                  value={requestTexts[update.id] || ''}
                  onChange={(e) => handleInputChange(update.id, e.target.value)}
                  className={styles.textArea}
                />
                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.sendButton}
                    onClick={() => handleRequestInfo(update.id)}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectUpdates;
