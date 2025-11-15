import { runTransaction, FieldValue, setDoc } from "firebase/firestore";
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
import { sendEmail } from "../../../api/apiClient.js";
import { nanoid } from "nanoid";

// base url
const BASE_URL = "http://localhost:5173/winrock-international";


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
type ProjectFirestoreWrite = Omit<Project, 'startDate' | 'lastUpdated'> & {
    startDate: Timestamp | FieldValue;
    lastUpdated: FieldValue;
};

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
    clientName: string,
    supplierName: string,
    spendCategory: string,
    geography: string,
    notes: string = "",
    activityType: ActivityType,
    overallStatus: OverallStatus = OverallStatus.ON_TRACK,
    analysisStage: AnalysisStage = AnalysisStage.STAGE_1,
    startDate?: Date,
    isActive: boolean = true,
    isPinned: boolean = false,
    isLocked: boolean = false
): Promise<Result> => {
    try {
        //const docRef = doc(db, "projects", projectName);
        const docRef = doc(collection(db, "projects"));

        await runTransaction(db, async (tx) => {
            //need to check if the project name already exists
            const projectsRef = collection(db, "projects");
            const nameQuery = query(projectsRef, where("projectName", "==", projectName));
            const existingProjects = await getDocs(nameQuery);

            if (!existingProjects.empty) {
                throw new Error("project-name-already-exists");
            }

            const newProject: ProjectFirestoreWrite = {
                projectName,
                clientName,
                supplierName,
                spendCategory,
                geography,
                overallStatus,
                analysisStage,
                startDate: startDate ? Timestamp.fromDate(startDate) : serverTimestamp(),
                lastUpdated: serverTimestamp(),
                notes,
                isActive,
                isPinned,
                isLocked,
                id: docRef.id,
                activityType,
            };
            tx.set(docRef, newProject);
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating project:", error);
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
        const q = query(collection(db, "projects"), where("projectName", "==", projectName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: false, errorCode: "project-not-found" };
        }

        const projectData = mapDocToProject(querySnapshot.docs[0].data());
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
        let usedIn = false;

        filterFields.forEach((field, index) => {
            const value = filterValues[index];
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return; // skip this filter
                }
                if (value.length > 10) {
                    throw new Error("Firestore 'in' supports 1–10 values");
                }
                if (usedIn) {
                    throw new Error("Firestore allows at most one 'in' filter per query");
                }
                usedIn = true;
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
    projectId: string,
    updates: Record<string, any>
): Promise<Result> => {
    try {
        const docRef = doc(db, "projects", projectId);

        const updateData: Record<string, FieldValue | string | number | boolean | null> = {
            ...updates,
            lastUpdated: serverTimestamp(),
        };

        await updateDoc(docRef, updateData);
        return { success: true };
    } catch (error) {
        console.log("error");
        return handleFirebaseError(error);
    }
};

/**
 * Adds a new project.
 */
const addProject = async (projectName: string, clientName: string, supplierName: string, supplierEmail: string, activityType: ActivityType): Promise<Result> => {
    try {
        await createProject(
            projectName.toLowerCase(),
            clientName,
            supplierName,
            "-",
            "-",
            "",
            activityType,
            OverallStatus.ON_TRACK,
            AnalysisStage.STAGE_1,
            undefined,
            true,
            false
        );

        // token for supplier to join project
        const tokenResult = await generateNewProjectSupplierToken(supplierEmail, projectName);
        if (!tokenResult.success) {
            return { success: false, errorCode: "Failed to generate supplier token" };
        }

        const token = tokenResult.data.token;

        // Dont send email for now
        // await emailSupplier(projectName, supplierName, supplierEmail, token);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateNewProjectSupplierToken = async (supplierEmail: string, projectName: string) => {
    let token = nanoid();

    let isUnique = false;

    // associate token, supplier email, and project name in database
    while (!isUnique) {
        try {
            // check for duplicate token (very unlikely but possible)
            const docRef = doc(db, "newProjectSupplierTokens", token);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                token = nanoid();
                continue;
            }
            else {
                isUnique = true;
            }

            await setDoc(docRef, {
                projectName: projectName,
                supplierEmail: supplierEmail,
                token: token
            });

        } catch (error) {
            return handleFirebaseError(error);
        }
    }

    return {
        success: true,
        data: {
            token: token
        }
    };
}

/**
 * Find supplier email associated with provided email token
 */
const getSupplierDataByToken = async (token: string): Promise<Result> => {
    try {
        const docRef = doc(db, "newProjectSupplierTokens", token);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "token-not-found" };
        }
        const data = docSnap.data();
        return { success: true, data: { supplierEmail: data.supplierEmail, projectName: data.projectName } };
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Validate that the token is valid (has an email associated with it)
 */
const isSupplierTokenValid = async (token: string): Promise<boolean> => {
    const res = await getSupplierDataByToken(token);
    return res.success;
}

/**
 * Validate that the supplier email matches the one associated with the token
 */
const validateSupplierEmail = async (token: string, supplierEmail: string): Promise<boolean> => {
    const res = await getSupplierDataByToken(token);
    return res.success && res.data.supplierEmail === supplierEmail;
}

const getSupplierProjectNameByToken = async (token: string): Promise<Result> => {
    const res = await getSupplierDataByToken(token);
    if (res.success) {
        return { success: true, data: res.data.projectName };
    }
    return { success: false, errorCode: "project-name-not-found" };
}

/**
 * Deletes a project by name.
 */
const deleteProject = async (projectName: string): Promise<Result> => {
    try {
        const q = query(collection(db, "projects"), where("projectName", "==", projectName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: false, errorCode: "project-not-found" };
        }

        const docRef = querySnapshot.docs[0].ref;

        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Check if a project is locked for editing
 */
const checkProjectLock = async (projectName: string): Promise<Result> => {
    try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("projectName", "==", projectName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { success: false, errorCode: "project-not-found" };
        }

        // Assuming projectName is unique, take the first match
        const projectData = querySnapshot.docs[0].data();
        const isLocked = projectData.isLocked ?? false;

        return {
            success: true,
            data: { isLocked },
        };
    } catch (error) {
        return handleFirebaseError(error);
    }
};

/**
 * Lock a project for editing (set isLocked to true)
 */
const lockProject = async (projectName: string, lockOwner: string): Promise<Result> => {
    try {
        // first get the doc ID by projectName
        const q = query(collection(db, "projects"), where("projectName", "==", projectName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: false, errorCode: "project-not-found" };
        }

        const docRef = querySnapshot.docs[0].ref; // use actual doc ref

        await runTransaction(db, async (tx) => {
            const snap = await tx.get(docRef);
            const projectData = snap.data();
            // treat as success if lock is already held by the same requester
            if (projectData?.isLocked) {
                if (projectData.lockOwner && lockOwner && projectData.lockOwner === lockOwner) {
                    tx.update(docRef, {
                        lastUpdated: serverTimestamp()
                    });
                    return;
                }
                throw new Error("project-already-locked");
            }

            tx.update(docRef, {
                isLocked: true,
                lockOwner: lockOwner ?? null,
                lastUpdated: serverTimestamp()
            });
        });

        return { success: true };
    } catch (error) {
        if ((error as Error).message === "project-already-locked") {
            return { success: false, errorCode: "project-already-locked" };
        }
        return handleFirebaseError(error);
    }
};

/**
 * Unlock a project (set isLocked to false)
 */
const unlockProject = async (projectName: string, lockOwner: string): Promise<Result> => {
    try {
        const q = query(collection(db, "projects"), where("projectName", "==", projectName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: false, errorCode: "project-not-found" };
        }

        const docRef = querySnapshot.docs[0].ref;

        await runTransaction(db, async (tx) => {
            const snap = await tx.get(docRef);
            const projectData = snap.data();

            // nothing to do
            if (!projectData?.isLocked) {
                return;
            }

            if (projectData.lockOwner && lockOwner && projectData.lockOwner !== lockOwner) {
                throw new Error("not-lock-owner");
            }
            tx.update(docRef, {
                isLocked: false,
                lockOwner: null,
                lastUpdated: serverTimestamp()
            });
        });
        return { success: true };
    } catch (error) {
        if ((error as Error).message === "not-lock-owner") {
            return { success: false, errorCode: "not-lock-owner" };
        }
        return handleFirebaseError(error);
    }
};

/**
 * Send an project invitation email to the supplier
 */
const emailSupplier = async (projectName: string, supplierName: string, supplierEmail: string, token: string): Promise<Result> => {
    try {
        // invite url with token
        const inviteUrl = `${BASE_URL}/dashboard/admin/projects/${projectName}?token=${token}`;

        const recipient: string = `${supplierName} <${supplierEmail}>`;
        const subject = `Invitation: Collaborate on ${projectName}`;
        const message =
            [
                `Hi ${supplierName},`,
                '',
                `You have been invited to collaborate on the project "${projectName}" on the Winrock Dashboard.`,
                '',
                `Click the link below to access the project:`,
                inviteUrl,
                '',
                'If you don\'t have an account yet, you\'ll be prompted to sign up or log in.',
                '',
                'Regards,',
                'Winrock Team'
            ].join('\n');
        await sendEmail({
            recipientNames: [recipient],
            recipientEmails: [supplierEmail],
            subject,
            message
        });
        return { success: true };
    } catch (error) {
        return { success: false, errorCode: (error as Error).message || 'Failed to send email' };
    }
};

export {
    addProject,
    createProject,
    generateNewProjectSupplierToken,
    isSupplierTokenValid,
    getSupplierProjectNameByToken,
    validateSupplierEmail,
    getProjectByName,
    getAllProjects,
    getProjectsWithFilters,
    updateProjectField,
    deleteProject,
    checkProjectLock,
    lockProject,
    unlockProject,
};
