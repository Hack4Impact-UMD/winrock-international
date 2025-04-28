import styles from "../css-modules/NotificationItem.module.css";

interface NotificationItemProps {
    date: string;
    time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({date, time}) => {
    return (
        <section className={styles.notificationItem}>
            <div>
                {date}
            </div>
            <div>
                {time}
            </div>
        </section>
    );
}

export default NotificationItem;