import {
    useState
} from "react";
import { NotificationStatus } from "./notificationService";
import styles from "../css-modules/NotificationCenter.module.css";

import NotificationList from "./NotificationList";
import Sidebar from "../components/Sidebar";

const NotificationCenter: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<NotificationStatus | "all">("unread");

    return (
        <section className={styles.notificationCenter}>
            <Sidebar currentTab="notification-center" />

            <div className={styles.tabContainer}>
                <p
                    className={`${styles.tab} ${selectedTab==="unread" ? "selected" : ""}`}
                    onClick={() => setSelectedTab("unread")}
                >
                    Unread
                </p>
                <p
                    className={`${styles.tab} ${selectedTab==="read" ? "selected" : ""}`}
                    onClick={() => setSelectedTab("read")}
                >
                    Read
                </p>
                <p
                    className={`${styles.tab} ${selectedTab==="all" ? "selected" : ""}`}
                    onClick={() => setSelectedTab("all")}
                >
                    All
                </p>
            </div>

            <h1 className={styles.header}>
                Notification Center
            </h1>

            <NotificationList tab={selectedTab} />
        </section>
    );
}

export default NotificationCenter;