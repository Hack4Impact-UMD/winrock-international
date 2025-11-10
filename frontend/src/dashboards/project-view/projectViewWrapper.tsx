import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./projectView";
import { db } from '../../firebaseConfig';
import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { UpdateItem } from "../../types/UpdateItem";
import { Project } from "../../types/Project";

const ProjectViewWrapper = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubscribeUpdatesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!projectName) {
      setLoading(false);
      return;
    }

    // Helper function to convert Firestore data
    const convertFirestoreData = (data: any) => {
      const convertedData = { ...data };
      Object.keys(convertedData).forEach(key => {
        if (convertedData[key]?.toDate) {
          convertedData[key] = convertedData[key].toDate().toISOString();
        }
      });
      return convertedData;
    };

    // Set up real-time listener for project
    const projectQuery = query(
      collection(db, "projects"),
      where('projectName', '==', projectName)
    );

    const unsubscribeProject = onSnapshot(
      projectQuery,
      (projectSnapshot) => {
        if (!projectSnapshot.empty) {
          const projectData = projectSnapshot.docs.map(doc => {
            const data = doc.data();
            const convertedData = convertFirestoreData(data);
            return { id: doc.id, ...convertedData };
          })[0];

          if (projectData) {
            setProject(projectData);
            setLoading(false);

            // Clean up previous updates listener if it exists
            if (unsubscribeUpdatesRef.current) {
              unsubscribeUpdatesRef.current();
            }

            // Set up real-time listener for updates when we have a project
            const updatesQuery = query(
              collection(db, "projects"),
              where('projectId', '==', projectData.id)
            );

            const unsubscribeUpdates = onSnapshot(
              updatesQuery,
              (updatesSnapshot) => {
                const updatesData = updatesSnapshot.docs.map(doc => {
                  const data = doc.data();
                  const convertedData = convertFirestoreData(data);
                  return { id: doc.id, ...convertedData };
                });
                setUpdates(updatesData);
              },
              (error) => {
                console.error("Error listening to updates:", error);
              }
            );

            // Store the unsubscribe function
            unsubscribeUpdatesRef.current = unsubscribeUpdates;
          } else {
            console.warn("No project found for projectName:", projectName);
            setProject(null);
            setLoading(false);
          }
        } else {
          console.warn("No project found for projectName:", projectName);
          setProject(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to project:", error);
        setLoading(false);
      }
    );

    // Cleanup function for both listeners
    return () => {
      unsubscribeProject();
      if (unsubscribeUpdatesRef.current) {
        unsubscribeUpdatesRef.current();
        unsubscribeUpdatesRef.current = null;
      }
    };
  }, [projectName]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

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