import { db } from "../../../frontend/src/firebaseConfig.ts";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { RenewableProjectProposal, renewableProjectProposalConverter } from "./RenewableProjectProposal.js";

// https://firebase.google.com/docs/firestore

/* Renewable project proposal form functions */

const renewableProjectProposalForm = collection(db, 'project-submission-form');

export async function createRenewableProjectProposal(data: RenewableProjectProposal) {
    const docRef = await addDoc(renewableProjectProposalForm, renewableProjectProposalConverter.toFirestore(data));
    console.log("Document written with ID " + docRef.id);
}

export async function getAllRenewableProjectProposals() {
    const allRenewableProjectProposals = await getDocs(renewableProjectProposalForm);
    allRenewableProjectProposals.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    })
}

// TODO: Finish get and delete functions