import { db } from "../../../frontend/src/firebaseConfig.ts";
import { onRequest } from "firebase-functions/v2/https";
import { collection, addDoc, getDocs } from "firebase/firestore";
import * as logger from "firebase-functions/logger";
import RenewableProjectProposal, { renewableProjectProposalConverter } from "./RenewableProjectProposal.ts";

// https://firebase.google.com/docs/firestore

const renewableProjectProposalFormId = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";

/**
 * Save a new renewableProjectProposal, given as a query parameter, into
 * the database.
 */
const createRenewableProjectProposal = onRequest(async (request, response) => {
    try {
        // TODO: Finish renewableProjectProposalConverter in RenewableProjectProposal.ts
        // to receive a renewableProjectProposal as a JSON string and convert it to Firestore format
        const renewableProjectProposal = request.query.renewableProjectProposal as string;
        if (!renewableProjectProposal) {
            response.status(400).send({ error: "Missing renewableProjectProposal parameter" });
            return;
        }
        
        await addDoc(collection(db, renewableProjectProposalFormId), renewableProjectProposalConverter.toFirestore(renewableProjectProposal));
        response.status(200).send({ success: "Document created successfully"});
    } catch (error) {
        logger.error("Error creating renewableProjectProposal", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch all renewableProjectProposals from the database.
 */
const getAllRenewableProjectProposals = onRequest(async (request, response) => {
    try {
        const allRenewableProjectProposals = await getDocs(collection(db, renewableProjectProposalFormId));
        response.status(200).send(allRenewableProjectProposals.docs.map(ref => ref.data()) as RenewableProjectProposal[]);
    } catch (error) {
        logger.error("Error fetching all renewableProjectProposals", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch the renewableProjectProposal from the database with the
 * 'documentId' specified as a query parameter.
 */
const getRenewableProjectProposal = onRequest(async (request, response) => {
    try {
        const documentId = request.query.documentId as string;
        if (!documentId) {
            response.status(400).send({ error: "Missing documentId parameter" });
            return;
        }

        const proposalRef = await getDocs(collection(db, `renewableProjectProposalFormId/${documentId}`));
        if (proposalRef.empty) {
            response.status(404).send({ error: `renewableProjectProposal with ID ${documentId} not found` });
            return;
        }

        response.status(200).send(proposalRef.docs[0].data() as RenewableProjectProposal);
    } catch (error) {
        logger.error("Error fetching renewableProjectProposal", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

export { createRenewableProjectProposal, getAllRenewableProjectProposals, getRenewableProjectProposal };