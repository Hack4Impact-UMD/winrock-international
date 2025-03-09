
import { useState } from "react";
import styles from "./Dropdown.module.css"

interface DropdownProps {
	question: string;
	options: string[];
}

const Dropdown = (props: DropdownProps) => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const toggleDropDown = () => {
		setShowDropdown(!showDropdown);
	};

	const selectOption = (option: string) => {
		setSelectedOption(option);
		setShowDropdown(false);
	};

	return (
		<div className={styles.dropdownContainer}>
			<h3 className={styles.question}>{props.question}</h3>
			<button
				className={styles.dropdownButton}
				onClick={toggleDropDown}
			>
				{selectedOption || "Select"}
			</button>

			{showDropdown && (
				<div className={styles.dropdownMenu}>
					{props.options.map((option) => (
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

export default Dropdown;