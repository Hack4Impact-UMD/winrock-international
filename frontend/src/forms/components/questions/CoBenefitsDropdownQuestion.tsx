import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";
import styles from "../../css-modules/CoBenefitsDropdownQuestion.module.css";

interface CoBenefitsDropdownQuestionProps {
    label: string;
    options?: string[];
    controlledValues: string[];
    benefitItems?: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
}

function CoBenefitsDropdownQuestion({
    label,
    options = ["Yes", "No", "Not Applicable"],
    controlledValues = ["", ""],
    benefitItems = [],
    onChange,
    disabled = false
}: CoBenefitsDropdownQuestionProps) {

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

            <div className={styles.benefitItemsContainer}>
                <p>If Yes, please describe how and how impactful</p>
                {benefitItems.map((item) => (
                    <p key={item}>{item}</p>
                ))}
            </div>

            <TextQuestion
                label=""
                controlledValue={textValue}
                onChange={(value) => onChange([dropdownValue, value])}
                removeTopPadding={true}
                disabled={disabled}
            />
        </>
    );
}

export default CoBenefitsDropdownQuestion;