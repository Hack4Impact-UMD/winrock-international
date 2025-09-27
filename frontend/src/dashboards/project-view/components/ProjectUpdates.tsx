import React, { useState } from 'react';
import styles from '../css-modules/ProjectUpdates.module.css';

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
  completeProjectStage: () => void;
}

const ProjectUpdates: React.FC<ProjectUpdatesProps> = ({ updates, completeProjectStage }) => {
  const [requestTexts, setRequestTexts] = useState<Record<string, string>>({});
  const [updateMessages, setUpdateMessages] = useState<Record<string, { sender: 'user' | 'supplier' | 'client'; text: string }[]>>({});
  const [selectedCounterparties, setSelectedCounterparties] = useState<Record<string, "supplier" | "client">>({});
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
  

  const generateCounterpartyReply = (userMessage: string, counterpartyType: "supplier" | "client"): string => {
    const supplierReplies = [
      "Thanks for the update!",
      "We'll look into it.",
      "Can you clarify?",
      "Received, thanks!",
      "Let me check with my team.",
    ];
    
    const clientReplies = [
      "Thanks for sending this over.",
      "Can you send more details?",
      "Looks good!",
      "We'll review and revert.",
      "Appreciate the update!",
    ];
  
    const replies = counterpartyType === "client" ? clientReplies : supplierReplies;
    return replies[Math.floor(Math.random() * replies.length)];
  };
  
  

  const handleRequestInfo = (updateId: string) => {
    const text = requestTexts[updateId];
    if (text && text.trim() !== '') {
      const counterparty = selectedCounterparties[updateId] || 'supplier'; // Default to supplier if not selected
  
      setUpdateMessages(prev => ({
        ...prev,
        [updateId]: [...(prev[updateId] || []), { sender: 'user', text }],
      }));
  
      setRequestTexts(prev => ({
        ...prev,
        [updateId]: '',
      }));
  
      setTimeout(() => {
        setUpdateMessages(prev => ({
          ...prev,
          [updateId]: [...(prev[updateId] || []), { sender: counterparty, text: generateCounterpartyReply(text, counterparty) }],
        }));
      }, 1500);
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
  

  return (
    <div className={styles.container}>
      <div>
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
                          [update.id]: e.target.value as "supplier" | "client",
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
                      className={`${styles.messageItem} ${msg.sender === 'user' ? styles.userMessage : styles.supplierMessage}`}
                      >
                      <div className={styles.senderLabel}>
                          {msg.sender === 'user' ? 'You' : (msg.sender === 'supplier' ? 'Supplier' : 'Client')}
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
      <button className={styles.button} onClick={completeProjectStage}>
        Mark stage as complete
      </button>
    </div>
  );
};

export default ProjectUpdates;
