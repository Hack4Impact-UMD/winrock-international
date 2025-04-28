import styles from "../css-modules/Divider.module.css";

interface DividerProps {
    label: string;
}

const Divider: React.FC<DividerProps> = ({ label }) => {
    return (
        <div className={styles.divider}>
            <span className={styles.dividerSpan}>
                {label}
            </span>
        </div>
    )
}

export default Divider;