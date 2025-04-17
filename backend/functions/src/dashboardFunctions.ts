import {firestore} from 'firebase/app'
import 'firebase/firestore'

interface Project {
    projectId: string;
    status: ProjectStatus;
    createdAt: firestore.Timestamp;
    updatedAt: firestore.Timestamp;
}

enum ProjectStatus {
    STAGE_1 = "STAGE_1: Clarifying project info",
    STAGE_2 = "STAGE_2: Clarifying technical details",
    STAGE_3 = "STAGE_3: GHG assessment",
    STAGE_4 = "STAGE_4: Confirming final requirements",
    STAGE_5 = "STAGE_5: Risk and cobenefit form",
    STAGE_6 = "STAGE_6: Completed"
}

export const createProject = async (
    clientId: string,
    projectName: string,
): Promise<Project> => {
    try{
        const clientRef = firestore().collection('clients').doc(clientId);
        const projectsRef = clientRef.collection('projects').doc();
    
        const projectId = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const now = firestore.Timestamp.now();
        const newProject: Project = {
            projectId,
            status: ProjectStatus.STAGE_1,
            createdAt: now,
            updatedAt: now,
        };
    
        await projectsRef.doc(projectId).set(newProject);
        return newProject;

    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project");
    }
}

export const setProjectStatus = async (
    clientId: string,
    projectId: string,
    newStatus: ProjectStatus
): Promise<void> => {
    try {
        const projectRef = firestore().collection('clients').doc(clientId).collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();
        if (!projectDoc.exists) {
            throw new Error("Project not found");
        }

        await projectRef.update({
            status: newStatus,
            updatedAt: firestore.Timestamp.now(),
        });
    } catch (error) {
        console.error("Error updating project status:", error);
        throw new Error("Failed to update project status");
    }
};

export const deleteProject = async (
    clientId: string,
    projectId: string,
): Promise<void> => {
    try {
        const projectRef = firestore().collection('clients').doc(clientId).collection('projects').doc(projectId);

        const projectDoc = await projectRef.get();
        if (!projectDoc.exists) {
            throw new Error("Project not found");
        }
        await projectRef.delete();
    } catch (error) {
        console.error("Error deleting project:", error);
        throw new Error("Failed to delete project");
    }
};
