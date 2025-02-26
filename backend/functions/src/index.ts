import { db } from './firebaseInit';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ProjectSubmission, projectSubmissionConverter } from "./ProjectSubmission";

// https://firebase.google.com/docs/firestore

/* Project submission form functions */

const projectSubmissionForm = collection(db, 'project-submission-form');

export async function createProjectSubmission(data: ProjectSubmission) {
    const docRef = await addDoc(projectSubmissionForm, projectSubmissionConverter.toFirestore(data));
    console.log("Document written with ID " + docRef.id);
}

export async function getAllProjectSubmissions() {
    const allProjectSubmissions = await getDocs(projectSubmissionForm);
    allProjectSubmissions.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    })
}

// TODO: Finish get and delete functions