
import styles from "./Dropdown.module.css"

export interface DropdownProps {
	question: string
}

export const Dropdown = (props: DropdownProps) => {

	return (
		<div>
			<h3 className={styles.question}>{props.question}</h3>
		</div>
	);
}