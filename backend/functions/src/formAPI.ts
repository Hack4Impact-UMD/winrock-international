import * as e from "express";
import * as firestore from "firebase/firestore";
import * as logger from "firebase-functions/logger";

import { db } from "../../../frontend/src/firebaseConfig.js";

// See 'forms/RenewableProjectProposal.ts' and 'index.ts' for an example of how to use this API.

/**
 * Should be extended by an interface.
 * 
 * Describes data from a submission to a form; all fields must be strings,
 * but may either be required (!) or optional (?).
 */
interface FormData {
    [key: string]: string | undefined;
}

/**
 * Provides an abstraction over metadata about the form to use for API
 * functions.
 */
type FormType = {
    formName: string; // The name the client should use for the form, e.g. "renewableProjectProposal"
    formID: string; // The ID Firestore uses for the form, e.g. "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form"
}

/**
 * Should be extended by a class, as it represents objects used by the API
 * to create form submissions.
 */
interface FormSubmission {
    formData: FormData;
    constructor: Function;
}

// https://firebase.google.com/docs/firestore

/**
 * Save a new document, given as a query parameter, into the
 * collection of the given form type.
 */
async function createFormSubmission<Submission extends FormSubmission>(request: e.Request, response: e.Response, type: FormType): Promise<void> {
    try {
        const documentJSON = request.query[type.formName] as string;
        if (!documentJSON) {
            response.status(400).send({ error: `Missing ${type.formName} parameter` });
            return;
        }

        const documentObj = JSON.parse(documentJSON) as Submission;
        const collectionRef = firestore.collection(db, type.formID);
        const documentRef = await firestore.addDoc(collectionRef, documentObj); // addDoc() auto-generates an ID for the doc
        response.status(201).send({ message: `${type.formName} created successfully with ID ${documentRef.id}` });
    } catch (error) {
        logger.error(`Error creating ${type.formName}`, error);
        response.status(500).send({ error: "Internal server error" });
    }
};

/**
 * Fetch the document with the 'documentID' specified as a query
 * parameter from the collection of the given form type.
 */
async function getFormSubmission(request: e.Request, response: e.Response, type: FormType): Promise<void> {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = firestore.doc(db, type.formID, documentID);
        const documentSnapshot = await firestore.getDoc(documentRef);
        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `${type.formName} with ID ${documentID} not found` });
            return;
        }

        const documentJSON = JSON.stringify(documentSnapshot.data()) as string;
        response.status(200).send(documentJSON);
    } catch (error) {
        logger.error(`Error fetching ${type.formName}`, error);
        response.status(500).send({ error: "Internal server error" });
    }
}

/**
 * Fetch all documents from the collection of the given form type.
 */
async function getAllFormSubmissions(request: e.Request, response: e.Response, type: FormType): Promise<void> {
    try {
        const collectionRef = firestore.collection(db, type.formID);
        const allDocumentsSnapshot = await firestore.getDocs(collectionRef);
        const allDocumentsJSON = JSON.stringify(allDocumentsSnapshot.docs.map(ref => ref.data())) as string;
        response.status(200).send(allDocumentsJSON);
    } catch (error) {
        logger.error(`Error fetching all ${type.formName}s`, error);
        response.status(500).send({ error: "Internal server error" });
    }
}

/**
 * Delete a document by documentID from the collection of the given
 * form type.
 */
async function deleteFormSubmission(request: e.Request, response: e.Response, type: FormType): Promise<void> {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = firestore.doc(db, type.formID, documentID);
        const documentSnapshot = await firestore.getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `${type.formName} with ID ${documentID} not found` });
            return;
        }

        await firestore.deleteDoc(documentRef);
        response.status(200).send({ message: `${type.formName} with ID ${documentID} deleted successfully` });
    } catch (error) {
        logger.error(`Error deleting this ${type.formName}`, error);
        response.status(500).send({ error: "Internal server error" });
    }
}

export { FormData, FormType, FormSubmission,
         createFormSubmission, getFormSubmission, getAllFormSubmissions, deleteFormSubmission };