import React, { useState } from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';
import ManageAccess from '../access-manager/components/ManageAccess';
import { Project } from "../../types/Project";
import sampleUpdates from './updatesSamples'; // Static updates
import { UpdateItem } from '../../types/UpdateItem';


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
        <div className={styles.leftPanel}>
          <ProjectTracker
            currentStage={project.analysisStage}
            initialInfoStatus="completed"
            technicalStatus="completed"
            ghgStatus="in-progress"
            risksStatus="not-started"
            finalStatus="not-started"
          />
        </div>

        <div className={styles.rightPanel}>
          <ProjectUpdates updates={sampleUpdates.filter(update => update.projectId === project.id)} />
        </div>
      </div>
    </div>
  );
};

export default SupplierProjectView;
