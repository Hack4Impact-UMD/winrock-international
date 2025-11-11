import React, { useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../css-modules/MarkStageModal.module.css";
import { markStageAsComplete } from "../ProjectViewUtils";

interface ProjectModalProps {
    onClose: () => void;
    projectId: string;
    currentStage: string;
    onStageAdvanced?: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, projectId, currentStage, onStageAdvanced }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    return createPortal(
        <div className={styles.overlay}>
            <div
                ref={popupRef}
                className={styles.modalContainer}
                onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className={styles.header}>
                    <button onClick={onClose} className={styles.closeButton}>
                        &times;
                    </button>
                </div>
                <div className={styles.content}>
                    <h2>Are you sure you want to Mark Stage as Complete?</h2>
                    <span>This action cannot be reversed and this stage cannot be revisited.</span>
                </div>
                <div className={styles.footer}>
                    <div className={styles.buttonContainer}>
                        <button 
                            className={styles.cancelButton} 
                            onClick={() => {
                                onClose();
                            }} 
                        >
                            Cancel
                        </button>
                        <button 
                            className={styles.completeButton} 
                            onClick={async () => {
                                const result = await markStageAsComplete(projectId, currentStage);
                                if (result.success) {
                                    // Refresh project data after successfully advancing stage
                                    if (onStageAdvanced) {
                                        onStageAdvanced();
                                    }
                                    onClose();
                                } else {
                                    console.error("Failed to advance stage:", result.errorCode);
                                    // Optionally show error message to user
                                    // Keep modal open on error so user can try again
                                }
                            }} 
                        >
                            Mark Stage as complete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectModal;