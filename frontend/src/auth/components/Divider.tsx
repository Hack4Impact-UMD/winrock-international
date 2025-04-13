import styles from "../css-modules/Divider.module.css";

interface DividerProps {
    label: string;
}

function Divider({ label }: DividerProps) {
    return (
        <div className={styles.divider}>
            <span className={styles.dividerSpan}>
                {label}
            </span>
        </div>
    )
}

export default Divider;