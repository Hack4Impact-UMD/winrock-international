import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";

interface RisksDropdownQuestionProps {
    label: string;
    options?: string[];
    controlledValues: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
}

function RisksDropdownQuestion({
    label,
    options = ["Yes", "No", "Not Applicable"],
    controlledValues = ["", ""],
    onChange,
    disabled = false
}: RisksDropdownQuestionProps) {

    const [dropdownValue = "", textValue = ""] = controlledValues;

    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                controlledValue={dropdownValue}
                onSelect={(value) => onChange([value, textValue])}
                required={true}
                disabled={disabled}
            />

            <TextQuestion
                label="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                controlledValue={textValue}
                onChange={(value) => onChange([dropdownValue, value])}
                required={true}
                disabled={disabled}
            />
        </>
    );
}

export default RisksDropdownQuestion;