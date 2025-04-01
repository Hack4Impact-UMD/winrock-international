import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";

interface RisksDropdownQuestionProps {
	label: string;
	options?: string[];
	onSelect: (selected: string) => void;
    onChange: (value: string) => void;
}

function RisksDropdownQuestion({ label, options=['Yes', 'No', 'Not Applicable'], onSelect, onChange }: RisksDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                onSelect={onSelect}
                required={true}
            />
            <TextQuestion
                label="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                onChange={onChange}
                required={true}
            />
        </>
    )
}

export default RisksDropdownQuestion;