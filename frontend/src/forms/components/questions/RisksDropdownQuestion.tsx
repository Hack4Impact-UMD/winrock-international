import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";
interface RisksDropdownQuestionProps {
    label: string;
    options?: string[];
    controlledValues: string[];
    onSelect?: (selected: string) => void;  // make optional since it's unused
    onChange: (values: string[]) => void;   // fix: array not string
    disabled?: boolean;
    benefitItems?: string[];                // add this to prevent never[] conflict
}

function RisksDropdownQuestion({ label, options = ['Yes', 'No', 'Not Applicable'], controlledValues, onChange, disabled = false }: RisksDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                controlledValue={controlledValues[0]}
                onSelect={(value) => onChange([value, controlledValues[1]])}  // fix: pass array
                required={true}
                disabled={disabled}
            />
            <TextQuestion
                label="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                controlledValue={controlledValues[1]}
                onChange={(value) => onChange([controlledValues[0], value])}  // fix: pass array
                required={true}
                disabled={disabled}
            />
        </>
    );
}

export default RisksDropdownQuestion;