import { useState } from "react";;
import styles from "../../css-modules/DropdownQuestion.module.css";
import chevron from "../../assets/chevron-up-svgrepo-com.svg";

interface DropdownQuestionProps {
	label: string;
	options: string[];
	onSelect: (selected: string) => void;
	required?: boolean;
}

const DropdownQuestion = ({ label, options, onSelect, required = false }: DropdownQuestionProps) => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const toggleDropdownQuestion = () => {
		setShowDropdown(!showDropdown);
	};

	const selectOption = (option: string) => {
		setSelectedOption(option);
		setShowDropdown(false);
		onSelect(option);
	};

	return (
		<div className={styles.dropdownQuestion}>
			<h3 className={`${styles.label} ${required ? styles.required : ""}`}>
				{label}
			</h3>
			<button
				className={styles.dropdownButton}
				onClick={toggleDropdownQuestion}
			>
				<p>{selectedOption || "Select an option"}</p>
				<img src={chevron} className={styles.chevron} style={{rotate: showDropdown ? "0deg" : "180deg"}}></img>
			</button>

			{showDropdown && (
				<div className={styles.dropdownMenu}>
					{options.map((option) => (
						<div
							key={option}
							className={styles.dropdownItem}
							onClick={() => selectOption(option)}
						>
							{option}
						</div>
					))}
				</div>
			)}

		</div>
	);
};

export default DropdownQuestion;