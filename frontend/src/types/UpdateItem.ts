export type AnalysisStageType =
  | "Risk & Co-benefit Assessment"
  | "GHG Assessment Analysis"
  | "Confirming Final Requirements"
  | "Clarifying Technical Details"
  | "Clarifying Initial Project Information"
  | "Complete, and Excluded";

export interface UpdateItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  timestamp: string;
  status: "received" | "sent" | "completed";
  canRequestInfo?: boolean;
  stage?: AnalysisStageType;
}
