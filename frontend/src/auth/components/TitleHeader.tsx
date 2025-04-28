import styles from "../css-modules/TitleHeader.module.css";

interface TitleHeaderProps {
    title: string;
    subtitle?: string;
    textAlign?: "left" | "center";
    subtitleColor?: "black" | "gray";
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, subtitle, textAlign = "center", subtitleColor = "black"}) => {
    return (
        <div
            className={styles.titleContainer}
            style={{textAlign}}
        >
            <p
                className={styles.title}
                style={{justifyContent: textAlign}}
            >
                {title}
            </p>
            <p
                className={styles.subtitle}
                style={subtitleColor === "gray" ? {color: "var(--color-gray)"} : {}}
            >
                {subtitle}
            </p>
        </div>
    )
}

export default TitleHeader;