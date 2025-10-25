// ProjectViewWrapper.tsx
import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./supplierProjectView";
import sampleProjects from "./updatesProjects";
import sampleUpdates from "./updatesSamples";

const SupplierProjectViewWrapper = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  console.log(projectId);
  const project = sampleProjects.find(p => p.id === projectId);
  const updates = sampleUpdates.filter(u => u.projectId === projectId);

  if (!project) return <div>Project not found.</div>;

  return (
    <ProjectView
      project={project}
      updates={updates}
      onBack={() => navigate("/dashboard/supplier/projects")}
    />
  );
};

export default SupplierProjectViewWrapper;
