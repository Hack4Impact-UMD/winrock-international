import React, { ReactNode, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../css-modules/PopupMenu.module.css';

interface PopupMenuProps {
    children: ReactNode;
    x: number;
    y: number;
    onClose: () => void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({ children, x, y, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle clicks outside the popup
        const handleOutsideClick = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleOutsideClick);

        // Clean up on unmount
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    return createPortal(
        <div
            ref={popupRef}
            className={styles.popupMenu}
            style={{ left: `${x}px`, top: `${y}px` }}
            onMouseDown={(e) => e.stopPropagation()}  // 🛑 BLOCK mousedown inside popup
        >
            {children}
        </div>,
        document.body
    );
};

export default PopupMenu;