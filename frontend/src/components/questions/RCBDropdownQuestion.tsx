import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";

interface RCBDropdownQuestionProps {
	label: string;
	options: string[];
	isRequired?: boolean;
	onSelect: (selected: string) => void;
    onChange: (value: string) => void;
}

function RCBDropdownQuestion({ label, options, isRequired, onSelect, onChange }: RCBDropdownQuestionProps) {
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

export default RCBDropdownQuestion;