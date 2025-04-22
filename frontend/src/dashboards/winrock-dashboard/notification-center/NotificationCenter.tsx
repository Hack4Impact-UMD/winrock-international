import {
    useState
} from "react";
import styles from "../css-modules/NotificationCenter.module.css";

import NotificationList from "./NotificationList";

type NotificationTab =
    | "unread"
    | "read"
    | "all";

const NotificationCenter: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<NotificationTab>("unread");

    return (
        <section className={styles.notificationCenter}>
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
export { type NotificationTab };