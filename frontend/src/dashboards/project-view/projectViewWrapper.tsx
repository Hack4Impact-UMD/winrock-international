// ProjectViewWrapper.tsx
import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./projectView";
import sampleProjects from "./updatesProjects";
import sampleUpdates from "./updatesSamples";

const ProjectViewWrapper = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = sampleProjects.find(p => p.id === projectId);
  const updates = sampleUpdates.filter(u => u.projectId === projectId);

  if (!project) return <div>Project not found.</div>;

  return (
    <ProjectView
      project={project}
      updates={updates}
      onBack={() => navigate(-1)}
    />
  );
};

export default ProjectViewWrapper;
