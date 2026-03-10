import React, { useState, useMemo, useEffect } from "react";
import NotificationList from "./NotificationList";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import styles from "../css-modules/NotificationCenter.module.css";
import { Notification } from "../../../types/Notification";
import { collection, getDocs, query, where } from "firebase/firestore";
import { handleFirebaseError } from "../../../types/Result";
import { auth, db } from "../../../firebaseConfig";
import Result from "../../../types/Result"

export type NotificationTab = "Unread" | "Read" | "All";

const ITEMS_PER_PAGE = 10;

const SupplierNotificationCenter: React.FC = () => {
  const [tab, setTab] = useState<NotificationTab>("Unread");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filter notifications by tab
  const filteredNotifications = useMemo(() => {
    if (tab === "Unread") return notifications.filter((n) => !n.read);
    if (tab === "Read") return notifications.filter((n) => n.read);
    return notifications;
  }, [tab]);

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

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const getNotifications = async (recipientEmail: string): Promise<Result> => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("recipientEmail", "==", recipientEmail)
      );
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      return { success: true, data: notifications };
    } catch (e) {
      return handleFirebaseError(e);
    }
  }
  const currentUserEmail = auth.currentUser?.email || ""; // Get the logged-in user's email

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await getNotifications(currentUserEmail); // pass the logged-in user's email
      if (result.success) {
        setNotifications(result.data);
      }
    };
    fetchNotifications();
  }, [currentUserEmail]);

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

export default SupplierNotificationCenter;