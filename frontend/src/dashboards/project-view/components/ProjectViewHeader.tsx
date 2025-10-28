import React, { useState } from 'react';
import styles from "../css-modules/ProjectViewHeader.module.css";
import ColorText from "../../winrock-dashboard/components/ColorText";
import { useNavigate } from 'react-router-dom';
import backArrow from "../assets/backArrow.svg";
import RowCustomSelect from '../../winrock-dashboard/components/RowCustomSelect';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebaseConfig'

type StatusType =
    | 'On Track'
    | 'At Risk'
    | 'Paused'
    | 'Completed'
    | 'Completed (except for risk)';

type AnalysisStageType =
    | 'Risk & Co-benefit Assessment'
    | 'GHG Assessment Analysis'
    | 'Confirming Final Requirements'
    | 'Clarifying Initial Project Information'
    | 'Complete, and Excluded'
    | 'Clarifying Technical Details';

interface ProjectViewHeaderProps {
    data: {
        id: string;
        projectName: string;
        clientName: string;
        supplierName: string;
        overallStatus: StatusType;
        analysisStage: AnalysisStageType;
        spendCategory: string;
        geography: string;
        lastUpdated: string;
        startDate: string;
    };
    setShowAccessManager: React.Dispatch<React.SetStateAction<boolean>>;
}

const statusOptions: StatusType[] = [
    'On Track',
    'At Risk',
    'Paused',
    'Completed',
    'Completed (except for risk)'
];

const analysisStageOptions: AnalysisStageType[] = [
    'Risk & Co-benefit Assessment',
    'GHG Assessment Analysis',
    'Confirming Final Requirements',
    'Clarifying Technical Details',  // ← Add this line
    'Clarifying Initial Project Information',
    'Complete, and Excluded'
];
const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return 'Invalid Date';
    return parsed.toISOString().split('T')[0];
};

const ProjectViewHeader: React.FC<ProjectViewHeaderProps> = ({ data, setShowAccessManager }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableData, setEditableData] = useState({ ...data });
    const [currentData, setData] = useState(data); // Local state to reflect changes in the UI
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: string) => {
        const value = typeof e === 'string' ? e : e.target.value; // Handle string for RowCustomSelect
        setEditableData({ ...editableData, [field]: value });
    };

    const handleSave = async () => {
        try {
            console.log("Saving updated data:", editableData);

            // Reference to the Firestore document for the project
            const projectDocRef = doc(db, "projects", editableData.id);

            // Update the Firestore document with the new data
            await updateDoc(projectDocRef, {
                spendCategory: editableData.spendCategory,
                geography: editableData.geography,
                projectName: editableData.projectName,
                supplierName: editableData.supplierName,
                analysisStage: editableData.analysisStage,
                overallStatus: editableData.overallStatus,
                clientName: editableData.clientName,
                // Add other fields as needed
            });

            console.log("Project updated successfully in Firestore");

            // Optionally, update the `data` state to reflect the changes in the UI
            setData(editableData);

            // Exit edit mode
            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving updated project data:", error);
        }
    };

    return (
        <div className={styles.viewContainer}>
            <div className={styles.backButtonContainer}>
                <button onClick={() => navigate('/dashboard/admin/projects')} className={styles.backButton}>
                    <img src={backArrow} alt="Back" className={styles.backArrow} />
                </button>
            </div>
            <div className={styles.titleContainer}>
                {isEditMode ? (
                    <input
                        type="text"
                        value={editableData.projectName}
                        onChange={(e) => handleInputChange(e, 'projectName')}
                        className={styles.editableTitle}
                    />
                ) : (
                    <h1 className={styles.projectTitle}>{currentData.projectName}</h1>
                )}
                <div className={styles.btnContainer}>
                    <button
                        className={`${styles.button} ${isEditMode ? styles.active : ''}`}
                        onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
                    >
                        {isEditMode ? 'Done' : 'Edit Project'}
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => { setShowAccessManager(true); }}
                    >
                        Share
                    </button>
                </div>
            </div>
            <thead className={styles.tableHeader}>
                <tr>
                    <th className={styles.headerCell}>Client</th>
                    <th className={styles.headerCell}>Supplier</th>
                    <th className={styles.headerCell}>Overall Status</th>
                    <th className={styles.headerCell}>Analysis stage</th>
                    <th className={styles.headerCell}>Spend Category</th>
                    <th className={styles.headerCell}>Geography</th>
                    <th className={styles.headerCell}>Last Updated</th>
                    <th className={styles.headerCell}>Start Date</th>
                </tr>
            </thead>

            <tr className={styles.tableRow}>
                <td className={styles.cell}>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={editableData.clientName}
                            onChange={(e) => handleInputChange(e, 'clientName')}
                            className={styles.editableInput}
                        />
                    ) : (
                        currentData.clientName
                    )}
                </td>
                <td className={styles.cell}>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={editableData.supplierName}
                            onChange={(e) => handleInputChange(e, 'supplierName')}
                            className={styles.editableInput}
                        />
                    ) : (
                        currentData.supplierName
                    )}
                </td>
                <td className={styles.cell}>
                    <div className={styles.dropdown}>
                        {isEditMode ? (
                            <RowCustomSelect
                                value={editableData.overallStatus}
                                options={statusOptions}
                                onChange={(e) => handleInputChange(e, 'overallStatus')}
                                variant="status"
                            />
                        ) : (
                            <ColorText
                                text={currentData.overallStatus}
                                category={currentData.overallStatus}
                                variant="status"
                            />
                        )}
                    </div>
                </td>
                <td className={styles.cell}>
                    <div className={styles.dropdown}>
                        {isEditMode ? (
                            <RowCustomSelect
                                value={editableData.analysisStage}
                                options={analysisStageOptions}
                                onChange={(e) => handleInputChange(e, 'analysisStage')}
                                variant="analysis"
                            />
                        ) : (
                            <ColorText
                                text={currentData.analysisStage}
                                category={currentData.analysisStage}
                                variant="analysis"
                            />
                        )}
                    </div>
                </td>
                <td className={styles.cell}>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={editableData.spendCategory}
                            onChange={(e) => handleInputChange(e, 'spendCategory')}
                            className={styles.editableInput}
                        />
                    ) : (
                        currentData.spendCategory
                    )}
                </td>
                <td className={styles.cell}>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={editableData.geography}
                            onChange={(e) => handleInputChange(e, 'geography')}
                            className={styles.editableInput}
                        />
                    ) : (
                        currentData.geography
                    )}
                </td>
                <td className={styles.cell}>
                    {formatDate(currentData.lastUpdated)}
                </td>
                <td className={styles.cell}>
                    {formatDate(currentData.startDate)}
                </td>
            </tr>
        </div>
    );
};

export default ProjectViewHeader;