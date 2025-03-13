import { useState } from "react";
import "./App.css";
import Dropdown, { DropdownProps } from "./components/Dropdown";
import AddDropdown from "./components/AddDropdown";

function App() {
    const [dropdowns, setDropdowns] = useState<DropdownProps[]>([]);

    return (
        <>
            <AddDropdown
                onAdd={(props: DropdownProps) =>
                    setDropdowns([...dropdowns, props])
                }
            />

            {dropdowns.map((question) => (
                <>
                    <Dropdown
                        id={question.id}
                        question={question.question}
                        options={question.options}
                    />
                </>
            ))}
        </>
    );
}

export default App;
