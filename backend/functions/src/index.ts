import * as firestore from "firebase/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

import { db } from "../../../frontend/src/firebaseConfig.js";
import RenewableProjectProposal from "./RenewableProjectProposal.js";

// https://firebase.google.com/docs/firestore

const renewableProjectProposalFormID = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
const renewableProjectProposalForm = firestore.collection(db, renewableProjectProposalFormID);

/**
 * Save a new renewableProjectProposal document, given as a query parameter, into
 * the renewableProjectProposalForm collection.
 */
const createRenewableProjectProposal = onRequest(async (request, response) => {
    try {
        const documentJSON = request.query.renewableProjectProposal as string;
        if (!documentJSON) {
            response.status(400).send({ error: "Missing renewableProjectProposal parameter" });
            return;
        }

        const documentObj = JSON.parse(documentJSON) as RenewableProjectProposal;
        const documentRef = await firestore.addDoc(renewableProjectProposalForm, documentObj); // addDoc() auto-generates an ID for the doc
        response.status(201).send({ message: `renewableProjectProposal created successfully with ID ${documentRef.id}` });
    } catch (error) {
        logger.error("Error creating renewableProjectProposal", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch the renewableProjectProposal document, with the 'documentID' specified as a
 * query parameter, from the renewableProjectProposalForm collection.
 */
const getRenewableProjectProposal = onRequest(async (request, response) => {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = firestore.doc(db, renewableProjectProposalFormID, documentID);
        const documentSnapshot = await firestore.getDoc(documentRef);
        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `renewableProjectProposal with ID ${documentID} not found` });
            return;
        }

        const documentJSON = JSON.stringify(documentSnapshot) as string;
        response.status(200).send(documentJSON);
    } catch (error) {
        logger.error("Error fetching renewableProjectProposal", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch all renewableProjectProposals documents from the renewableProjectProposalForm
 * collection.
 */
const getAllRenewableProjectProposals = onRequest(async (request, response) => {
    try {
        const allDocumentsSnapshot = await firestore.getDocs(renewableProjectProposalForm);
        const allDocumentsJSON = JSON.stringify(allDocumentsSnapshot.docs.map(ref => ref.data())) as string;
        response.status(200).send(allDocumentsJSON);
    } catch (error) {
        logger.error("Error fetching all renewableProjectProposals", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Delete a renewableProjectProposal document by documentID.
 */
const deleteRenewableProjectProposal = onRequest(async (request, response) => {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = firestore.doc(db, renewableProjectProposalFormID, documentID);
        const documentSnapshot = await firestore.getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `renewableProjectProposal with ID ${documentID} not found` });
            return;
        }

        await firestore.deleteDoc(documentRef);
        response.status(200).send({ message: `renewableProjectProposal with ID ${documentID} deleted successfully` });
    } catch (error) {
        logger.error("Error deleting this Renewable Project Porposal", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});


export { createRenewableProjectProposal, getRenewableProjectProposal, getAllRenewableProjectProposals, deleteRenewableProjectProposal };