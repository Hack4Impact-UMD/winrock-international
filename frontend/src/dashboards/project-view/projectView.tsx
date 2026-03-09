import React, { useState, useEffect } from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import ProjectFiles from './components/ProjectFiles';
import AddFileLinkModal from './components/AddFileLinkModal';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';
import ManageAccess from '../access-manager/components/ManageAccess';
import { Project } from "../../types/Project";
import { UpdateItem } from '../../types/UpdateItem';
import Chat from '../chat/components/Chat';
import StageActionCard from './components/StageActionCard';
import AdvanceStageButton from './components/AdvanceStageButton';
import StageHeader from './components/StageHeader';
import MarkStageModal from './components/MarkStageModal';
import { finalStage } from './ProjectViewUtils';
import rightPanelOpen from "./assets/right-panel-open.svg";
import ProjectNotes from './components/ProjectNotes';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig'


interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  updates: UpdateItem[];
  onStageAdvanced?: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack, updates, onStageAdvanced }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [showingNotes, setShowingNotes] = useState(false);
  const [viewedStage, setViewedStage] = useState<string>(project.analysisStage);

  // Update viewedStage when project.analysisStage changes (e.g., after marking stage as complete)
  useEffect(() => {
    setViewedStage(project.analysisStage);
  }, [project.analysisStage]);

  const handleStageClick = (stage: string) => {
    setViewedStage(stage);
  };

  const handleNotesClick = () => {
    setShowingNotes(true);
  }

  const saveNotesToDatabase = async (notes: string) => {
    try {
      // Reference to the Firestore document for the project
      const projectDocRef = doc(db, "projects", project.id);

      // Update the Firestore document with the new notes
      await updateDoc(projectDocRef, {
        notes, // Update the notes field
      });

    } catch (error) {
      console.error("Error saving notes to the database:", error);
      throw new Error("Failed to save notes");
    }
  };

  console.log("ProjectView - onBack:", onBack);
  const [showGHGUploadModal, setShowGHGUploadModal] = useState(false);

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
        <div className={styles.trackerPanel}>
          <ProjectTracker
            currentStage={project.analysisStage}
            viewedStage={viewedStage}
            showingNotes={showingNotes}
            onStageClick={handleStageClick}
          />
        </div>

        <div className={styles.updatesPanel}>
          <ProjectUpdates updates={updates} />
          <StageActionCard projectId={project.id} role='winrock' analysisStage={viewedStage} proposalFormID={project.proposalFormID} riskFormID={project.riskFormID} onUploadClick={() => setShowGHGUploadModal(true)} />
          {showGHGUploadModal && (
            <AddFileLinkModal
              projectId={project.id}
              onClose={() => { setShowGHGUploadModal(false); window.location.reload(); }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <StageHeader analysisStage={viewedStage} />
            <Chat senderRole='winrock' projectId={project.id} active={project.isActive}></Chat>
          </div>
          {project.analysisStage !== finalStage && viewedStage === project.analysisStage && (
            <AdvanceStageButton
              currentStage={project.analysisStage}
              onClick={() => setShowModal(true)}
            />
          )}
        </div>
        {!showingNotes && (<div className={styles.filesPanel}>
          <ProjectFiles projectId={project.id} />
        </div>)}

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
      {showModal && (
        <MarkStageModal
          onClose={() => setShowModal(false)}
          projectId={project.id}
          projectName={project.projectName}
          currentStage={project.analysisStage}
          onStageAdvanced={onStageAdvanced}
        />
      )}
    </div>
  );
};

export default ProjectView;