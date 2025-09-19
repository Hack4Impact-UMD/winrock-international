import { runTransaction } from "firebase/firestore";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
    serverTimestamp,
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
    STAGE_1 = "Clarifying Initial Project Information",
    STAGE_2 = "Clarifying Technical Details",
    STAGE_3 = "GHG Assessment Analysis",
    STAGE_4 = "Confirming Final Requirements",
    STAGE_5 = "Risk & Co-benefit Assessment",
    STAGE_6 = "Complete, and Excluded",
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
    activityType: ActivityType,
    overallStatus: OverallStatus = OverallStatus.ON_TRACK,
    analysisStage: AnalysisStage = AnalysisStage.STAGE_1,
    startDate?: Date,
    isActive: boolean = true,
    isPinned: boolean = false
): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);

        await runTransaction(db, async (tx) => {
            const snap = await tx.get(docRef);
            if (snap.exists()) {
                throw new Error("project-name-already-exists");
            }

            const newProject: Project = {
                projectName,
                supplierName,
                spendCategory,
                geography,
                overallStatus,
                analysisStage: analysisStage,
                startDate: startDate ? Timestamp.fromDate(startDate) : serverTimestamp() as any,
                lastUpdated: serverTimestamp() as any,
                isActive,
                isPinned,
                id: docRef.id,
                activityType,
            };

            tx.set(docRef, newProject);
        });

        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};
function mapDocToProject(d: any): Project {
    return {
        ...d,
        startDate: d.startDate instanceof Timestamp ? d.startDate.toDate().toISOString() : d.startDate,
        lastUpdated: d.lastUpdated instanceof Timestamp ? d.lastUpdated.toDate().toISOString() : d.lastUpdated,
    };
}

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

        const projectData = mapDocToProject(docSnap.data());
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
                if (value.length === 0) {
                    return; // skip this filter
                }
                if (value.length > 10) {
                    throw new Error("Firestore 'in' supports 1–10 values");
                }
                filterQuery = query(filterQuery, where(field as string, "in", value));
            } else {
                filterQuery = query(filterQuery, where(field as string, "==", value));
            }
        });

        if (startDate) {
            filterQuery = query(filterQuery, where("startDate", ">=", Timestamp.fromDate(startDate)));
        }
        if (endDate) {
            filterQuery = query(filterQuery, where("startDate", "<=", Timestamp.fromDate(endDate)));
        }

        if (startDate || endDate) {
            filterQuery = query(filterQuery, orderBy("startDate", desc ? "desc" : "asc"));
            if (orderByField !== "startDate") {
                filterQuery = query(filterQuery, orderBy(orderByField as string, desc ? "desc" : "asc"));
            }
        } else {
            filterQuery = query(filterQuery, orderBy(orderByField as string, desc ? "desc" : "asc"));
        }


        const querySnapshot = await getDocs(filterQuery);
        querySnapshot.forEach((docSnap) => {
            const project = mapDocToProject(docSnap.data());
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
    if (field === "projectName" || field === "id") {
        return { success: false, errorCode: "field-not-editable" };
    }
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
