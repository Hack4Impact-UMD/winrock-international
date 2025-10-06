import { FirebaseError } from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    documentId,
    getCountFromServer,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import Result from "../../../types/Result";
import { batchArray } from "../../../utils/batch.js";
import { sendEmail } from "../../../api/apiClient.js";

interface Notification {
    type: string;
    project: string;
    message: string;
    date: Timestamp;
    status: NotificationStatus;
}

type NotificationStatus =
    | "unread"
    | "read";

/**
 * Saves a notification document with the given data into a subcollection
 * for the given user.
 * 
 * Returns the ID of the created document.
 * 
 * @param {string} recipientIds - IDs of the users to send the notification to.
 * @param {string} type 
 * @param {string} project 
 * @param {string} message 
 * @param {Date} date - Defaults to the current date, but can optionally be set.
 * @param {NotificationStatus} status - Defaults to "unread", but can optionally be set.
 * @param {boolean} shouldSendEmail - Whether to send an email to the user.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const sendNotification = async (
    recipientIds: string[],
    type: string,
    project: string,
    message: string,
    date?: Date,
    status: NotificationStatus = "unread",
    shouldSendEmail: boolean = true
): Promise<Result> => {
    const notification: Notification = {
        type,
        project,
        message,
        date: date ? Timestamp.fromDate(date) : Timestamp.now(),
        status
    };

    try {
        const recipientDocs = [];
        const recipientIdBatches: string[][] = batchArray(recipientIds, 10); // Firestore "in" has a 10-item limit
        for (const batch of recipientIdBatches) {
            const q = query(
                collection(db, "users"),
                where(documentId(), "in", batch));
            const querySnapshot = await getDocs(q);
            recipientDocs.push(...querySnapshot.docs);
        }

        if (shouldSendEmail) {
            const recipientNames: string[] = [];
            const recipientEmails: string[] = [];

            await Promise.all(recipientDocs.map(async (recipientDoc) => {
                const recipient = recipientDoc.data();
                recipientNames.push(`${recipient.firstName} ${recipient.lastName}`);
                recipientEmails.push(recipient.email);
            
                const notificationsCollection = collection(db, `users/${recipientDoc.id}/notifications`);
                await addDoc(notificationsCollection, notification);
            }));
    
            await sendEmail({
                recipientNames,
                recipientEmails,
                subject: `New update for "${project}" project`,
                message
            });
        } else {
            await Promise.all(recipientDocs.map(recipientDoc => {
                const notificationsCollection = collection(db, `users/${recipientDoc.id}/notifications`);
                return addDoc(notificationsCollection, notification);
            }));
        }
        
        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves tall notifications of the given user from 'start' (inclusive)
 * to 'end' (exclusive), ordered by descending date.
 * 
 * @param {string} userId - ID of the user to retrieve the notifications of.
 * @param {string} start - Inclusive index of the first notification to retrieve, when ordering by descending date.
 * @param {string} end - Exclusive index of the last notification to retrieve, when ordering by descending date.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: notifications }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getAllNotifications = async (userId: string, start: number, end: number): Promise<Result> => {
    const notifications: Notification[] = [];

    try {
        const allNotificationsQuery = query(
            collection(db, `users/${userId}/notifications`),
            orderBy("date", "desc"));

        const querySnapshot = await getDocs(allNotificationsQuery);
        const slicedDocs = querySnapshot.docs.slice(start, end);
        slicedDocs.forEach((doc) => {
            const notification = {
                ...doc.data(),
                date: doc.data().date.toDate()
            } as Notification;
            notifications.push(notification);
        });

        return {
            success: true,
            data: notifications
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the unread notifications of the given user from 'start' (inclusive)
 * to 'end' (exclusive), ordered by descending date.
 * 
 * @param userId - ID of the user to retrieve the notifications of.
 * @param start - Inclusive index of the first notification to retrieve, when ordering by descending date.
 * @param end - Exclusive index of the last notification to retrieve, when ordering by descending date.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: notifications }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getUnreadNotifications = async (userId: string, start: number, end: number): Promise<Result> => {
    const notifications: Notification[] = [];

    try {
        const allNotificationsQuery = query(
            collection(db, `users/${userId}/notifications`),
            where("status", "==", "unread"),
            orderBy("date", "desc"));

        const querySnapshot = await getDocs(allNotificationsQuery);
        const slicedDocs = querySnapshot.docs.slice(start, end);
        slicedDocs.forEach((doc) => {
            const notification = {
                ...doc.data(),
                date: doc.data().date.toDate()
            } as Notification;
            notifications.push(notification);
        });

        return {
            success: true,
            data: notifications
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the read notifications of the given user from 'start' (inclusive)
 * to 'end' (exclusive), ordered by descending date.
 * 
 * @param userId - ID of the user to retrieve the notifications of.
 * @param start - Inclusive index of the first notification to retrieve, when ordering by descending date.
 * @param end - Exclusive index of the last notification to retrieve, when ordering by descending date.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: notifications }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const getReadNotifications = async (userId: string, start: number, end: number): Promise<Result> => {
    const notifications: Notification[] = [];

    try {
        const allNotificationsQuery = query(
            collection(db, `users/${userId}/notifications`),
            where("status", "==", "read"),
            orderBy("date", "desc"));

        const querySnapshot = await getDocs(allNotificationsQuery);
        const slicedDocs = querySnapshot.docs.slice(start, end);
        slicedDocs.forEach((doc) => {
            const notification = {
                ...doc.data(),
                date: doc.data().date.toDate()
            } as Notification;
            notifications.push(notification);
        });

        return {
            success: true,
            data: notifications
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the # of notifications belonging to the given user.
 * 
 * @param userId - ID of the user to retrieve the notification count of.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: count }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const countAllNotifications = async (userId: string): Promise<Result> => {
    try {
        const collectionRef = collection(db, `users/${userId}/notifications`);

        const querySnapshot = await getCountFromServer(collectionRef);
        const count = querySnapshot.data().count;

        return {
            success: true,
            data: count
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the # of unread notifications belonging to the given user.
 * 
 * @param userId - ID of the user to retrieve the notification count of.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: count }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const countUnreadNotifications = async (userId: string): Promise<Result> => {
    try {
        const allNotificationsQuery = query(
            collection(db, `users/${userId}/notifications`),
            where("status", "==", "unread"));

        const querySnapshot = await getCountFromServer(allNotificationsQuery);
        const count = querySnapshot.data().count;

        return {
            success: true,
            data: count
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Retrieves the # of read notifications belonging to the given user.
 * 
 * @param userId - ID of the user to retrieve the notification count of.
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: count }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const countReadNotifications = async (userId: string): Promise<Result> => {
    try {
        const allNotificationsQuery = query(
            collection(db, `users/${userId}/notifications`),
            where("status", "==", "read"));

        const querySnapshot = await getCountFromServer(allNotificationsQuery);
        const count = querySnapshot.data().count;

        return {
            success: true,
            data: count
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Updates the status of the given notification of the given user to "read".
 * 
 * @param userId - ID of the user to update a notification of.
 * @param notificationId - ID of the notification to set to "read".
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const markNotificationAsRead = async (userId: string, notificationId: string): Promise<Result> => {
    try {
        const docRef = doc(db, `users/${userId}/notifications/${notificationId}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "notification-not-found"};
        }

        await updateDoc(docRef, { status: "read" });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Updates the status of the given notification of the given user to "unread".
 * 
 * @param userId - ID of the user to update a notification of.
 * @param notificationId - ID of the notification to set to "unread".
 * 
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const markNotificationAsUnread = async (userId: string, notificationId: string): Promise<Result> => {
    try {
        const docRef = doc(db, `users/${userId}/notifications/${notificationId}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, errorCode: "notification-not-found"};
        }

        await updateDoc(docRef, { status: "unread" });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
}

/**
 * Finds supplier users by company name.
 * 
 * @param companyName - The name of the company to find suppliers for.
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true, data: supplierUserIds }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const findSupplierUsersByCompany = async (companyName: string): Promise<Result> => {
    try {
        const usersQuery = query(
            collection(db, "users"),
            where("role", "==", "supplier"),
            where("company", "==", companyName)
        );

        const querySnapshot = await getDocs(usersQuery);
        const supplierUserIds: string[] = [];

        querySnapshot.forEach((doc) => {
            supplierUserIds.push(doc.id);
        });

        return {
            success: true,
            data: supplierUserIds
        };
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
};

/**
 * Sends a notification when a project stage is completed.
 * 
 * @param projectName - The name of the project.
 * @param supplierName - The name of the supplier company.
 * @param completedStage - The stage that was completed.
 * @param newStage - The new stage the project moved to (optional).
 * @returns {Promise<Result>} A promise resolving to a `Result` object:
 *      - On success: `{ success: true }`
 *      - On failure: `{ success: false, errorCode: string }`
 */
const sendStageCompletionNotification = async (
    projectName: string,
    supplierName: string,
    completedStage: string,
    newStage?: string
): Promise<Result> => {
    try {
        // Find supplier users for this company
        const supplierResult = await findSupplierUsersByCompany(supplierName);
        if (!supplierResult.success) {
            return supplierResult;
        }

        const supplierUserIds = supplierResult.data as string[];
        
        if (supplierUserIds.length === 0) {
            // No suppliers found for this company, but this isn't an error
            return { success: true };
        }

        // Create the notification message
        const stageMessage = newStage 
            ? `The project "${projectName}" has moved from "${completedStage}" to "${newStage}".`
            : `The project "${projectName}" has completed the "${completedStage}" stage.`;

        const message = `An update has been made to your project.\n\n${stageMessage}`;

        // Send notification with email
        const notificationResult = await sendNotification(
            supplierUserIds,
            "stage_completion",
            projectName,
            message,
            undefined, // date - will use current date
            "unread",
            true // shouldSendEmail
        );

        return notificationResult;
    } catch (error) {
        return {
            success: false,
            errorCode: error instanceof FirebaseError ? error.code : "unknown"
        };
    }
};

export {
    type Notification,
    type NotificationStatus,
    sendNotification,
    getAllNotifications,
    getReadNotifications,
    getUnreadNotifications,
    countAllNotifications,
    countReadNotifications,
    countUnreadNotifications,
    markNotificationAsRead,
    markNotificationAsUnread,
    findSupplierUsersByCompany,
    sendStageCompletionNotification
};