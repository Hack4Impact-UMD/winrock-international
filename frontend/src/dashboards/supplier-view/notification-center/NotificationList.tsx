import { NotificationTab } from "./NotificationCenter";
import styles from "../css-modules/NotificationCenter.module.css";

//import NotificationItem from "./NotificationItem";

interface Notification {
    id: number;
    date: string;
    time: string;
    type: string;
    project: string;
    message: string;
    read: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    notifications: Notification[];
    selectedRows: number[];
    onSelectAll: (checked: boolean) => void;
    onRowSelect: (id: number, checked: boolean) => void;
}

const EnvelopeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: 'middle' }}>
        <rect x="3" y="5" width="14" height="10" rx="2" stroke="#205493" strokeWidth="1.5" />
        <path d="M3.5 5.5L10 11L16.5 5.5" stroke="#205493" strokeWidth="1.5" />
    </svg>
);

const NotificationList: React.FC<NotificationListProps> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tab,
    notifications,
    selectedRows,
    onSelectAll,
    onRowSelect
}) => {
    return (
        <div style={{ background: '#fff', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <table className={styles.notificationTable} style={{ background: '#fff', width: '100%' }}>
                <thead style={{ background: '#fff' }}>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className={styles.checkboxShadow}
                                checked={
                                    notifications.length > 0 &&
                                    selectedRows.length === notifications.length
                                }
                                onChange={(e) => onSelectAll(e.target.checked)}
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
                    {notifications.map((n) => (
                        <tr key={n.id} className={n.read ? styles.readRow : styles.unreadRow} style={{ background: '#fff' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxShadow}
                                    checked={selectedRows.includes(n.id)}
                                    onChange={(e) => onRowSelect(n.id, e.target.checked)}
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
                    {notifications.length === 0 && (
                        <tr>
                            <td colSpan={7} className={styles.emptyState}>No notifications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationList;