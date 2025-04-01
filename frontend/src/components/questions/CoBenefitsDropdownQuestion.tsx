import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";

interface CoBenefitsDropdownQuestionProps {
    label: string;
    options?: string[];
	onSelect: (selected: string) => void;
    onChange: (value: string) => void;
}

function CoBenefitsDropdownQuestion({ label, options=["Yes", "No", "Not Applicable"], onSelect, onChange }: CoBenefitsDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                onSelect={onSelect}
                required={true}
            />
            <TextQuestion
                label="If yes, please describe how and how impactful."
                onChange={onChange}
            />
        </>
    )
}

export default CoBenefitsDropdownQuestion;