import { Link } from "react-router-dom";
import styles from "../css-modules/AuthBottomLink.module.css";

interface AuthBottomLinkProps {
    beforeText?: string;
    actionLabel: string;
    onClick: () => void;
}

function AuthBottomLink({ beforeText, actionLabel, onClick }: AuthBottomLinkProps) {
    return (
        <div className={styles.bottomLinkContainer}>
            <p className={styles.beforeText}>
                {beforeText}
            </p>
            <p className={styles.link} onClick={onClick}>
                {actionLabel}
            </p>
        </div>
    )
}

export default AuthBottomLink;