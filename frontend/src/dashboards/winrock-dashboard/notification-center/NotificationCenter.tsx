import {
    useState
} from "react";
import "../css-modules/NotificationCenter.module.css";

import NotificationList from "./NotificationList";

type NotificationTab =
    | "unread"
    | "read"
    | "all";

const NotificationCenter: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<NotificationTab>("unread");

    return (
        <>
            <p>
                Notification Center
            </p>

            <NotificationList tab={selectedTab} />
        </>
    );
}

export default NotificationCenter;