import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import Result, { handleFirebaseError } from "../../../types/Result.js";
import { Project } from "types/Project.ts";

/**
 * Represents the overall status of a project.
 */
export enum OverallStatus {
    ON_TRACK = "On Track",
    AT_RISK = "At Risk",
    PAUSED = "Paused",
    COMPLETED = "Completed",
    COMPLETED_EXCEPT_RISK = "Completed (except for risk)",
}

/**
 * Represents the stage of analysis the project is currently in.
 */
export enum AnalysisStage {
    STAGE_1 = "Stage 1: Clarifying Initial Project Information",
    STAGE_2 = "Stage 2: Clarifying Technical Details",
    STAGE_3 = "Stage 3: GHG Assessment Analysis",
    STAGE_4 = "Stage 4: Confirming Final Requirements",
    STAGE_5 = "Stage 5: Risk & Co-benefit Assessment",
    STAGE_6 = "Stage 6: Complete, and Excluded",
}

type ActivityType =
    | "Renewable Energy and Energy Efficiency"
    | "Agriculture"
    | "Agroforestry"
    | "Animal Agriculture and Manure Management";


/**
 * Saves a project into Firestore.
 */
const createProject = async (
    projectName: string,
    supplierName: string,
    spendCategory: string,
    geography: string,
    activityType: ActivityType, // Add this parameter
    overallStatus: OverallStatus = OverallStatus.ON_TRACK,
    analysisStage: AnalysisStage = AnalysisStage.STAGE_1,
    startDate?: Date,
    isActive: boolean = true,
    isPinned: boolean = false
): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: false, errorCode: "project-name-already-exists" };
        }

        const now = Timestamp.now();
        const newProject: Project = {
            projectName,
            supplierName,
            spendCategory,
            geography,
            overallStatus,
            analysisStage: analysisStage as any,
            startDate: (startDate ? Timestamp.fromDate(startDate) : now) as any,
            lastUpdated: now as any,
            isActive,
            isPinned,
            id: projectName,
            activityType, // Use the parameter
        };
        await setDoc(docRef, newProject);

        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Retrieves a project by name.
 */
const getProjectByName = async (projectName: string): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        const projectData = docSnap.data() as Project;
        return {
            success: true,
            data: projectData,
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Retrieves all projects (with names).
 */
const getAllProjects = async (
    orderByField: keyof Project,
    desc: boolean
): Promise<Result> => {
    return getProjectsWithFilters(orderByField, desc, [], []);
};

/**
 * Retrieves projects with filters.
 */
const getProjectsWithFilters = async (
    orderByField: keyof Project,
    desc: boolean,
    filterFields: (keyof Project)[],
    filterValues: any[],
    startDate?: Date,
    endDate?: Date
): Promise<Result> => {
    const projects: Project[] = [];
    const projectNames: string[] = [];

    try {
        let filterQuery = query(collection(db, "projects"));

        filterFields.forEach((field, index) => {
            const value = filterValues[index];
            if (Array.isArray(value)) {
                filterQuery = query(filterQuery, where(field as string, "in", value));
            } else {
                filterQuery = query(filterQuery, where(field as string, "==", value));
            }
        });

        if (startDate)
            filterQuery = query(
                filterQuery,
                where("startDate", ">=", Timestamp.fromDate(startDate))
            );
        if (endDate)
            filterQuery = query(
                filterQuery,
                where("startDate", "<=", Timestamp.fromDate(endDate))
            );

        filterQuery = query(
            filterQuery,
            orderBy(orderByField as string, desc ? "desc" : "asc")
        );

        const querySnapshot = await getDocs(filterQuery);
        querySnapshot.forEach((docSnap) => {
            const project = docSnap.data() as Project;
            projects.push(project);
            projectNames.push(project.projectName);
        });

        return {
            success: true,
            data: { projects, projectNames },
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Updates a single field of a project.
 */
const updateProjectField = async (
    projectName: string,
    field: keyof Project,
    newValue: any
): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        if (newValue instanceof Date) {
            newValue = Timestamp.fromDate(newValue);
        }

        const updateData: Partial<Project> & { lastUpdated: Timestamp } = {
            [field]: newValue,
            lastUpdated: field === "lastUpdated" ? newValue : Timestamp.now(),
        } as any;

        await updateDoc(docRef, updateData);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Deletes a project by name.
 */
const deleteProject = async (projectName: string): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

export {
    createProject,
    getProjectByName,
    getAllProjects,
    getProjectsWithFilters,
    updateProjectField,
    deleteProject,
};
