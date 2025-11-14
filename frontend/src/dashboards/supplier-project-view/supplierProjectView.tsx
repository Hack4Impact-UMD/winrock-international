import React, { useState } from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';
import ManageAccess from '../access-manager/components/ManageAccess';
import { Project } from "../../types/Project";
import { UpdateItem } from '../../types/UpdateItem';
import Chat from '../../dashboards/chat/components/Chat';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  updates?: UpdateItem[];
}

const SupplierProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);
  console.log(onBack) // to avoid unused variable warning
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
            showingNotes={false}
          />
        </div>

        <div className={styles.updatesPanel}>
          <ProjectUpdates updates={[]} />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Chat senderRole='supplier' projectId={project.id} active={project.isActive}></Chat>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupplierProjectView;
