import { useState, useEffect } from "react";

import styles from "../css-modules/Popup.module.css";
import closeBtn from "../../assets/x-close-delete-svgrepo-com.svg";
import infoBtn from "../../assets/info-svgrepo-com.svg";


interface PopupProps {
    guidance: string,
    example: string
}

const Popup = ({ guidance, example }: PopupProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <>
            <img
                src={infoBtn}
                className={styles.infoBtn}
                onClick={openPopup}
            />

            {isOpen && (
                <div className={styles.overlay}>
                    <div className={styles.popupContainer}>
                        <img
                            src={closeBtn}
                            className={styles.closeBtn}
                            onClick={closePopup}
                        />
                        <div className={styles.textContainer}>
                            <h3 className={styles.label}>Guidance</h3>
                            <p>{guidance}</p>
                        </div>
                        <div className={styles.textContainer}>
                            <h3 className={styles.label}>Example</h3>
                            <p>{example}</p>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}

export default Popup;