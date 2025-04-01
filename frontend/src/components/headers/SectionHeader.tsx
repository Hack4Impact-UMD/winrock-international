import styles from "../../css-modules/SectionHeader.module.css";

interface SectionHeaderProps {
    label: string;
}

function SectionHeader({ label }: SectionHeaderProps) {
    return (
        <div className={styles.sectionHeader}>
            <p className={styles.label}>
                {label}
            </p>
        </div>
    )
}

export default SectionHeader;