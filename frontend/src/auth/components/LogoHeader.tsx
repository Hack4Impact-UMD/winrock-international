import winrockLogo from "../../assets/winrock-international-logo.png";
import styles from "../css-modules/LogoHeader.module.css";

const LogoHeader: React.FC = () => {
    return (
        <header className={styles.header}>
            <img
                src={winrockLogo}
                alt="Winrock International"
                className={styles.logo}
            />
        </header>
    )
}

export default LogoHeader;