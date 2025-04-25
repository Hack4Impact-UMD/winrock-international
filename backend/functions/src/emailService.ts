import { emailApiKey } from "./emailApiKey";

const EMAIL_API_URL = "https://api.smtp2go.com/v3/email";
const EMAIL_API_BATCH_LIMIT = 99; // The API has a limit of 100, subtract 1 because we need to send to the sender

const sender = "Om Arya <omarya@umd.edu>"; // REPLACE THIS
const replyRecipient = "Om Arya <omarya@umd.edu>"; // REPLACE THIS

function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Send an email to the given recipients, with the given subject,
 * containing the given message.
 * 
 * @param recipients - Array of recipients in the format "Name <name@example.com>".
 * @param subject - The subject of the email to send.
 * @param htmlBody - A stringified HTML element containing the message to send in the email.
 * 
 * @returns - { success: true } if successful.
 */
async function sendEmail(recipients: string[], subject: string, message: string) {
    const url = `${EMAIL_API_URL}/send`;
    const options = {
        method: "POST",
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Smtp2go-Api-Key': emailApiKey
        },
        body: JSON.stringify({
            sender, // required by the API
            to: [sender], // required by the API
            bcc: recipients,
            subject, // required by the API
            text_body: message, // required by the API
            custom_headers: [{header: 'Reply-To', value: replyRecipient}]
        }),
    };

    const response: Response = await fetch(url, options);

    if (!response.ok) {
        throw { reason: "email-send-failed" };
    }

    return { success: true };
}

export {
    EMAIL_API_BATCH_LIMIT,
    isValidEmail,
    sendEmail
};