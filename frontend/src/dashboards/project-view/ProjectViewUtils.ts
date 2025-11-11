import { collection, getDocs, query, where, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Result, { handleFirebaseError } from "../../types/Result"
import { updateProjectField } from "../winrock-dashboard/projects/winrockDashboardService";
import { getS3UploadUrl, confirmS3Upload } from "../../api/apiClient";

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

/**
 * Get all files for a project from the projectFiles collection
 * Returns files sorted by uploadedAt in ascending order (oldest first)
 */
export const getAllProjectFiles = async (projectId: string): Promise<Result> => {
    try {
        const q = query(
            collection(db, "projectFiles"),
            where("projectId", "==", projectId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: true, data: [] };
        }
        const files = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                uploadedAt: data.uploadedAt
            } as Record<string, unknown> & { id: string };
        });
        
        // Sort by uploadedAt in ascending order (oldest first)
        files.sort((a, b) => {
            const aUploadedAt = a.uploadedAt;
            const bUploadedAt = b.uploadedAt;
            
            const aTime = aUploadedAt instanceof Timestamp 
                ? aUploadedAt.toMillis() 
                : (aUploadedAt as { seconds?: number })?.seconds 
                    ? (aUploadedAt as { seconds: number }).seconds * 1000 
                    : 0;
            const bTime = bUploadedAt instanceof Timestamp 
                ? bUploadedAt.toMillis() 
                : (bUploadedAt as { seconds?: number })?.seconds 
                    ? (bUploadedAt as { seconds: number }).seconds * 1000 
                    : 0;
            return aTime - bTime;
        });
        
        return { success: true, data: files };
    } catch (err) {
        return handleFirebaseError(err);
    }
}

/**
 * Add a file link to the projectFiles collection
 * NEW FILE UPLOAD FUNCTION FOR SHAREPOINT LINKS
 */
export const addFileLink = async (projectId: string, fileName: string, filePath: string): Promise<Result> => {
    try {
        await addDoc(collection(db, "projectFiles"), {
            projectId,
            fileName,
            filePath,
            uploadedAt: serverTimestamp()
        });
        return { success: true };
    } catch (err) {
        return handleFirebaseError(err);
    }
}

// OLD FILE UPLOAD FUNCTION
export const uploadProjectFile = async (projectId: string, fileName: string, file: Blob | File): Promise<Result> => {
    try {
        // Step 1: Get presigned URL from backend
        const uploadUrlResponse = await getS3UploadUrl({ projectId, fileName });
        const responseData = uploadUrlResponse.data as { uploadUrl?: string; s3Key?: string };
        const { uploadUrl, s3Key } = responseData;

        if (!uploadUrl || !s3Key) {
            return { success: false, errorCode: "Failed to get upload URL" };
        }

        // Step 2: Upload file directly to S3 using presigned URL
        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
        });

        if (!uploadResponse.ok) {
            return { success: false, errorCode: `S3 upload failed: ${uploadResponse.statusText}` };
        }

        // Step 3: Confirm upload and save metadata to Firestore
        const confirmResponse = await confirmS3Upload({ projectId, fileName, s3Key });
        const confirmData = confirmResponse.data as { success?: boolean; data?: { name: string; id: string; downloadURL: string } };
        
        if (confirmData.success && confirmData.data) {
            return { success: true, data: confirmData.data };
        } else {
            return { success: false, errorCode: "Failed to confirm upload" };
        }
    } catch (err) {
        console.error("Error uploading file to S3:", err);
        return handleFirebaseError(err);
    }
}
