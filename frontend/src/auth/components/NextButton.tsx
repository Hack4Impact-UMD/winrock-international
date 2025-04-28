import { useState } from "react";
import styles from "../css-modules/NextButton.module.css";

interface NextButtonProps {
    label: string;
    onClick: (() => Promise<void>) | (() => void);
}

const NextButton: React.FC<NextButtonProps> = ({ label, onClick }) => {
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    return (
        <button
            className={styles.nextButton}
            disabled={buttonIsDisabled}
            onClick={async () => {
                setButtonIsDisabled(true);
                await onClick();
                setButtonIsDisabled(false);
            }}
        >
            <p className={styles.label}>
                {label}
            </p>
        </button>
    )
}

export default NextButton;