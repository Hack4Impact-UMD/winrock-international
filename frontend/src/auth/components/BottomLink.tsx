import styles from "../css-modules/BottomLink.module.css";

interface BottomLinkProps {
    beforeText?: string;
    actionLabel: string;
    onClick: () => void;
}

const BottomLink: React.FC<BottomLinkProps> = ({ beforeText, actionLabel, onClick }) => {
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

export default BottomLink;