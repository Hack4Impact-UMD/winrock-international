import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../css-modules/FileUploadModal.module.css";
import { CloudUpload } from "@mui/icons-material"
import { uploadProjectFile } from "../ProjectViewUtils";

interface FileUploadModalProps {
    onClose: () => void;
    projectId: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose, projectId }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileDragDropRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e : React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setIsDragging(false);
        // handle files
        await processFileUpload(files[0]);
    }

    const processFileUpload = async (file : File) => {
        console.log("Uploading file:", file.name);
        try {
            await uploadProjectFile(projectId, file.name, file);
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    }

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
                    <div className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ""}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                        <i><CloudUpload sx={{ fontSize: "5rem" }} /></i>
                        <span>Drag and drop file to upload</span>
                        <input ref={fileDragDropRef} type="file" className={styles.fileUploadInput} />
                    </div>
                </div>
                <div className={styles.separator}>or</div>
                <div className={styles.footer}>
                    {/* hidden file input */}
                    <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            console.log('browser upload');
                            await processFileUpload(e.target.files[0]);
                            e.target.value = "";
                        }
                    }} />
                    <button 
                        className={styles.browseButton} 
                        onClick={() => fileInputRef.current?.click()} 
                    >
                        Browser files
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FileUploadModal;