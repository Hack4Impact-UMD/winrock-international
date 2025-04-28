import styles from "../../css-modules/LogoHeader.module.css";
import logo from "../../../assets/winrock-international-logo.png";

function LogoHeader() {
    return (
        <div className={styles.logoHeader}>
            <img className={styles.logo} src={logo} alt="Winrock International" />
        </div>
    )
}

export default LogoHeader;