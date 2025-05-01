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
    where
} from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import Result, { handleFirebaseError } from "../../../types/Result.js";

/**
 * Represents the overall status of a project.
 */
enum OverallStatus {
    ON_TRACK = "On Track",
    AT_RISK = "At Risk",
    PAUSED = "Paused",
    COMPLETED = "Completed",
    COMPLETED_EXCEPT_RISK = "Completed (except for risk)"
}

/**
 * Represents the stage of analysis the project is currently in.
 */
enum AnalysisStage {
    STAGE_1 = "Stage 1: Clarifying Initial Project Information",
    STAGE_2 = "Stage 2: Clarifying Technical Details",
    STAGE_3 = "Stage 3: GHG Assessment Analysis",
    STAGE_4 = "Stage 4: Confirming Final Requirements",
    STAGE_5 = "Stage 5: Risk & Co-benefit Assessment",
    STAGE_6 = "Stage 6: Complete, and Excluded"
}

/**
 * Represents a project stored in the database.
 */
interface Project {
    projectName: string;
    supplierName: string;
    spendCategory: string;
    geography: string;

    overallStatus: OverallStatus;
    analysisStage: AnalysisStage;

    startDate: Timestamp; // Received and sent as a Date
    lastUpdated: Timestamp; // Received and sent as a Date

    isActive: boolean; // True if the project is active, false if it is archived
    isPinned: boolean; // True if the project is pinned, false if it is unpinned
}

/**
 * Saves a project with the given fields into the database.
 * 
 * @param {string} projectName - Must be unique across all projects.
 * @param {string} supplierName
 * @param {string} spendCategory
 * @param {string} geography
 * @param {OverallStatus} overallStatus - Defaults to ON_TRACK, but can optionally be set.
 * @param {AnalysisStage} analysisStage - Defaults to STAGE_1, but can optionally be set.
 * @param {Date} startDate - Defaults to the current date, but can optionally be set.
 * @param {isActive} isActive - Defaults to true, but can optionally be set.
 * @param {isPinned} isPinned - Defaults to false, but can optionally be set.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const createProject = async (
    projectName: string,
    supplierName: string,
    spendCategory: string,
    geography: string,
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
            return { success: false, errorCode: "project-name-already-exists" }
        }

        const now = Timestamp.now();
        const newProject: Project = {
            projectName,
            supplierName,
            spendCategory,
            geography,
            overallStatus,
            analysisStage,
            startDate: startDate ? Timestamp.fromDate(startDate) : now,
            lastUpdated: now,
            isActive,
            isPinned
        };
        await setDoc(docRef, newProject);

        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Retrieves the project with the given name. If the project does not exist, an error is returned.
 * 
 * @param {string} projectName - The name of the project to retrieve.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: project }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getProjectByName = async (projectName: string): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        const projectData = docSnap.data();
        const project = {
            ...projectData,
            startDate: projectData.startDate.toDate(),
            lastUpdated: projectData.lastUpdated.toDate()
        } as Project;

        return {
            success: true,
            data: project
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Retrieves all projects (along with a list of their names) from Firestore.
 * 
 * @param orderByField - The name of a field by which to order the results.
 * @param desc - Whether to order the results in descending order.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: { projects: Project[], projectNames: string[] } }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getAllProjects = async (orderByField: string, desc: boolean): Promise<Result> => {
    return getProjectsWithFilters(orderByField, desc, [], []);
}

/**
 * Retrieves a list of projects (along with a list of their names) from Firestore that match
 * the specified ordering criteria, filters, and optional date range.
 *
 * @param {string} orderByField - The name of a single field by which to order the results.
 * @param {boolean} desc - Whether to order the results in descending order.
 * @param {string[]} filterFields - An array of field names to apply filters on.
 * @param {any[]} filterValues - An array of values corresponding to the filterFields. 
 *                               Each value can be a single value or an array of allowed values.
 * @param {Date} [startDate] - Optional start date to filter projects with a 'date' field greater than or equal to this value.
 * @param {Date} [endDate] - Optional end date to filter projects with a 'date' field less than or equal to this value.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: { projects: Project[], projectNames: string[] } }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getProjectsWithFilters = async (
    orderByField: string,
    desc: boolean,
    filterFields: (keyof Project)[],
    filterValues: any[],
    startDate?: Date,
    endDate?: Date
): Promise<Result> => {
    const projects: Project[] = [];
    const projectNames: string[] = []; // Useful for search auto-complete

    try {
        let filterQuery = query(collection(db, "projects"));

        // Apply filters
        filterFields.forEach((field, index) => {
            const value = filterValues[index];
            if (Array.isArray(value)) {
                // There are multiple allowed values for this field
                filterQuery = query(filterQuery, where(field, 'in', value));
            } else {
                // There is just one allowed value for this field
                filterQuery = query(filterQuery, where(field, '==', value));
            }
        });

        if (startDate) filterQuery = query(filterQuery, where('date', '>=', Timestamp.fromDate(startDate)));
        if (endDate) filterQuery = query(filterQuery, where('date', '<=', Timestamp.fromDate(endDate)));

        // Apply ordering
        filterQuery = query(filterQuery, orderBy(orderByField, desc ? "desc" : "asc"));

        const querySnapshot = await getDocs(filterQuery);
        querySnapshot.forEach((doc) => {
            const project = {
                ...doc.data(),
                startDate: doc.data().startDate.toDate(),
                lastUpdated: doc.data().lastUpdated.toDate()
            } as Project;
            projects.push(project);
            projectNames.push(project.projectName);
        });

        return {
            success: true,
            data: {
                projects: projects,
                projectNames: projectNames
            }
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Updates the given field of the given project to newValue. If the project does not exist,
 * an error is returned.
 * 
 * @param {string} projectName - The name of the project to update a field of.
 * @param {string} field - The field to update.
 * @param {string} newValue - The value to update the field to.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const updateProjectField = async (projectName: string, field: keyof Project, newValue: any): Promise<Result> => {
    try {
        const docRef = doc(db, `projects/${projectName}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        // Convert Dates to Firestore Timestamps
        if (newValue instanceof Date) {
            newValue = Timestamp.fromDate(newValue);
        }

        const updateData = {
            [field]: newValue,
            lastUpdated: field === "lastUpdated" ? newValue : Timestamp.now()
        };
        await updateDoc(docRef, updateData);

        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Deletes the given project. If the project does not exist, an error is returned.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`, with `errorCode` from Firebase or "unknown".
 */
const deleteProject = async (projectName: string): Promise<Result> => {
    try {
        const docRef = doc(db, `projects/${projectName}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found" };
        }

        await deleteDoc(docRef);

        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

export {
    type Project,
    OverallStatus,
    AnalysisStage,
    createProject,
    getProjectByName,
    getAllProjects,
    getProjectsWithFilters,
    updateProjectField,
    deleteProject
};