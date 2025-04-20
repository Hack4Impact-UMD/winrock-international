import { FirebaseError } from "firebase/app";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    Query,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import Result from "../../types/Result.js";

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
    startDate: Timestamp; // receive and send as a Date
    lastUpdated: Timestamp; // receive and send as a Date
}

/**
 * Saves a project with the given fields
 * into the database.
 * 
 * The projectName must be unique.
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
    startDate?: Date
): Promise<Result> => {
    try{
        const docRef = doc(db, "projects", projectName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: false, errorCode: "project-name-already-exists"}
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
            lastUpdated: now
        };
        await setDoc(docRef, newProject);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the project with the given name.
 * If the project does not exist, an error
 * is returned.
 * 
 * @returns a Promise<Result> containing the
 *          requested project.
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
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/*
To load data on component mount:
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		const getData = async () => {
			setProjects(await getProjects("name", true));
			setNames(await getProjectNamesStartingWith("Ch"));
		};

		getData();
	}, []);

To reload data/search:
	<button onClick={async () => setProjects(await getProjects("name", true))}>Refresh</button>
*/

// retrieves all projects ordered by [field] asc/desc,
// only where [filterByField] == [filterValue] (or where geography contains [filterValue]) if present

// to order by another field while filtering by geography with array-contains, a composite index needs to be
// manually added to the firestore for geography (Arrays) and the order-by field (Ascending/Descending)
const getProjects = async (orderByField: string, desc: boolean, filterByField?: string, filterValue?: string): Promise<Result> => {
    const projects: Project[] = [];
    let filterQuery: Query;
    
    try {
        if (filterByField && filterValue) {
            filterQuery = query(collection(db, "projects"), 
            where(filterByField, filterByField === "geography" ? "array-contains" : "==", filterValue), 
            orderBy(orderByField, desc ? "desc" : "asc"));
        } else {
            filterQuery = query(collection(db, "projects"),
            orderBy(orderByField, desc ? "desc" : "asc"));
        }
	
		const querySnapshot = await getDocs(filterQuery);
		querySnapshot.forEach((doc) => {
			const convertedDoc = {
                ...doc.data(),
                startDate: doc.data().startDate.toDate(),
                lastUpdated: doc.data().lastUpdated.toDate()
            }
            projects.push(convertedDoc as Project);
		});

		return {
            success: true,
            data: projects
        };
	}
	catch (error) {
		return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
	}
}

// retrieves all project names that start with [term] (for use in autocomplete)
const getProjectNamesStartingWith = async (term: string): Promise<Result> => {
    const projectNames: string[] = [];
    
    try {
        const nameQuery = query(collection(db, "projects"), 
            where("projectName", ">=", term), 
            where("projectName", "<=", term + "\uf8ff")); // End at the last possible name that starts with the term

		const querySnapshot = await getDocs(nameQuery);
		querySnapshot.forEach((doc) => {
			projectNames.push(doc.data().projectName);
		});

		return {
            success: true,
            data: projectNames
        };
	}
	catch (error) {
		return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
	}
}

// retrieves all projects with start date between [start] and [end] (for use with calendar picker)
const getProjectsStartedBetween = async (startDate: Date, endDate: Date): Promise<Result> => {
    const projects: Project[] = [];

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    try {
        const datesQuery = query(collection(db, "projects"), 
            where("startDate", ">=", startTimestamp), 
            where("startDate", "<=", endTimestamp), 
            orderBy("startDate", "desc"));

        const querySnapshot = await getDocs(datesQuery);

        querySnapshot.forEach((doc) => {
            const convertedDoc = {
                ...doc.data(),
                startDate: doc.data().startDate.toDate(),
                lastUpdated: doc.data().lastUpdated.toDate()
            }
            projects.push(convertedDoc as Project);
        });

        return {
            success: true,
            data: projects
        };
	}
	catch (error) {
		return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
	}
}

/**
 * Updates the given field of the given project
 * to newData. If the project does not exist,
 * an error is returned.
 * 
 * @returns a Promise<Result>.
 */
const updateProjectField = async (projectName: string, field: keyof Project, newData: any): Promise<Result> => {
    try {
        const docRef = doc(db, `projects/${projectName}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found"};
        }

        if (newData instanceof Date) {
            newData = Timestamp.fromDate(newData);
        }

        const updateData = {
            [field]: newData,
            lastUpdated: field === "lastUpdated" ? newData : Timestamp.now()
        };
        await updateDoc(docRef, updateData);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
};

/**
 * Deletes the given project. If the project
 * does not exist, an error is returned.
 * 
 * @returns a Promise<Result>.
 */
const deleteProject = async (projectName: string): Promise<Result> => {
    try {
        const docRef = doc(db, `projects/${projectName}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "project-not-found"};
        }

        await deleteDoc(docRef);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

export {
    OverallStatus,
    AnalysisStage,
    createProject,
    getProjectByName,
    getProjects,
    getProjectNamesStartingWith,
    getProjectsStartedBetween,
    updateProjectField,
    deleteProject
};