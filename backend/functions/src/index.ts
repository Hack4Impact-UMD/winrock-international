import { onCall } from "firebase-functions/v2/https";
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