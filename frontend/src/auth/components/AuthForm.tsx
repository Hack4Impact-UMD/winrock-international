import { useState, useMemo, JSX } from "react";
import backArrow from "../../assets/arrow-left.png";
import styles from "../css-modules/AuthForm.module.css";

interface AuthFormProps {
    title?: string;
    subtitle?: string;
    titleStyle?: number;
    onBack?: () => void;
    nextLabel?: string;
    onNext?: () => void;

    children?: JSX.Element;
    afterChild?: JSX.Element;

    // The spacing proportions that each element should take up in rem
    // Length should be equal to (# of elements in the form) + 1 for ending space
    remSpacing: number[];
}

function AuthForm({ title, subtitle, titleStyle=1, onBack, nextLabel, onNext, children, afterChild, remSpacing }: AuthFormProps) {
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    // Used to offset gridTemplateRows calculations for the children
    const countBeforeChildren = (title ? 1 : 0);
    const countAfterChildren = ((nextLabel && onNext) ? 1 : 0) + (afterChild ? 1 : 0);
    const childrenSpacing = remSpacing.slice(countBeforeChildren, remSpacing.length - countAfterChildren);

    // Compute the gridTemplateRows CSS property for the form container once
    const formGridTemplateRows = useMemo(() => {
        return `${onBack ? '0rem' : ''}
            ${(countBeforeChildren > 0) ? `${remSpacing[0]}rem` : ''}
            ${childrenSpacing.reduce((sum, curr) => sum + curr, 0)}rem
            ${(countAfterChildren > 1) ? `${remSpacing[remSpacing.length - 3]}rem` : ''}
            ${(countAfterChildren > 0) ? `${remSpacing[remSpacing.length - 2]}rem` : ''}
            ${remSpacing[remSpacing.length - 1]}rem`;
    }, [children]);
    
    // Compute the gridTemplateRows CSS property for the children container once
    const childrenGridTemplateRows = useMemo(() => {
        return childrenSpacing
            .map((remSpace) => `${remSpace}rem`)
            .join(' ');
    }, [children]);

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.formContainer}
                style={{gridTemplateRows: formGridTemplateRows}}
            >
                {onBack &&
                    <div onClick={onBack}>
                        <img
                            src={backArrow}
                            alt="Back"
                            className={styles.backIcon}
                        />
                    </div>}

                {title &&
                    <div
                        className={styles.titleContainer}
                        style={titleStyle === 1 ? {textAlign: "center"} : {}}
                    >
                        <p className={styles.title}>
                            {title}
                        </p>
                        {subtitle &&
                            <p
                                className={styles.subtitle}
                                style={titleStyle === 2 ? {color: "var(--color-gray)"} : {}}
                            >
                                {subtitle}
                            </p>}
                    </div>}

                <div
                    className={styles.childrenContainer}
                    style={{gridTemplateRows: childrenGridTemplateRows}}
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