import { useState } from "react";
import { DropdownProps } from "./Dropdown";
import styles from "../css-modules/AddDropdown.module.css";

interface AddDropdownProps {
    onAdd: (props: DropdownProps) => void,
	handleSelect: (dropdownId: string, value: string) => void
}

const AddDropdown = (props: AddDropdownProps) => {
	const [qId, setQId] = useState("");
    const [qTitle, setQTitle] = useState("");
    const [qOption1, setQOption1] = useState("");
	const [qOption2, setQOption2] = useState("");
	const [qOption3, setQOption3] = useState("");

    return (
        <div className={styles.addDropdownCont}>
			<input
                placeholder="Question id" value={qId}
                onChange={(event) => setQId(event.target.value)}
            ></input>
            <input
                placeholder="Question title" value={qTitle}
                onChange={(event) => setQTitle(event.target.value)}
            ></input>
            <div className={styles.dropdownOptionsCont}>
                <input
                    placeholder="Option 1" value={qOption1}
                    onChange={(event) => setQOption1(event.target.value)}
                ></input>
				<input
                    placeholder="Option 2" value={qOption2}
                    onChange={(event) => setQOption2(event.target.value)}
                ></input>
				<input
                    placeholder="Option 3" value={qOption3}
                    onChange={(event) => setQOption3(event.target.value)}
                ></input>
            </div>
            <button
                onClick={() =>
				{
					setQId("");
					setQTitle("");
					setQOption1("");
					setQOption2("");
					setQOption3("");
                    props.onAdd({
                        id: qId,
                        question: qTitle,
                        options: [qOption1, qOption2, qOption3],
						onSelect: (value) => props.handleSelect(qId, value)
                    })
				}
                }
            >
                Add Question
            </button>
        </div>
    );
};

export default AddDropdown;
