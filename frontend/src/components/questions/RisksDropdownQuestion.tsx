import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";

interface RisksDropdownQuestionProps {
	label: string;
	options: string[];
	isRequired?: boolean;
	onSelect: (selected: string) => void;
    onChange: (value: string) => void;
}

function RisksDropdownQuestion({ label, options, isRequired, onSelect, onChange }: RisksDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                isRequired={isRequired ? isRequired : undefined}
                onSelect={onSelect}
            />
            <TextQuestion
                label="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                onChange={onChange}
            />
        </>
    )
}

export default RisksDropdownQuestion;