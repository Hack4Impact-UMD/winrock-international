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
}

function CoBenefitsDropdownQuestion({ label, options=["Yes", "No", "Not Applicable"], controlledValues, benefitItems=[], onSelect, onChange }: CoBenefitsDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                controlledValue={controlledValues[0]}
                onSelect={onSelect}
                required={true}
            />

            <div className={styles.benefitItemsContainer}>
                <p>(If Yes, please describe how and how impactful)</p>
                {benefitItems.map((item: string) =>
                    <p key={item}>{item}</p>
                )}
            </div>
            <TextQuestion
                label=""
                controlledValue={controlledValues[1]}
                onChange={onChange}
            />
        </>
    )
}

export default CoBenefitsDropdownQuestion;