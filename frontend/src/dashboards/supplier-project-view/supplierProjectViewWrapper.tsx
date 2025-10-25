// ProjectViewWrapper.tsx
import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./supplierProjectView";
import sampleProjects from "./updatesProjects";
import sampleUpdates from "./updatesSamples";
import { db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

const SupplierProjectViewWrapper = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  console.log(projectName);
  const [updates, setUpdates] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectQuery = query(
          collection(db, "projects"),
          where('projectName', '==', projectName)
        );

        const projectSnapshot = await getDocs(projectQuery);
        const projectData = projectSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamps to ISO strings
          const convertedData = { ...data };
          Object.keys(convertedData).forEach(key => {
            if (convertedData[key]?.toDate) {
              convertedData[key] = convertedData[key].toDate().toISOString();
            }
          });
          return { id: doc.id, ...convertedData };
        })[0];
        if (projectData) {
          setProject(projectData);

          const updatesQuery = query(
            collection(db, "updates"),
            where('projectId', '==', projectData.id)
          );

          const updatesSnapshot = await getDocs(updatesQuery);

          const updatesData = updatesSnapshot.docs.map(doc => {
            const data = doc.data();

            const convertedData = { ...data };
            Object.keys(convertedData).forEach(key => {
              if (convertedData[key]?.toDate) {
                convertedData[key] = convertedData[key].toDate().toISOString();
              }
            });
            return { id: doc.id, ...convertedData };
          });
          setUpdates(updatesData);
        } else {
          console.warn("No project found with the given name.");
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProject(null);
      }
    };
    fetchProjectData();
  }, [projectName]);

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
