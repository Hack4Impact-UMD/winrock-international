import {
    useMemo,
    useState
} from "react";
import { NotificationTab } from "./NotificationCenter";
import styles from "../css-modules/NotificationCenter.module.css";
import Pagination from "../components/Pagination";

interface Notification {
    id: number;
    date: string;
    time: string;
    type: string;
    project: string;
    message: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
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

interface NotificationListProps {
    tab: NotificationTab;
}

const ITEMS_PER_PAGE = 10;

const NotificationList: React.FC<NotificationListProps> = ({ tab: initialTab }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [tab, setTab] = useState<NotificationTab>(initialTab);

    const filteredNotifications = useMemo(() => {
        if (tab === "Unread") return mockNotifications.filter((n) => !n.read);
        if (tab === "Read") return mockNotifications.filter((n) => n.read);
        return mockNotifications;
    }, [tab]);

    const totalItems = filteredNotifications.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

    // Envelope icon SVG
    const EnvelopeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: 'middle' }}>
            <rect x="3" y="5" width="14" height="10" rx="2" stroke="#205493" strokeWidth="1.5"/>
            <path d="M3.5 5.5L10 11L16.5 5.5" stroke="#205493" strokeWidth="1.5"/>
        </svg>
    );

    return (
        <div style={{ background: '#fff', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className={styles.tabActionBarRow}>
                <div className={styles.tabSwitcher}>
                    {(["Unread", "Read", "All"] as NotificationTab[]).map((t) => (
                        <button
                            key={t}
                            className={t === tab ? styles.activeTabButton : styles.tabButton}
                            onClick={() => { setTab(t); setCurrentPage(1); setSelectedRows([]); }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                {selectedRows.length > 0 && (
                    <div className={styles.actionBar}>
                        <button className={styles.markReadButton} onClick={() => {}}>
                            <EnvelopeIcon /> Mark as read
                        </button>
                        <button className={styles.doneButton} onClick={() => {}}>Done</button>
                    </div>
                )}
            </div>
            <table className={styles.notificationTable} style={{ background: '#fff', width: '100%' }}>
                <thead style={{ background: '#fff' }}>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className={styles.checkboxShadow}
                                checked={
                                    paginatedNotifications.length > 0 &&
                                    selectedRows.length === paginatedNotifications.length
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Project</th>
                        <th>Message</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody style={{ background: '#fff' }}>
                    {paginatedNotifications.map((n) => (
                        <tr key={n.id} className={n.read ? styles.readRow : styles.unreadRow} style={{ background: '#fff' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxShadow}
                                    checked={selectedRows.includes(n.id)}
                                    onChange={(e) => handleRowSelect(n.id, e.target.checked)}
                                />
                            </td>
                            <td>{n.date}</td>
                            <td>{n.time}</td>
                            <td>{n.type}</td>
                            <td>{n.project}</td>
                            <td>{n.message}</td>
                            <td>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <EnvelopeIcon />
                                    <button className={styles.viewButton}>View</button>
                                </span>
                            </td>
                        </tr>
                    ))}
                    {paginatedNotifications.length === 0 && (
                        <tr>
                            <td colSpan={7} className={styles.emptyState}>No notifications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default NotificationList;