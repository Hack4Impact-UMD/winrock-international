import { useState, useRef, JSX } from "react";
import { Link } from "react-router-dom";
import backArrow from "../../assets/arrow-left.svg";
import styles from "../css-modules/AuthForm.module.css";

interface AuthFormProps {
    title?: string;
    subtitle?: string;
    backLink?: string;
    nextLabel?: string;
    onNext?: () => void;

    children?: JSX.Element;
    afterChild?: JSX.Element;

    // The spacing proportions that each element should take up in rem
    // Length should be equal to the # of elements in the form
    remSpacing: number[];
}

function AuthForm({ title, subtitle, backLink, nextLabel, onNext, children, afterChild, remSpacing }: AuthFormProps) {
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    // Used to offset gridTemplateRows calculations for the children
    const countBeforeChildren = (title ? 1 : 0) + (subtitle ? 1 : 0);
    const countAfterChildren = ((nextLabel && onNext) ? 1 : 0) + (afterChild ? 1 : 0);
    const childrenSpacing = remSpacing.slice(countBeforeChildren, remSpacing.length - countAfterChildren + 1);

    // Compute the gridTemplateRows CSS property for the form container once
    const formGridTemplateRows = useRef(
        `${(countBeforeChildren > 0) ? `${remSpacing[0]}rem` : ''}
        ${(countBeforeChildren > 1) ? `${remSpacing[1]}rem` : ''}
        ${childrenSpacing.reduce((sum, curr) => sum + curr, 0)}rem
        ${(countAfterChildren > 1) ? `${remSpacing[remSpacing.length - 2]}rem` : ''}
        ${(countAfterChildren > 0) ? `${remSpacing[remSpacing.length - 1]}rem` : ''}`
    );
    
    // Compute the gridTemplateRows CSS property for the children container once
    const childrenGridTemplateRows = useRef(
        childrenSpacing
            .map((remSpace) => `${remSpace}rem`)
            .join(' ')
    );

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.formContainer}
                style={{gridTemplateRows: formGridTemplateRows.current}}
            >
                {backLink &&
                    <Link to={backLink}>
                        <img
                            src={backArrow}
                            alt="Back"
                            className={styles.backIcon}
                        />
                    </Link>}

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

                <div
                    className={styles.childrenContainer}
                    style={{gridTemplateRows: childrenGridTemplateRows.current}}
                >
                    {children}
                </div>

                {nextLabel && onNext &&
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

                {afterChild}
            </div>
        </div>
    )
}

export default AuthForm;