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
import MarkStageModal from './components/MarkStageModal';
import StageActionCard from './components/StageActionCard';
import AdvanceStageButton from './components/AdvanceStageButton';
import StageHeader from './components/StageHeader';
import { finalStage } from './ProjectViewUtils';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  updates: UpdateItem[];
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack, updates }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  console.log("ProjectView - onBack:", onBack);
  console.log("ProjectView - project:", project);
  console.log("ProjectView - updates:", updates);

  console.log(project.analysisStage, finalStage, project.analysisStage === finalStage);

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
          
          <StageActionCard analysisStage={project.analysisStage} />
          <div style={{display:"flex", flexDirection:"column", gap:"20px", marginBottom:"40px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}>
            <StageHeader analysisStage={project.analysisStage} />
            <Chat senderRole='winrock' projectId={project.id}></Chat>
          </div>
          <AdvanceStageButton 
            currentStage={project.analysisStage}
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className={styles.filesPanel}>
          <ProjectFiles projectId={project.id} />
        </div>
      </div>
      {showModal && <MarkStageModal onClose={() => setShowModal(false)} projectId={project.id} currentStage={project.analysisStage}></MarkStageModal>}
    </div>
  );
};

export default ProjectView;