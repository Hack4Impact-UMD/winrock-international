import styles from "../css-modules/AuthLogoHeader.module.css";
import logo from "../../assets/winrock-international-logo.png";

function AuthLogoHeader() {
    return (
        <header className={styles.header}>
            <img
                src={logo}
                alt="Winrock International"
                className={styles.logo}
            />
        </header>
    )
}

export default AuthLogoHeader;