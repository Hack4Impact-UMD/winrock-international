import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy, Query, Timestamp } from "firebase/firestore";

export interface ProjectData {
	name: string,
	supplier: string,
	geography: string[],
	overallStatus: string,
	analysisStage: string,
	spendingCategory1: string,
	lastAnalysisChange: Date,
	startDate: Date,
	creationDate: Date
}

/*
To load data on component mount:
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		const getData = async () => {
			setProjects(await getProjects("name", true));
			setNames(await getProjectNamesContaining("Ch"));
		};

		getData();
	}, []);

To reload data:
	<button onClick={async () => setProjects(await getProjects("name", true))}>Refresh</button>
*/

// retrieves all projects ordered by [field] asc/desc,
// only where [filterByField] == [filterValue] (or where geography contains [filterValue]) if present

// to order by another field while filtering by geography with array-contains, a composite index needs to be
// manually added to the firestore for geography (Arrays) and the order-by field (Ascending/Descending)
export const getProjects = async (orderByField: string, desc: boolean, filterByField?: string, filterValue?: string) => {

	const results: ProjectData[] = [];

	let filterQuery: Query;

	if (filterByField && filterValue) {
		filterQuery = query(collection(db, "fake-data"), 
		where(filterByField, filterByField === "geography" ? "array-contains" : "==", filterValue), 
		orderBy(orderByField, desc ? "desc" : "asc"));
	}
	else {
		filterQuery = query(collection(db, "fake-data"),
		orderBy(orderByField, desc ? "desc" : "asc"));
	}
	
	const querySnapshot = await getDocs(filterQuery);
	querySnapshot.forEach((doc) => {
		const convertedDoc = {
			...doc.data(),
			startDate: doc.data().startDate.toDate(),
			creationDate: doc.data().creationDate.toDate(),
			lastAnalysisChange: doc.data().lastAnalysisChange.toDate()
		}
		results.push(convertedDoc as ProjectData);
	});

	return results;

};

// retrieves all project names that start with [term] (for use in autocomplete)
export const getProjectNamesContaining = async (term: string) => {

	const results: string[] = [];

	const nameQuery = query(collection(db, "fake-data"), 
	where("name", ">=", term), 
	where("name", "<=", term + "\uf8ff"));

	const querySnapshot = await getDocs(nameQuery);
	querySnapshot.forEach((doc) => {
		results.push(doc.data().name);
	});

	return results;

};

// retrieves all projects with creation date between [start] and [end] (for use with calendar picker)
export const getProjectsBetween = async (startDate: Date, endDate: Date) => {

	const results: ProjectData[] = [];

	const startTimestamp = Timestamp.fromDate(startDate);
	const endTimestamp = Timestamp.fromDate(endDate);

	const datesQuery = query(collection(db, "fake-data"), 
	where("creationDate", ">=", startTimestamp), 
	where("creationDate", "<=", endTimestamp), 
	orderBy("creationDate", "desc"));

	const querySnapshot = await getDocs(datesQuery);
	querySnapshot.forEach((doc) => {
		const convertedDoc = {
			...doc.data(),
			startDate: doc.data().startDate.toDate(),
			creationDate: doc.data().creationDate.toDate(),
			lastAnalysisChange: doc.data().lastAnalysisChange.toDate()
		}
		results.push(convertedDoc as ProjectData);
	});

	return results;
};