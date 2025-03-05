
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { db } from "../../../frontend/src/firebaseConfig.js";
import { getDoc, doc } from "firebase/firestore";

export const getAgForm = onRequest(async (request, response) => {

	try {

		// read document ID parameter
		// const docID = request.query.documentId as string;
		// if (!docID) {
		// 	response.status(400).send({
		// 		error: "Missing documentId parameter"
		// 	});
		// }
		const docID = "tTMuoxVae4Ut15QlAZIN";

		// get a test question response
		
		const mainIntervention = await getDoc(doc(db, 
			`agriculture-form/${docID}/questions/activity-description/category-questions/main-intervention`));

		const mainInterventionResponse = mainIntervention.data();
		console.log(mainInterventionResponse);

		if (mainInterventionResponse) {
			logger.log(mainInterventionResponse);
		}

		response.status(200).send(JSON.stringify(mainInterventionResponse));
	}
	catch(error) {

		// log any errors encountered during read
		logger.error("Error fetching agriculture form details:", error);
		response.status(500).send({
			error: "Internal server error"
		});
	}
});
