import SvgIcon from "@mui/icons-material/CloseRounded";
import styles from "../css-modules/ProjectNotes.module.css";

interface ProjectNotesProps {
	showingNotes: boolean;
	setShowingNotes: React.Dispatch<React.SetStateAction<boolean>>
}

const ProjectNotes = ({ showingNotes } : ProjectNotesProps) => {
	return (
		<div className={styles.notesPanel} style={{ width: showingNotes ? "400px" : "0"}}>
			<div className={styles.headerCont}>
				<h2 className={styles.notesTitle}>Notes</h2>
				<SvgIcon></SvgIcon>
			</div>
		</div>
	);

}

export default ProjectNotes;