export interface UpdateItem {
    id: number;
    title: string;
    description?: string;
    timestamp: string;
    status: "received" | "sent" | "completed";
    canRequestInfo?: boolean;
  }
  