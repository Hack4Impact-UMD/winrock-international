import React, { useState, useMemo, useEffect } from "react";
import NotificationList from "./NotificationList";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import styles from "../css-modules/NotificationCenter.module.css";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export type NotificationTab = "Unread" | "Read" | "All";

export type NotificationType = "Chat" | "Form"

interface Notification {
  projectName: string;
  senderEmail: string;
  senderRole: string;
  recipientEmail: string;
  recipientRole: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  id: string;
}


const ITEMS_PER_PAGE = 10;

const NotificationCenter: React.FC = () => {
  const [tab, setTab] = useState<NotificationTab>("Unread");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const auth = getAuth(); // Get the Firebase Auth instance
  const userEmail = auth.currentUser?.email || '' // Get the current user's email

  useEffect(() => {
    const loadNotifications = async () => {
      const q = query(collection(db, "notifications"), where("recipientEmail", '==', userEmail));

      const docSnap = await getDocs(q);
      const fetchedNotifications: Notification[] = [];
      docSnap.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          projectName: data.projectName,
          senderEmail: data.senderEmail,
          senderRole: data.senderRole,
          recipientEmail: data.recipientEmail,
          recipientRole: data.recipientRole,
          timestamp: data.timestamp.toDate().toISOString(),
          type: data.type,
          read: false, // Assuming all fetched notifications are unread; adjust as needed
          id: doc.id,
        });
      });

      setNotifications(fetchedNotifications);
    }
    loadNotifications()
  }, [userEmail])

  // Filter notifications by tab
  const filteredNotifications = useMemo(() => {
    if (tab === "Unread") return notifications.filter((n) => !n.read);
    if (tab === "Read") return notifications.filter((n) => n.read);
    return notifications;
  }, [tab, notifications]);

  // Pagination
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedNotifications.map((n) => n.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  // Reset selection when tab or page changes
  React.useEffect(() => {
    setSelectedRows([]);
  }, [tab, currentPage]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      <Sidebar currentTab="notification-center" />

      <div style={{ marginLeft: "18.75rem", flex: 1, display: 'flex', flexDirection: 'column', background: '#f4f5f7' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <div style={{ background: '#fff', boxShadow: '0 1px 0 #e5e7eb' }}>
            <h1 className={styles.title}>Notification Center</h1>
            <div className={styles.tabActionBarRow}>
              <div className={styles.tabSwitcher}>
                {(["Unread", "Read", "All"] as NotificationTab[]).map((t) => (
                  <button
                    key={t}
                    className={t === tab ? styles.activeTabButton : styles.tabButton}
                    onClick={() => { setTab(t); setCurrentPage(1); }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {selectedRows.length > 0 && (
                <div className={styles.actionBar}>
                  <button className={styles.markReadButton} onClick={() => { }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                      <rect x="3" y="5" width="14" height="10" rx="2" stroke="#205493" strokeWidth="1.5" />
                      <path d="M3.5 5.5L10 11L16.5 5.5" stroke="#205493" strokeWidth="1.5" />
                    </svg>
                    Mark as read
                  </button>
                  <button
                    className={styles.doneButton}
                    onClick={() => setSelectedRows([])}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
            <NotificationList
              tab={tab}
              notifications={paginatedNotifications}
              selectedRows={selectedRows}
              onSelectAll={handleSelectAll}
              onRowSelect={handleRowSelect}
            />
          </div>
          <div style={{ flex: 1, background: '#f4f5f7' }} />
        </div>
        <div style={{ width: '100%', background: '#f4f5f7' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;