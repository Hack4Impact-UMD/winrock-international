import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";
import styles from "../../css-modules/CoBenefitsDropdownQuestion.module.css";

interface CoBenefitsDropdownQuestionProps {
    label: string;
    options?: string[];
    controlledValues: string[];
    benefitItems?: string[];
    onSelect: (selected: string) => void;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function CoBenefitsDropdownQuestion({ label, options = ["Yes", "No", "Not Applicable"], controlledValues, benefitItems = [], onSelect, onChange, disabled = false }) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                controlledValue={controlledValues[0]}
                onSelect={(value) => onChange([value, controlledValues[1]])}
                required={true}
                disabled={disabled}
            />
            <div className={styles.benefitItemsContainer}>
                <p>If Yes, please describe how and how impactful</p>
                {benefitItems.map((item: string) => <p key={item}>{item}</p>)}
            </div>
            <TextQuestion
                label="" // ← unique label to avoid key collision
                controlledValue={controlledValues[1]}
                onChange={(value) => onChange([controlledValues[0], value])}
                removeTopPadding={true}
                disabled={disabled}
            />
        </>
    );
}

export default CoBenefitsDropdownQuestion;