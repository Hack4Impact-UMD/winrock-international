import { onCall } from "firebase-functions/v2/https";
import { withRetries } from "./utils/retryLogic";
import {
    EMAIL_API_BATCH_LIMIT,
    isValidEmail,
    sendEmail
} from "./emailService";
import { getS3UploadUrl, getS3PublicUrl } from "./s3Service";
import * as admin from "firebase-admin";

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

/**
 * Generates a presigned URL for uploading a file to S3
 * @param request.data.projectId - The project ID
 * @param request.data.fileName - The name of the file to upload
 * @returns Presigned URL and S3 key
 */
exports.getS3UploadUrl = onCall(async (request) => {
    const projectId: string = request.data.projectId;
    const fileName: string = request.data.fileName;

    if (!projectId || !fileName) {
        throw { reason: "missing-parameters" };
    }

    try {
        const { uploadUrl, s3Key } = await getS3UploadUrl(projectId, fileName);
        return { uploadUrl, s3Key };
    } catch (error) {
        console.error("Error generating S3 upload URL:", error);
        throw { reason: "s3-url-generation-failed" };
    }
});

/**
 * Confirms an S3 upload and saves file metadata to Firestore
 * @param request.data.projectId - The project ID
 * @param request.data.fileName - The name of the file
 * @param request.data.s3Key - The S3 key where the file was uploaded
 * @returns Success status and file metadata
 */
exports.confirmS3Upload = onCall(async (request) => {
    const projectId: string = request.data.projectId;
    const fileName: string = request.data.fileName;
    const s3Key: string = request.data.s3Key;

    if (!projectId || !fileName || !s3Key) {
        throw { reason: "missing-parameters" };
    }

    try {
        // Initialize Firebase Admin if not already initialized
        if (!admin.apps.length) {
            admin.initializeApp();
        }

        const db = admin.firestore();
        // Match the structure used by the old upload code: top-level collection
        const filesCollection = db.collection("projectFiles");
        const docRef = filesCollection.doc();

        // Get the public URL for the S3 object
        const downloadURL = getS3PublicUrl(s3Key);

        // Save file metadata to Firestore (matching old structure)
        await docRef.set({
            name: fileName,
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            downloadURL: downloadURL,
            s3Key: s3Key,
            projectId: projectId,
        });

        return {
            success: true,
            data: {
                name: fileName,
                id: docRef.id,
                downloadURL: downloadURL,
            },
        };
    } catch (error) {
        console.error("Error confirming S3 upload:", error);
        throw { reason: "firestore-save-failed" };
    }
});