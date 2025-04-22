import {
    Timestamp
} from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import Result from "../../../types/Result";

interface Notification {
    date: Timestamp;
    type: string;
    project: string;
    message: string;
    link: string;
}

const sendNotification = async (
    userId: string,
    date: Date,
    type: string,
    project: string,
    message: string,
    link: string
): Promise<Result> => {
    return { success: true };
}

const getAllNotifications = async (userId: string, startAt: number, endAt: number): Promise<Result> => {
    return { success: true };
}

const getReadNotifications = async (userId: string, startAt: number, endAt: number): Promise<Result> => {
    return { success: true };
}

const getUnreadNotifications = async (userId: string, startAt: number, endAt: number): Promise<Result> => {
    return { success: true };
}

const countAllNotifications = async (userId: string): Promise<Result> => {
    return { success: true };
}

const countReadNotifications = async (userId: string): Promise<Result> => {
    return { success: true };
}

const countUnreadNotifications = async (userId: string): Promise<Result> => {
    return { success: true };
}

const markNotificationAsRead = async (userId: string, notificationId: string): Promise<Result> => {
    return { success: true };
}

const markNotificationAsUnread = async (userId: string, notificationId: string): Promise<Result> => {
    return { success: true };
}

export {
    getAllNotifications,
    getReadNotifications,
    getUnreadNotifications,
    countAllNotifications,
    countReadNotifications,
    countUnreadNotifications,
    markNotificationAsRead,
    markNotificationAsUnread
};