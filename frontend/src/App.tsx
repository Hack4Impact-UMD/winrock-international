import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import Dropdown, { DropdownProps } from "./components/Dropdown";
import AddDropdown from "./components/AddDropdown";
import "./App.css";

function App() {
    const [dropdowns, setDropdowns] = useState<DropdownProps[]>([]);

	const [selectedValues, setSelectedValues] = useState<{ [key: string]: string | null }>({
		
	});

	// Update function that dynamically updates the selected value for each dropdown
	const handleSelect = (dropdownId: string, value: string) => {
		setSelectedValues((prevValues) => ({
			...prevValues,
			[dropdownId]: value,
		}));
	};

	async function submitDropdownValues(values: { [key: string] : string | null }) {

		for (const dropdownId in values) {
			console.log(dropdownId, values[dropdownId])
			await setDoc(doc(db, "ag-form-testing", dropdownId), {
				response: values[dropdownId]
			});
		}

	}

    return (
        <>
            <AddDropdown
                onAdd={(props: DropdownProps) => 
                    setDropdowns([...dropdowns, props])
				
                }
				handleSelect={handleSelect}
            />

            {dropdowns.map((question) => (
                <>
                    <Dropdown
                        id={question.id}
                        question={question.question}
                        options={question.options}
						onSelect={(value) => handleSelect(question.id, value)}
                    />
                </>
            ))}

		<div>
			<h2>Selected Values:</h2>
			{dropdowns.map((dropdown) => <p>{selectedValues[dropdown.id]}</p>)}
			
		</div>

			<button onClick={() => submitDropdownValues(selectedValues)}>submit</button>
        </>
    );
}

export default App;
