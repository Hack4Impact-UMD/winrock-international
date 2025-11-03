import React, { useState } from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import ProjectFiles from './components/ProjectFiles';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';
import ManageAccess from '../access-manager/components/ManageAccess';
import { Project } from "../../types/Project";
import { UpdateItem } from '../../types/UpdateItem';
import Chat from '../chat/components/Chat';


interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  updates: UpdateItem[];
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack, updates }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);

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
        <div className={styles.trackerPanel}>
          <ProjectTracker
            currentStage={project.analysisStage}
            initialInfoStatus="completed"
            technicalStatus="completed"
            ghgStatus="in-progress"
            risksStatus="not-started"
            finalStatus="not-started"
          />
        </div>

        <div className={styles.updatesPanel}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#ffffff",
              backgroundColor: "#1a4b8b",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              Mark Stage as Complete
            </button>
          </div>
        </div>
        <div className={styles.filesPanel}>
          <ProjectFiles />
        </div>
      </div>
    </div>
  );
};

export default ProjectView;