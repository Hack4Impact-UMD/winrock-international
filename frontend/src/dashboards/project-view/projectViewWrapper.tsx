import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./projectView";
import sampleProjects from "./updatesProjects";
import sampleUpdates from "./updatesSamples";
import { db } from '../../firebaseConfig';
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProjectViewWrapper = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Component Rendered: ProjectViewWrapper");
  console.log("Initial States - project:", project, "updates:", updates, "loading:", loading);

  useEffect(() => {
    console.log("useEffect triggered with projectName:", projectName);

    const fetchProjectData = async () => {
      console.log("Fetching project data for projectName:", projectName);

      try {
        const projectQuery = query(
          collection(db, "projects"),
          where('projectName', '==', projectName)
        );
        console.log("Project query created:", projectQuery);

        const projectSnapshot = await getDocs(projectQuery);
        console.log("Project snapshot fetched:", projectSnapshot);

        const projectData = projectSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamps to ISO strings
          const convertedData = { ...data };
          Object.keys(convertedData).forEach(key => {
            if (convertedData[key]?.toDate) {
              console.log(`Converting timestamp field: ${key}`, convertedData[key]);
              convertedData[key] = convertedData[key].toDate().toISOString();
            }
          });
          return { id: doc.id, ...convertedData };
        })[0];
        console.log("Mapped project data:", projectData);

        if (projectData) {
          console.log("Project found:", projectData);
          setProject(projectData);

          const updatesQuery = query(
            collection(db, "updates"),
            where('projectId', '==', projectData.id)
          );
          console.log("Updates query created:", updatesQuery);

          const updatesSnapshot = await getDocs(updatesQuery);
          console.log("Updates snapshot fetched:", updatesSnapshot);

          const updatesData = updatesSnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to ISO strings
            const convertedData = { ...data };
            Object.keys(convertedData).forEach(key => {
              if (convertedData[key]?.toDate) {
                console.log(`Converting timestamp field in update: ${key}`, convertedData[key]);
                convertedData[key] = convertedData[key].toDate().toISOString();
              }
            });
            return { id: doc.id, ...convertedData };
          });
          console.log("Mapped updates data:", updatesData);

          setUpdates(updatesData);
        } else {
          console.warn("No project found for projectName:", projectName);
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectName]);

  console.log("Rendering component - loading:", loading, "project:", project);

  if (loading) {
    console.log("Loading state active");
    return <div>Loading...</div>;
  }

  if (!project) {
    console.log("Project not found state active");
    return <div>Project not found.</div>;
  }

  console.log("Rendering ProjectView with project and updates");
  return (
    <ProjectView
      project={project}
      updates={updates}
      onBack={() => {
        console.log("Navigating back");
        navigate(-1);
      }}
    />
  );
};

export default ProjectViewWrapper;