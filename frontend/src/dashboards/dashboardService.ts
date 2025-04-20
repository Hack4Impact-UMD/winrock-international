import { FirebaseError } from "firebase/app";
import * as firestore from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Result from "../types/Result";

enum OverallStatus {
    ON_TRACK = "On Track",
    AT_RISK = "At Risk",
    PAUSED = "Paused",
    COMPLETED = "Completed",
    COMPLETED_EXCEPT_RISK = "Completed (except for risk)"
}

enum AnalysisStage {
    STAGE_1 = "Stage 1: Clarifying Initial Project Information",
    STAGE_2 = "Stage 2: Clarifying Technical Details",
    STAGE_3 = "Stage 3: GHG Assessment Analysis",
    STAGE_4 = "Stage 4: Confirming Final Requirements",
    STAGE_5 = "Stage 5: Risk & Co-benefit Assessment",
    STAGE_6 = "Stage 6: Complete, and Excluded"
}

interface Project {
    projectName: string;
    supplierName: string;
    spendCategory: string;
    geography: string;
    overallStatus: OverallStatus;
    analysisStage: AnalysisStage;
    startDate: firestore.Timestamp;
    lastUpdated: firestore.Timestamp;
}

/**
 * Creates a project with the given fields into the
 * collection whose name matches the supplierName.
 * If no such collection exists, it will be created.
 * 
 * The projectName must be unique for the given supplier.
 * 
 * @returns a Promise<Result>.
 */
const createProject = async (
    projectName: string,
    supplierName: string,
    spendCategory: string,
    geography: string,
    overallStatus: OverallStatus = OverallStatus.ON_TRACK,
    analysisStage: AnalysisStage = AnalysisStage.STAGE_1,
    startDate?: firestore.Timestamp
): Promise<Result> => {
    try{
        const docRef = firestore.doc(db, `projects/supplier-name/${supplierName}`, projectName);
        const docSnap = await firestore.getDoc(docRef);
        if (docSnap.exists()) {
            return { success: false, errorCode: "project-name-already-exists"}
        }

        const now = firestore.Timestamp.now();
        const newProject: Project = {
            projectName,
            supplierName,
            spendCategory,
            geography,
            overallStatus,
            analysisStage,
            startDate: startDate ? startDate : now,
            lastUpdated: now
        };
        await firestore.setDoc(docRef, newProject);

        return { success: true, data: newProject };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

/**
 * Updates the given field of the given project
 * to newData.
 * 
 * @returns a Promise<Result>.
 */
const updateProjectField = async (
    projectName: string,
    supplierName: string,
    field: keyof Project,
    newData: any
): Promise<Result> => {
    try {
        const docRef = firestore.doc(db, `projects/supplier-name/${supplierName}/${projectName}`);
        const docSnap = await firestore.getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found"};
        }

        const updateData = {
            [field]: newData,
            lastUpdated: field === "lastUpdated" ? newData : firestore.Timestamp.now()
        };
        await firestore.updateDoc(docRef, updateData);

        return { success: true };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
};

/**
 * Deletes the given project.
 * 
 * @returns a Promise<Result>.
 */
const deleteProject = async (
    projectName: string,
    supplierName: string
): Promise<Result> => {
    try {
        const docRef = firestore.doc(db, `projects/supplier-name/${supplierName}/${projectName}`);

        const projectDoc = await firestore.getDoc(docRef);
        if (!projectDoc.exists) {
            return { success: false, errorCode: "project-not-found"};
        }

        await firestore.deleteDoc(docRef);

        return { success: true };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, errorCode: error.code };
        } else {
            return { success: false, errorCode: "unknown" };
        }
    }
}

export {
    type OverallStatus,
    type AnalysisStage,
    createProject,
    updateProjectField,
    deleteProject
};