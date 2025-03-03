import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const getFormDetails = onRequest(async (request, response) => {
    try {
        const documentId = request.query.documentId as string; // Expecting documentId as query param
        if (!documentId) {
            response.status(400).send({ error: "Missing documentId parameter" });
            return;
        }

        // Reference to the subcollections
        const coBenefitsRef = db.collection(`regen-ag-risks-form/${documentId}/co-benefits`).doc("YUTlH9Y92AdytIZpBquw");
        const riskDisclosureRef = db.collection(`regen-ag-risks-form/${documentId}/risk-disclosure`).doc("eSzNH76ooGG2VPT7oI9l");

        // Fetch data
        const coBenefitsDoc = await coBenefitsRef.get();
        const riskDisclosureDoc = await riskDisclosureRef.get();

        if (!coBenefitsDoc.exists || !riskDisclosureDoc.exists) {
            response.status(404).send({ error: "Documents not found" });
            return;
        }

        const coBenefitsData = coBenefitsDoc.data();
        const riskDisclosureData = riskDisclosureDoc.data();

        response.status(200).send({
            coBenefits: {
                project_biodiversity: coBenefitsData?.project_biodiversity,
                project_farmer: coBenefitsData?.project_farmer,
                project_water: coBenefitsData?.project_water,
            },
            riskDisclosure: {
                description: riskDisclosureData?.description,
                disclosure: riskDisclosureData?.disclosure,
                risk_category: riskDisclosureData?.risk_category,
                risk_subcategory: riskDisclosureData?.risk_subcategory,
            },
        });
    } catch (error) {
        logger.error("Error fetching form details", error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});
