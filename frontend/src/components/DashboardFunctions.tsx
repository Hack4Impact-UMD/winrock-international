import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy, Query } from "firebase/firestore";

export interface ProjectData {
	projectName: string,
	supplierName: string,
	countries: string[],
	status: string,
	analysisStage: number,
	spendCategory: number,
	lastAnalysisChange: Date,
	projectStartDate: Date,
	projectCreationDate: Date
}

// retrieves all projects ordered by [field] asc/desc,
// only where [filterByField] == [filterValue] (or where countries contains [filterValue]) if present
export const getProjects = async (orderByField: string, desc: boolean, filterByField?: string, filterValue?: string) => {

	const results: ProjectData[] = [];

	let filterQuery: Query;

	if (filterByField && filterValue) {
		filterQuery = query(collection(db, "collection-name"), 
		where(filterByField, filterByField === "countries" ? "array-contains" : "==", filterValue), 
		orderBy(orderByField, desc ? "desc" : "asc"));
	}
	else {
		filterQuery = query(collection(db, "collection-name"),
		orderBy(orderByField, desc ? "desc" : "asc"));
	}
	
	const querySnapshot = await getDocs(filterQuery);
	querySnapshot.forEach((doc) => {
		results.push(doc.data() as ProjectData);
	});

	return results;

};

// retrieves all project names that contain [term] (for use in autocomplete)
export const getProjectNamesContaining = async (term: string) => {

	const results: string[] = [];

	const nameQuery = query(collection(db, "collection-name"), 
	where("projectName", "<=", term), 
	where("projectName", ">=", term + "\uf8ff"));

	const querySnapshot = await getDocs(nameQuery);
	querySnapshot.forEach((doc) => {
		results.push(doc.data().projectName);
	});

	return results;

};

// retrieves all projects with creation date between [start] and [end] (for use with calendar picker)
export const getProjectsBetween = async (startDate: Date, endDate: Date) => {

	const results: ProjectData[] = [];

	const datesQuery = query(collection(db, "collection-name"), 
	where("projectCreationDate", ">=", startDate), 
	where("projectCreationDate", "<=", endDate), 
	orderBy("projectCreationDate", "desc"));

	const querySnapshot = await getDocs(datesQuery);
	querySnapshot.forEach((doc) => {
		results.push(doc.data() as ProjectData);
	});

	return results;
};