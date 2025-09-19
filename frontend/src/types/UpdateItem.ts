export interface UpdateItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  timestamp: string;
  status: "received" | "sent" | "completed";
  canRequestInfo?: boolean;
}
