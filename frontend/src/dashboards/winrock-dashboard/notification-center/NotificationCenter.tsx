import React, { useState, useMemo } from "react";
import NotificationList from "./NotificationList";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import styles from "../css-modules/NotificationCenter.module.css";

export type NotificationTab = "Unread" | "Read" | "All";

const mockNotifications = [
  {
    id: 1,
    date: "Today",
    time: "09:00 am",
    type: "Form",
    project: "USAID Hamro Samman II",
    message: "Proposal Project Form submission received.",
    read: false,
  },
  {
    id: 2,
    date: "Yesterday",
    time: "02:00 pm",
    type: "Overall Stage",
    project: "McCormick",
    message: "Project inactive for 26 days.",
    read: false,
  },
  {
    id: 3,
    date: "3 days ago",
    time: "11:00 am",
    type: "Analysis Stage",
    project: "Nestle",
    message: "Project updated to GHG Assessment Analysis.",
    read: false,
  },
  {
    id: 4,
    date: "5 days ago",
    time: "01:00 pm",
    type: "Message",
    project: "Kellogg",
    message: "There has been a new update in the conversation",
    read: true,
  },
  {
    id: 5,
    date: "04/14/2025",
    time: "08:00am",
    type: "Message",
    project: "Kellogg",
    message: "There has been a new update in the conversation",
    read: true,
  },
];

const ITEMS_PER_PAGE = 10;

const NotificationCenter: React.FC = () => {
  const [tab, setTab] = useState<NotificationTab>("Unread");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Filter notifications by tab
  const filteredNotifications = useMemo(() => {
    if (tab === "Unread") return mockNotifications.filter((n) => !n.read);
    if (tab === "Read") return mockNotifications.filter((n) => n.read);
    return mockNotifications;
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
                    <button className={styles.markReadButton} onClick={() => {}}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                        <rect x="3" y="5" width="14" height="10" rx="2" stroke="#205493" strokeWidth="1.5"/>
                        <path d="M3.5 5.5L10 11L16.5 5.5" stroke="#205493" strokeWidth="1.5"/>
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