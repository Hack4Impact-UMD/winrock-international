import { useState } from "react";
import styles from "../css-modules/Dropdown.module.css"
import chevron from "../assets/chevron-up-svgrepo-com.svg"

export interface DropdownProps {
	id: string,
	question: string,
	options: string[],
	onSelect: (selected: string) => void
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
		props.onSelect(option);
	};

	return (
		<div className={styles.dropdownContainer}>
			<h3 className={styles.question}>{props.question}</h3>
			<button
				className={styles.dropdownButton}
				onClick={toggleDropDown}
			>
				<p>{selectedOption || "Select"}</p>
				<img src={chevron} className={styles.chevron} style={{rotate: showDropdown ? "0deg" : "180deg"}}></img>
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