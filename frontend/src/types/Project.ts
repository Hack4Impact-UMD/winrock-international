// src/types/project.ts
export interface Project {
    id: string;
    projectName: string;
    clientName: string;
    supplierName: string;
    overallStatus:
    | "On Track"
    | "At Risk"
    | "Paused"
    | "Completed"
    | "Completed (except for risk)";
    analysisStage:
    | "Risk & Co-benefit Assessment"
    | "GHG Assessment Analysis"
    | "Confirming Final Requirements"
    | "Clarifying Technical Details" // include this since wrapper error showed it
    | "Clarifying Initial Project Information"
    | "Complete, and Excluded";
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
    activityType:
    | "Renewable Energy and Energy Efficiency"
    | "Agriculture"
    | "Agroforestry"
    | "Animal Agriculture and Manure Management";
    isActive: boolean;
    isPinned: boolean;
    isLocked: boolean;
}
