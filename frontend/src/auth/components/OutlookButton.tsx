import outlookLogo from "../../assets/Outlook-logo.png"
import styles from "../css-modules/OutlookButton.module.css";

interface OutlookButtonProps {
    label: string;
    onClick: () => void;
}

function OutlookButton({ label, onClick }: OutlookButtonProps) {
    return (
        <button className={styles.outlookButton}>
            {label}
            <img
                src={outlookLogo}
                alt="Outlook icon"
                className={styles.outlookIcon}
                onClick={onClick}
            /> 
        </button>
    )
}

export default OutlookButton;