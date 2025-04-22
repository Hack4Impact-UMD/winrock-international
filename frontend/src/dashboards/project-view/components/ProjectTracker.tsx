import styles from "../css-modules/ProjectTracker.module.css"
import notStarted from "../assets/stage-not-started.svg"
import inProgress from "../assets/stage-in-progress.svg"
import completed from "../assets/stage-completed.svg"
import dottedLine from "../assets/dotted-line.svg"

interface ProjectTrackerProps {
	currentStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded' | 'Clarifying Technical Details';
	initialInfoStatus: "not-started" | "in-progress" | "completed";
	technicalStatus: "not-started" | "in-progress" | "completed";
	ghgStatus: "not-started" | "in-progress" | "completed";
	risksStatus: "not-started" | "in-progress" | "completed";
	finalStatus: "not-started" | "in-progress" | "completed";
}

const ProjectTracker = (props: ProjectTrackerProps) => {

	const getStatusIcon = (statusNum: number) => {

		let status = "";

		if (statusNum === 0) {
			status = props.initialInfoStatus;
		}
		else if (statusNum === 1) {
			status = props.technicalStatus;
		}
		else if (statusNum === 2) {
			status = props.ghgStatus;
		}
		else if (statusNum === 3) {
			status = props.finalStatus;
		}
		else if (statusNum === 4) {
			status = props.risksStatus
		}
		else {
			if (props.initialInfoStatus === "completed" && props.technicalStatus === "completed" && props.ghgStatus === "completed" && props.finalStatus === "completed") {
				return <img src={completed}></img>;
			}
			else {
				return <img src={notStarted}></img>;
			}
		}

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

				<h2>Project Tracker</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Clarifying Initial Project Information" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(0)}
				<h2>Clarifying Initial Project Information</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Clarifying Technical Details" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(1)}
				<h2>Clarifying Technical Details</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "GHG Assessment Analysis" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(2)}
				<h2>GHG Assessment Analysis</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Confirming Final Requirements" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(3)}
				<h2>Confirming Final Requirements</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Risk & Co-benefit Assessment" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(4)}
				<h2>Risks & Co-Benefits Assessment</h2>
			</div>
			<div className={`${styles.stageCont} ${props.currentStage === "Complete, and Excluded" ? styles.currentStageCont : ""}`}>
				{getStatusIcon(5)}
				<h2>Project Completed</h2>
			</div>
		</div>
	);
}

export default ProjectTracker;