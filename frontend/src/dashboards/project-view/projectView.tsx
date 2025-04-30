import React from 'react';
import ProjectViewHeader from './components/ProjectViewHeader';
import ProjectTracker from './components/ProjectTracker';
import ProjectUpdates from './components/ProjectUpdates';
import styles from '../project-view/css-modules/ProjectView.module.css';
import Sidebar from '../winrock-dashboard/components/Sidebar';

import sampleUpdates from './updatesSamples'; // Static updates

interface Project {
  id: string;
  project: string;
  supplierName: string;
  overallStatus: 'On Track' | 'At Risk' | 'Paused' | 'Completed' | 'Completed (except for risk)';
  analysisStage:
    | 'Risk & Co-benefit Assessment'
    | 'GHG Assessment Analysis'
    | 'Confirming Final Requirements'
    | 'Clarifying Initial Project Information'
    | 'Complete, and Excluded';
  spendCategory: string;
  geography: string;
  lastUpdated: string;
  startDate: string;
  activityType:
    | 'Renewable Energy and Energy Efficiency'
    | 'Agriculture'
    | 'Agroforestry'
    | 'Animal Agriculture and Manure Management';
  isActive: boolean;
}

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  return (
    <div className={styles.projectViewContainer}>
        <Sidebar currentTab="projects"></Sidebar>
      <ProjectViewHeader data={project} />

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <ProjectTracker
            currentStage={project.analysisStage}
            initialInfoStatus="completed"
            technicalStatus="in-progress"
            ghgStatus="not-started"
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

export default ProjectView;
