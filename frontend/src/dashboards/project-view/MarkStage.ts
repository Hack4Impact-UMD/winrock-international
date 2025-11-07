import Result, { handleFirebaseError } from "../../types/Result"
import { updateProjectField } from "../winrock-dashboard/projects/winrockDashboardService";

export const stageMap: Record<string, number> = {
    "Clarifying Initial Project Information": 1,
    "Clarifying Technical Details": 2,
    "GHG Assessment Analysis": 3,
    "Confirming Final Requirements": 4,
    "Risk & Co-benefit Assessment": 5,
    "Complete, and Excluded": 6,
};

export const finalStage = "Complete, and Excluded";

/**
 * Update the project's analysis stage to the next stage
 * Does nothing if the current stage is invalid or if we are already at the last stage
 */
export const markStageAsComplete = async (projectId: string, currentStage: string): Promise<Result> => {
    try {
        const currentStageNumber = stageMap[currentStage];
        if (!currentStageNumber) {
            return { success: false, errorCode: "Invalid current stage" };
        }
        const nextStageNumber = currentStageNumber + 1;
        const nextStage = Object.keys(stageMap).find(key => stageMap[key] === nextStageNumber);
        // if there is no next stage, we are at the final stage
        if (!nextStage) {
            return { success : false, errorCode: "Already at final stage" };
        }
        await updateProjectField(projectId, "analysisStage", nextStage);
        return { success: true };
    } catch (err) {
        return handleFirebaseError(err);
    }
}