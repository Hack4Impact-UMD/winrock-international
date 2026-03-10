export type NotificationType =
    | "Chat"
    | "Form"
    | "Message"
    | "Overall Stage"
    | "Analysis Stage";

export interface Notification {
    id: string;
    projectName: string;
    senderEmail: string;
    senderRole: string;
    recipientEmail: string;
    recipientRole: string;
    timestamp: string;
    type: NotificationType;
    read: boolean;
}