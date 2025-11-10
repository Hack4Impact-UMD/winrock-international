import styles from "../css-modules/ProjectTracker.module.css"
import notStarted from "../assets/stage-not-started.svg"
import inProgress from "../assets/stage-in-progress.svg"
import completed from "../assets/stage-completed.svg"
import dottedLine from "../assets/dotted-line.svg"

interface ProjectTrackerProps {
	currentStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded' | 'Clarifying Technical Details';
}

const ProjectTracker = (props: ProjectTrackerProps) => {

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
		const currentStageIndex = stages.indexOf(props.currentStage);

		// If project is completed, all stages are completed
		if (props.currentStage === "Complete, and Excluded") {
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
		<div className={styles.container}>
			<div className={styles.lineCont}>
				<img src={dottedLine} style={{top: "calc(4rem + 20px)"}}></img>
				<img src={dottedLine} style={{top: "calc(4rem + 95px)"}}></img>
				<img src={dottedLine} style={{top: "calc(4rem + 170px)"}}></img>
				<img src={dottedLine} style={{top: "calc(4rem + 245px)"}}></img>
				<img src={dottedLine} style={{top: "calc(4rem + 320px)"}}></img>
			</div>
			<div className={styles.headerCont}>
				Project Tracker
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Clarifying Initial Project Information" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(0)}
				Clarifying Initial Project Information
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Clarifying Technical Details" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(1)}
				Clarifying Technical Details
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "GHG Assessment Analysis" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(2)}
				GHG Assessment Analysis
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Confirming Final Requirements" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(3)}
				Confirming Final Requirements
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Risk & Co-benefit Assessment" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(4)}
				Risks & Co-Benefits Assessment
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Complete, and Excluded" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(5)}
				Project Completed
			</div>
		</div>
	);
}

export default ProjectTracker;