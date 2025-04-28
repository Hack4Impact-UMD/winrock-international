import backArrow from "../../assets/arrow-left.png";
import styles from "../css-modules/BackButton.module.css";

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <div onClick={onClick}>
            <img
                src={backArrow}
                alt="Back"
                className={styles.backIcon}
            />
        </div>
    )
}

export default BackButton;