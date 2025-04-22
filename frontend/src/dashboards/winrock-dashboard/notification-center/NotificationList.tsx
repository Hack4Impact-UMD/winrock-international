import {
    useEffect,
    useState,
    useTransition
} from "react";
import { NotificationTab } from "./NotificationCenter";
import "../css-modules/NotificationList.module.css";

import NotificationItem from "./NotificationItem";

interface NotificationListProps {
    tab: NotificationTab;
}

function useNotifications(tab: NotificationTab) {
    const [notifications, setNotifications] = useState([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            if (tab === "unread") {
                setNotifications([]);
            } else if (tab === "read") {
                setNotifications([]);
            } else { // tab === "all"
                setNotifications([]);
            }
        });
    }, [tab]);

    return { notifications, isPending };
}

const NotificationList: React.FC<NotificationListProps> = ({ tab }) => {
    const { notifications, isPending } = useNotifications(tab);

    return (
        <>
            {notifications.map((notification) => {
                <NotificationItem
                    date={""}
                    time={""}
                />
            })}

            {isPending &&
                <div>
                    Loading...
                </div>}
        </>
    );
}

export default NotificationList;