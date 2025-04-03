import styles from "../../css-modules/SectionHeader.module.css";

interface SectionHeaderProps {
    label: string;
    description?: string;
}

function SectionHeader({ label, description }: SectionHeaderProps) {
    return (
        <div className={styles.sectionHeaderContainer}>
            <div className={styles.sectionHeader}>
                <p className={styles.label}>
                    {label}
                </p>
            </div>

            {description &&
                <p className={styles.description}>
                    {description}
                </p>}
        </div>
    )
}

export default SectionHeader;