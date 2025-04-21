import {
    useMemo,
    useState
} from "react";
import { NotificationTab } from "./NotificationCenter";
import "../css-modules/NotificationList.module.css";

interface NotificationListProps {
    tab: NotificationTab;
}

const NotificationList: React.FC<NotificationListProps> = ({ tab }) => {
    const [ready, setReady] = useState(false);

    const notifications = useMemo(() => {
        setReady(false);

        if (tab === "unread") {

        } else if (tab === "read") {

        } else { // tab === "all"

        }

        setReady(true);
        return [];
    }, [tab]);

    if (!ready) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <>
            {notifications.map((notification) => {
                <>
                </>
            })}
        </>
    );
}

export default NotificationList;