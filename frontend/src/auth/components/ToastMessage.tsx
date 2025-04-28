import alertIcon from "../../assets/alert-icon.png";
import styles from "../css-modules/ToastMessage.module.css";

interface ToastMessageProps {
    message: string;
    isError?: boolean;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, isError=false }) => {
    return (
        <div className={styles.messageCard}>
            <p className={styles.message}>
                {message}
            </p>
            {isError &&
                <img
                    src={alertIcon}
                    alt=""
                    className={styles.alertIcon}
                />}
            
        </div>
    )
}

export default ToastMessage;