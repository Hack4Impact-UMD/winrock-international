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

export interface ProjectStageInfo {
  currentStage:
    | "Risk & Co-benefit Assessment"
    | "GHG Assessment Analysis"
    | "Confirming Final Requirements"
    | "Clarifying Initial Project Information"
    | "Complete, and Excluded"
    | "Clarifying Technical Details";
  initialInfoStatus: "not-started" | "in-progress" | "completed";
  technicalStatus: "not-started" | "in-progress" | "completed";
  ghgStatus: "not-started" | "in-progress" | "completed";
  risksStatus: "not-started" | "in-progress" | "completed";
  finalStatus: "not-started" | "in-progress" | "completed";
}

const projectStageOrder = {
  "Clarifying Initial Project Information": 0,
  "Clarifying Technical Details": 1,
  "GHG Assessment Analysis": 2,
  "Confirming Final Requirements": 3,
  "Risk & Co-benefit Assessment": 4,
  "Complete, and Excluded": 5,
};

const getProjectStageInfo = (
  currentAnalysisStage: Project["analysisStage"]
): ProjectStageInfo => {
  const currentStageNum = projectStageOrder[currentAnalysisStage];

  const projectStatus: ProjectStageInfo = {
    currentStage: currentAnalysisStage,
    initialInfoStatus:
      currentStageNum > 0
        ? "completed"
        : currentStageNum === 0
        ? "in-progress"
        : "not-started",
    technicalStatus:
      currentStageNum > 1
        ? "completed"
        : currentStageNum === 1
        ? "in-progress"
        : "not-started",
    ghgStatus:
      currentStageNum > 2
        ? "completed"
        : currentStageNum === 2
        ? "in-progress"
        : "not-started",
    finalStatus:
      currentStageNum > 3
        ? "completed"
        : currentStageNum === 3
        ? "in-progress"
        : "not-started",
    risksStatus:
      currentStageNum > 4
        ? "completed"
        : currentStageNum === 4
        ? "in-progress"
        : "not-started",
  };

  return projectStatus;
};

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const [showAccessManager, setShowAccessManager] = useState(false);

  const [projectStage, setProjectStage] = useState(project.analysisStage);

  const completeProjectStage = () => {
    if (projectStage === "Complete, and Excluded") {
      return;
    } else {
      const currentStageNum = projectStageOrder[projectStage];
      setProjectStage(
        (Object.keys(projectStageOrder) as Project["analysisStage"][]).find(
          (key) => projectStageOrder[key] === currentStageNum + 1
        )!
      );
    }
  };

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
        //data={project}
        data={{ ...project, analysisStage: projectStage }}
        setShowAccessManager={setShowAccessManager}
      />

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <ProjectTracker {...getProjectStageInfo(projectStage)} />
        </div>

        <div className={styles.rightPanel}>
          <ProjectUpdates
            updates={sampleUpdates.filter(
              (update) => update.projectId === project.id
            )}
            completeProjectStage={completeProjectStage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
