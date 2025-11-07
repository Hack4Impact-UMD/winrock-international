import SvgIcon from "@mui/icons-material/CloseRounded";
import styles from "../css-modules/ProjectNotes.module.css";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

interface ProjectNotesProps {
	showingNotes: boolean;
	setShowingNotes: React.Dispatch<React.SetStateAction<boolean>>
	saveNotes: (notes: string) => Promise<void>; 
	projectId: string;
}

const ProjectNotes = ({ showingNotes, setShowingNotes, saveNotes, projectId }: ProjectNotesProps) => {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!showingNotes) return; // only fetch when opened
      setIsLoading(true);
      try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNotes(data.notes || "");
        } else {
          setNotes("");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [showingNotes, projectId]); // re-fetch whenever notes panel opens

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await saveNotes(notes);
    } catch (error) {
      console.error("Failed to save notes:", error);
      alert("Failed to save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.notesPanel} style={{ width: showingNotes ? "400px" : "0" }}>
      <div className={styles.headerCont}>
        <h2 className={styles.notesTitle}>Notes</h2>
        <SvgIcon onClick={() => setShowingNotes(false)} style={{ cursor: "pointer" }} />
      </div>

      <div className={styles.textboxContainer}>
        {isLoading ? (
          <p>Loading notes...</p>
        ) : (
          <textarea
            className={styles.notesTextbox}
            placeholder="Write your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        )}
      </div>

      <div className={styles.saveButtonContainer}>
        <button className={styles.saveButton} onClick={handleSaveNotes} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ProjectNotes;