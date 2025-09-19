import React, { useState } from 'react';
import styles from "../css-modules/ProjectViewHeader.module.css";
import ColorText from "../../winrock-dashboard/components/ColorText";
import { useNavigate } from 'react-router-dom';
import backArrow from "../assets/backArrow.svg"

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
    | 'Clarifying Technical Details'; // included to match possible values

interface ProjectViewHeaderProps {
    data: {
        id: string;
        projectName: string;
        supplierName: string;
        overallStatus: StatusType;
        analysisStage: AnalysisStageType;
        spendCategory: string;
        geography: string;
        lastUpdated: string;
        startDate: string;
    }
    setShowAccessManager: React.Dispatch<React.SetStateAction<boolean>>
}

const ProjectViewHeader: React.FC<ProjectViewHeaderProps> = ({ data, setShowAccessManager }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.viewContainer}>
            <div className={styles.backButtonContainer}>
                <button onClick={() => navigate('/dashboard/admin/projects')} className={styles.backButton}>
                    <img src={backArrow} alt="Back" className={styles.backArrowIcon} />
                </button>
            </div>
            <div className={styles.titleContainer}>

                <h1 className={styles.projectTitle}>{data.projectName}</h1>
                <div className={styles.btnContainer}>
                    <button
                        className={`${styles.button} ${isEditMode ? styles.active : ''}`}
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        {isEditMode ? 'Done' : 'Edit Project'}
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => { setShowAccessManager(true) }}
                    >
                        Share
                    </button>
                </div>
            </div>
            <thead className={styles.tableHeader}>
                <tr>
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
                <td className={styles.cell}>{data.supplierName}</td>
                <td className={styles.cell}>
                    <ColorText
                        text={data.overallStatus}
                        category={data.overallStatus}
                        variant="status"
                    />
                </td>
                <td className={styles.cell}>
                    <ColorText
                        text={data.analysisStage}
                        category={data.analysisStage}
                        variant="analysis"
                    />
                </td>
                {/* <td className={styles.cell}>{data.analysisStage}</td> */}
                <td className={styles.cell}>{data.spendCategory}</td>
                <td className={styles.cell}>{data.geography}</td>
                <td className={styles.cell}>{data.lastUpdated}</td>
                <td className={styles.cell}>{data.startDate}</td>
            </tr>
        </div>
    );
};

export default ProjectViewHeader;