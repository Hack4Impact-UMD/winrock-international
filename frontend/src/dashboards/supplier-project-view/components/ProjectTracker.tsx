import styles from "../css-modules/ProjectTracker.module.css"
import notStarted from "../assets/stage-not-started.svg"
import inProgress from "../assets/stage-in-progress.svg"
import completed from "../assets/stage-completed.svg"
import dottedLine from "../assets/dotted-line.svg"

interface ProjectTrackerProps {
	currentStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded' | 'Clarifying Technical Details';
	showingNotes: boolean;
}

const ProjectTracker = ({ currentStage, showingNotes }: ProjectTrackerProps) => {

	// Define the stages in order
	const stages = [
		"Clarifying Initial Project Information",
		"Clarifying Technical Details",
		"GHG Assessment Analysis",
		"Confirming Final Requirements",
		"Risk & Co-benefit Assessment",
		"Complete, and Excluded"
	];

	const getStageStatus = (stageIndex: number): "not-started" | "in-progress" | "completed" => {
		const currentStageIndex = stages.indexOf(currentStage);

		// If project is completed, all stages are completed
		if (currentStage === "Complete, and Excluded") {
			return "completed";
		}

		// If stage is before current stage, it's completed
		if (stageIndex < currentStageIndex) {
			return "completed";
		}
		// If stage is the current stage, it's in-progress
		if (stageIndex === currentStageIndex) {
			return "in-progress";
		}
		// If stage is after current stage, it's not-started
		return "not-started";
	};

	const getStatusIcon = (statusNum: number) => {
		const status = getStageStatus(statusNum);

		if (status === "not-started") {
			return <img src={notStarted}></img>;
		}
		else if (status === "in-progress") {
			return <img src={inProgress}></img>;
		}
		else {
			return <img src={completed}></img>;
		}
	}

	return (
		<div className={styles.container} style={{ width: showingNotes ? "70px" : "300px" }}>
			{
				!showingNotes && 
				<div className={styles.headerCont}>
					Project Tracker
				</div>
			}
			<div className={styles.lineCont}>
				<img src={dottedLine}></img>
				<img src={dottedLine}></img>
				<img src={dottedLine}></img>
				<img src={dottedLine}></img>
				<img src={dottedLine}></img>
			</div>
			<div className={styles.iconCont}>
				{getStatusIcon(0)}
				{getStatusIcon(1)}
				{getStatusIcon(2)}
				{getStatusIcon(3)}
				{getStatusIcon(4)}
				{getStatusIcon(5)}
			</div>
			{ 
				!showingNotes && 
				<div className={styles.stagesCont}>
					<div className={`${styles.stage} ${currentStage === "Clarifying Initial Project Information" ? styles.currentStage : ""}`}>
						Clarifying Initial Project Information
					</div>
					<div className={`${styles.stage} ${currentStage === "Clarifying Technical Details" ? styles.currentStage : ""}`}>
						Clarifying Technical Details
					</div>
					<div className={`${styles.stage} ${currentStage === "GHG Assessment Analysis" ? styles.currentStage : ""}`}>
						GHG Assessment Analysis
					</div>
					<div className={`${styles.stage} ${currentStage === "Confirming Final Requirements" ? styles.currentStage : ""}`}>
						Confirming Final Requirements
					</div>
					<div className={`${styles.stage} ${currentStage === "Risk & Co-benefit Assessment" ? styles.currentStage : ""}`}>
						Risks & Co-Benefits Assessment
					</div>
					<div className={`${styles.stage} ${currentStage === "Complete, and Excluded" ? styles.currentStage : ""}`}>
						Project Completed
					</div>
				</div>
			}
			
		</div>
	);
}

export default ProjectTracker;