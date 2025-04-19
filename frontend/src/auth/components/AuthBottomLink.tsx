import { Link } from "react-router-dom";
import styles from "../css-modules/AuthBottomLink.module.css";

interface AuthBottomLinkProps {
    beforeText?: string;
    linkLabel: string;
    link: string;
}

function AuthBottomLink({ beforeText, linkLabel, link }: AuthBottomLinkProps) {
    return (
        <div className={styles.bottomLinkContainer}>
            <p className={styles.beforeText}>
                {beforeText}
            </p>
            <Link to={link} className={styles.link}>
                {linkLabel}
            </Link>
        </div>
    )
}

export default AuthBottomLink;