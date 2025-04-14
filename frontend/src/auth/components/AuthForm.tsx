import { useState, JSX } from "react";
import { Link } from "react-router-dom";
import backArrow from "../../assets/arrow-left.svg";
import styles from "../css-modules/AuthForm.module.css";

interface AuthFormProps {
    title?: string;
    subtitle?: string;
    backLink?: string;
    nextLabel?: string;
    onNext?: () => void;

    beforeChildren?: JSX.Element;
    children?: JSX.Element;
    afterChildren?: JSX.Element;
}

function AuthForm({ title, subtitle, backLink, nextLabel, onNext, beforeChildren, children, afterChildren }: AuthFormProps) {
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formContainer}>
                {backLink &&
                    <Link to={backLink}>
                        <img
                            src={backArrow}
                            alt="Back"
                            className={styles.backIcon}
                        />
                    </Link>}
                    
                {beforeChildren}

                {title &&
                    <div className={styles.titleContainer}>
                        <p className={styles.title}>
                            {title}
                        </p>
                        {subtitle &&
                            <p className={styles.subtitle}>
                                {subtitle}
                            </p>}
                    </div>}

                {children}

                {onNext &&
                    <button
                        className={styles.nextButton}
                        disabled={buttonIsDisabled}
                        onClick={async () => {
                            setButtonIsDisabled(true);
                            await onNext();
                            setButtonIsDisabled(false);
                        }}
                    >
                        <p className={styles.nextLabel}>
                            {nextLabel}
                        </p>
                    </button>}

                {afterChildren}
            </div>
        </div>
    )
}

export default AuthForm;