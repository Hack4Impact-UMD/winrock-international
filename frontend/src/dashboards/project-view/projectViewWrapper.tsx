import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./projectView";
import { db } from '../../firebaseConfig';
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Project } from "../../types/Project";
import { UpdateItem } from "../../types/UpdateItem";

const ProjectViewWrapper = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
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
          return { id: doc.id, ...convertedData } as Project;
        })[0];
        console.log(projectName)
        if (projectData) {
          setProject(projectData);

          const updatesQuery = query(
            collection(db, "projects"),
            where('projectId', '==', projectData.id)
          );

          const updatesSnapshot = await getDocs(updatesQuery);

          const updatesData = updatesSnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to ISO strings
            const convertedData = { ...data };
            Object.keys(convertedData).forEach(key => {
              if (convertedData[key]?.toDate) {
                convertedData[key] = convertedData[key].toDate().toISOString();
              }
            });
            return { id: doc.id, ...convertedData } as UpdateItem;
          });

          setUpdates(updatesData);
        } else {
          console.warn("No project found for projectName:", projectName);
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectName]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  const refreshProjectData = async () => {
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
        return { id: doc.id, ...convertedData } as Project;
      })[0];

      if (projectData) {
        setProject(projectData);
      }
    } catch (error) {
      console.error("Error refreshing project data:", error);
    }
  };

  return (
    <ProjectView
      project={project}
      updates={updates}
      onBack={() => {
        navigate("/dashboard/admin/projects", { state: { viewMode: project.isActive === true ? "active" : "archived" } });
      }}
      onStageAdvanced={refreshProjectData}
    />
  );
};

export default ProjectViewWrapper;