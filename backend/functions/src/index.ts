import { getFirestore, collection, doc, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../../../frontend/src/firebaseConfig.js";  // Ensure this is the correct path to your firebaseConfig.js
import { TechEnergy } from "./TechEnergy.js";

const techEnergyFormID = "tech-energy-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
const techEnergyCollection = collection(db, techEnergyFormID);

/**
 * Save a new TechEnergy document, given as a query parameter, into
 * the techEnergyCollection.
 */
const createTechEnergy = onRequest(async (request, response) => {
    try {
        const documentJSON = request.query.techEnergy as string;
        if (!documentJSON) {
            response.status(400).send({ error: "Missing techEnergy parameter" });
            return;
        }

        const documentObj = JSON.parse(documentJSON) as TechEnergy;
        const documentRef = await addDoc(techEnergyCollection, documentObj); // addDoc() auto-generates an ID
        response.status(201).send({ message: `TechEnergy document created successfully with ID ${documentRef.id}` });
    } catch (error) {
        logger.error("Error creating TechEnergy document", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch a TechEnergy document by documentID.
 */
const getTechEnergy = onRequest(async (request, response) => {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = doc(db, techEnergyFormID, documentID);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `TechEnergy document with ID ${documentID} not found` });
            return;
        }

        response.status(200).send(documentSnapshot.data());
    } catch (error) {
        logger.error("Error fetching TechEnergy document", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Fetch all TechEnergy documents from the collection.
 */
const getAllTechEnergies = onRequest(async (_request, response) => {
    try {
        const allDocumentsSnapshot = await getDocs(techEnergyCollection);
        const allDocuments = allDocumentsSnapshot.docs.map(doc => doc.data());
        response.status(200).send(allDocuments);
    } catch (error) {
        logger.error("Error fetching all TechEnergy documents", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

/**
 * Delete a TechEnergy document by documentID.
 */
const deleteTechEnergy = onRequest(async (request, response) => {
    try {
        const documentID = request.query.documentID as string;
        if (!documentID) {
            response.status(400).send({ error: "Missing documentID parameter" });
            return;
        }

        const documentRef = doc(db, techEnergyFormID, documentID);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            response.status(404).send({ error: `TechEnergy document with ID ${documentID} not found` });
            return;
        }

        await deleteDoc(documentRef);
        response.status(200).send({ message: `TechEnergy document with ID ${documentID} deleted successfully` });
    } catch (error) {
        logger.error("Error deleting TechEnergy document", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

export { createTechEnergy, getTechEnergy, getAllTechEnergies, deleteTechEnergy };
