import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "../css-modules/AddFileLinkModal.module.css";
import { addFileLink } from "../ProjectViewUtils";

interface AddFileLinkModalProps {
    onClose: () => void;
    projectId: string;
    onFileAdded?: () => void;
}

const AddFileLinkModal: React.FC<AddFileLinkModalProps> = ({ onClose, projectId, onFileAdded }) => {
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValidUrl = (url: string): boolean => {
        const trimmedUrl = url.trim();
        
        // First check if it starts with http:// or https://
        const lowerUrl = trimmedUrl.toLowerCase();
        if (!lowerUrl.startsWith("http://") && !lowerUrl.startsWith("https://")) {
            return false;
        }
        
        // Then validate the entire URL structure using URL constructor
        try {
            new URL(trimmedUrl);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fileName.trim()) {
            setError("File Name is required");
            return;
        }
        
        const trimmedLink = fileLink.trim();
        if (!trimmedLink) {
            setError("SharePoint Link is required");
            return;
        }

        if (!isValidUrl(trimmedLink)) {
            setError("Please enter a valid URL starting with http:// or https://");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const result = await addFileLink(projectId, fileName.trim(), trimmedLink);
            if (result.success) {
                onFileAdded?.();
                onClose();
            } else {
                setError(result.errorCode || "Failed to add file link");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error("Error adding file link:", err);
        } finally {
            setIsUploading(false);
        }
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modalContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>Add File Link</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldContainer}>
                        <label htmlFor="fileName" className={styles.label}>
                            File Name
                        </label>
                        <input
                            id="fileName"
                            type="text"
                            className={styles.input}
                            value={fileName}
                            onChange={(e) => {
                                setFileName(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="Enter file name"
                            disabled={isUploading}
                        />
                    </div>

                    <div className={styles.fieldContainer}>
                        <label htmlFor="fileLink" className={styles.label}>
                            SharePoint Link
                        </label>
                        <input
                            id="fileLink"
                            type="url"
                            className={styles.input}
                            value={fileLink}
                            onChange={(e) => {
                                setFileLink(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="Enter SharePoint link"
                            disabled={isUploading}
                        />
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.uploadButton}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddFileLinkModal;


