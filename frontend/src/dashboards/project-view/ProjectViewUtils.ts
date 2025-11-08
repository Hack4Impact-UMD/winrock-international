import { collection, serverTimestamp, doc, getDocs, query, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebaseConfig";
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

export const getAllProjectFiles = async (projectId: string): Promise<Result> => {
    try {
		const q = query(
			collection(db, "projectFiles", projectId)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			return { success: true, data: [] };
		}
        // sort files in ascending upload time
        const files = querySnapshot.docs
                        .map(doc => doc.data())
                        .sort((a,b) => a.uploadedAt.seconds - b.uploadedAt.seconds);
        return { success: true, data: files };
    } catch (err) {
        return handleFirebaseError(err);
    }
}

export const uploadProjectFile = async (projectId: string, fileName: string, file: Blob | File): Promise<Result> => {
    try {
        const filesCollection = collection(db, "projectFiles");
        const docRef = doc(filesCollection);
        const path = `projectFiles/${projectId}/${docRef.id}_${fileName}`;
        // upload file to storage
        const storage = getStorage();
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        // add data to firestore
        await setDoc(docRef, {
            name: fileName,
            uploadedAt: serverTimestamp(),
            downloadURL: downloadURL,
        });
        return { success: true, data: { name: fileName, id: docRef.id, downloadURL } };
    } catch (err) {
        console.log(err);
        return handleFirebaseError(err);
    }
}