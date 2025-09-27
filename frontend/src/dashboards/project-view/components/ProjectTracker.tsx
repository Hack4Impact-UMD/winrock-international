import styles from "../css-modules/ProjectTracker.module.css"
import notStarted from "../assets/stage-not-started.svg"
import inProgress from "../assets/stage-in-progress.svg"
import completed from "../assets/stage-completed.svg"
import dottedLine from "../assets/dotted-line.svg"
import { ProjectStageInfo } from "../projectView"

const ProjectTracker = (props: ProjectStageInfo) => {

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
			if (props.initialInfoStatus === "completed" && props.technicalStatus === "completed" && props.ghgStatus === "completed" && props.finalStatus === "completed" && props.risksStatus === "completed") {
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