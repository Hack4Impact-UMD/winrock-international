import React, { useState } from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';
import ManageAccess from '../access-manager/components/ManageAccess';
import { Project } from "../../types/Project";
import { UpdateItem } from '../../types/UpdateItem';
import Chat from '../chat/components/Chat';
import rightPanelOpen from "./assets/right-panel-open.svg";
import ProjectNotes from './components/ProjectNotes';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig'


interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  updates: UpdateItem[];
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack, updates }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);

  const [showingNotes, setShowingNotes] = useState(false);

  const handleNotesClick = () => {
	  setShowingNotes(true);
  }

  // Function to calculate tracker statuses based on analysisStage
  const getTrackerStatuses = (analysisStage: string) => {
    const stages = [
      "Clarifying Initial Project Information",
      "Clarifying Technical Details",
      "GHG Assessment Analysis",
      "Confirming Final Requirements",
      "Risk & Co-benefit Assessment",
      "Complete, and Excluded"
    ];

    const currentStageIndex = stages.indexOf(analysisStage);

    // If project is completed, all stages are completed
    if (analysisStage === "Complete, and Excluded") {
      return {
        initialInfoStatus: "completed" as const,
        technicalStatus: "completed" as const,
        ghgStatus: "completed" as const,
        finalStatus: "completed" as const,
        risksStatus: "completed" as const,
      };
    }

    // If stage not found, default to all not-started
    if (currentStageIndex === -1) {
      return {
        initialInfoStatus: "not-started" as const,
        technicalStatus: "not-started" as const,
        ghgStatus: "not-started" as const,
        finalStatus: "not-started" as const,
        risksStatus: "not-started" as const,
      };
    }

    // Calculate status for each stage
    const getStatus = (stageIndex: number): "not-started" | "in-progress" | "completed" => {
      if (stageIndex < currentStageIndex) {
        return "completed";
      } else if (stageIndex === currentStageIndex) {
        return "in-progress";
      } else {
        return "not-started";
      }
    };

    return {
      initialInfoStatus: getStatus(0),
      technicalStatus: getStatus(1),
      ghgStatus: getStatus(2),
      finalStatus: getStatus(3),
      risksStatus: getStatus(4),
    };
  };

  const trackerStatuses = getTrackerStatuses(project.analysisStage);

  const saveNotesToDatabase = async (notes: string) => {
    try {
        console.log("Saving notes to the database...");

        // Reference to the Firestore document for the project
        const projectDocRef = doc(db, "projects", project.id);

        // Update the Firestore document with the new notes
        await updateDoc(projectDocRef, {
            notes, // Update the notes field
        });

        console.log("Notes saved successfully:", notes);
    } catch (error) {
        console.error("Error saving notes to the database:", error);
        throw new Error("Failed to save notes");
    }
  };

  console.log("ProjectView - onBack:", onBack);
  console.log("ProjectView - project:", project);
  console.log("ProjectView - updates:", updates);

  return (
    <div className={styles.projectViewContainer}>
      <ManageAccess
        projectId={project.id}
        visible={showAccessManager}
        setVisible={setShowAccessManager}
      />
      <Sidebar currentTab="projects"></Sidebar>
      <ProjectViewHeader
        data={project}
        setShowAccessManager={setShowAccessManager}
      />

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <ProjectTracker
            currentStage={project.analysisStage}
            initialInfoStatus={trackerStatuses.initialInfoStatus}
            technicalStatus={trackerStatuses.technicalStatus}
            ghgStatus={trackerStatuses.ghgStatus}
            risksStatus={trackerStatuses.risksStatus}
            finalStatus={trackerStatuses.finalStatus}
			      showingNotes={showingNotes}
          />
        </div>

        <div className={styles.rightPanel}>
          <ProjectUpdates updates={updates} />
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            marginTop: "20px",
            marginBottom: "20px",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <span style={{ fontSize: "16px", fontWeight: "500", color: "#1a4b8b" }}>Edit Project Proposal Form</span>
            <button style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#1a4b8b",
              backgroundColor: "transparent",
              border: "1px solid #1a4b8b",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              View and Edit
            </button>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:"20px", marginBottom:"40px"}}>
            <Chat senderRole='winrock' projectId={project.id}></Chat>
          </div>
        </div>

		{showingNotes && (
      <ProjectNotes
        showingNotes={showingNotes}
        setShowingNotes={setShowingNotes}
        saveNotes={saveNotesToDatabase}
        projectId={project.id}
      />
    )}
	
		<button className={styles.showNotesButton} style={{ display: showingNotes ? "none" : "flex" }} onClick={handleNotesClick}>
			<p className={styles.showNotesButtonText}>Notes</p>
			<img src={rightPanelOpen}></img>
		</button>

      </div>
    </div>
  );
};

export default ProjectView;