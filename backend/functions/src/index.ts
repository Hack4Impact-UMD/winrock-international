import { onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { withRetries } from "./utils/retryLogic";
import {
    EMAIL_API_BATCH_LIMIT,
    isValidEmail,
    sendEmail
} from "./emailService";

/**
 * Sends an email to the given recipients, with the given subject,
 * containing the given message.
 * 
 * Needs both 'recipientNames' and 'recipientEmails' as the API
 * requires "Name <name@example.com>" format. They are received
 * separately to make validation easier.
 */
exports.sendEmail = onCall(async (request) => {
    const recipientNames: string[] = request.data.recipientNames;
    const recipientEmails: string[] = request.data.recipientEmails;
    const subject: string = request.data.subject;
    const message: string = request.data.message;

    if (recipientNames.length !== recipientEmails.length) {
        throw { reason: "recipient-length-mismatch" };
    }

    if (recipientNames.length > EMAIL_API_BATCH_LIMIT) {
        throw { reason: "too-many-recipients" };
    }

    const recipients: string[] = [];
    recipientNames.forEach((name, index) => {
        const email = recipientEmails[index];

        // Prevent bouncing by verifying each email
        if (isValidEmail(email)) {
            recipients.push(`${name} <${email}>`);
        }
    });

    try {
        await withRetries(() => sendEmail(recipients, subject, message), 2, 10000);
    } catch (error) {
        throw { reason: "email-send-failed-with-retries" };
    }
});

// Initialize Admin SDK once
if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Updates the analysisStage of a project in Firestore.
 * Accepts either a specific stage to set, or advances to the next stage.
 *
 * request.data = {
 *   projectId: string,              // Firestore document id in 'projects'
 *   mode?: 'set' | 'advance',       // default: 'advance'
 *   stage?: string                  // required when mode==='set'
 * }
 */
exports.advanceProjectStage = onCall(async (request) => {
    const projectId: string = request.data.projectId;
    const mode: 'set' | 'advance' = request.data.mode ?? 'advance';
    const stage: string | undefined = request.data.stage;

    if (!projectId) {
        throw { reason: "invalid-args", details: "projectId is required" };
    }
    if (mode === 'set' && !stage) {
        throw { reason: "invalid-args", details: "stage is required when mode is 'set'" };
    }

    const db = getFirestore();
    const docRef = db.collection('projects').doc(projectId);
    const snap = await docRef.get();
    if (!snap.exists) {
        throw { reason: "project-not-found" };
    }

    const orderedStages = [
        "Clarifying Initial Project Information",
        "Clarifying Technical Details",
        "GHG Assessment Analysis",
        "Confirming Final Requirements",
        "Risk & Co-benefit Assessment",
        "Complete, and Excluded",
    ];

    let nextStage: string;
    if (mode === 'set' && stage) {
        nextStage = stage;
    } else {
        const currentStage: string = (snap.data() as any).analysisStage;
        const idx = orderedStages.indexOf(currentStage);
        nextStage = orderedStages[Math.min(idx + 1, orderedStages.length - 1)] || orderedStages[0];
    }

    await docRef.update({
        analysisStage: nextStage,
        lastUpdated: FieldValue.serverTimestamp(),
    });

    return { success: true, data: { analysisStage: nextStage } };
});