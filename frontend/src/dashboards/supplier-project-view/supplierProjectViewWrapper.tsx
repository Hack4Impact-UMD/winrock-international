import { useParams, useNavigate } from "react-router-dom";
import ProjectView from "./supplierProjectView";
import { db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Added orderBy

const SupplierProjectViewWrapper = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updates, setUpdates] = useState<any[]>([]); // Added TypeScript type annotations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any | null>(null); // Added TypeScript type annotations
  const [loading, setLoading] = useState<boolean>(true); // Added TypeScript type annotations

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectQuery = query(
          collection(db, "projects"),
          where("projectName", "==", projectName)
        );

        const projectSnapshot = await getDocs(projectQuery);

        const projectData = projectSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamps to ISO strings
          const convertedData = { ...data };
          Object.keys(convertedData).forEach((key) => {
            if (convertedData[key]?.toDate) {
              convertedData[key] = convertedData[key].toDate().toISOString();
            }
          });
          return { id: doc.id, ...convertedData };
        })[0];

        if (projectData) {
          setProject(projectData);
          const updatesQuery = query(
            collection(db, "projects"),
            where("projectId", "==", projectData.id)
          );

          const updatesSnapshot = await getDocs(updatesQuery);

          const updatesData = updatesSnapshot.docs.map((doc) => {
            const data = doc.data();
            const convertedData = { ...data };
            Object.keys(convertedData).forEach((key) => {
              if (convertedData[key]?.toDate) {
                convertedData[key] = convertedData[key].toDate().toISOString();
              }
            });
            return { id: doc.id, ...convertedData };
          });

          setUpdates(updatesData);
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProject(null);
      } finally {
        setLoading(false); // Ensure loading is cleared on error
      }
    };

    fetchProjectData();
  }, [projectName]);

  if (loading) return <div>Loading...</div>; // Render loading state before "Project not found."
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