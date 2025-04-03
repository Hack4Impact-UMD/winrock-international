import DropdownQuestion from "./DropdownQuestion";
import TextQuestion from "./TextQuestion";
import styles from "../../css-modules/CoBenefitsDropdownQuestion.module.css";

interface CoBenefitsDropdownQuestionProps {
    label: string;
    options?: string[];
    benefitItems: string[];
	onSelect: (selected: string) => void;
    onChange: (value: string) => void;
}

function CoBenefitsDropdownQuestion({ label, options=["Yes", "No", "Not Applicable"], benefitItems, onSelect, onChange }: CoBenefitsDropdownQuestionProps) {
    return (
        <>
            <DropdownQuestion
                label={label}
                options={options}
                onSelect={onSelect}
                required={true}
            />

            <div className={styles.benefitItemsContainer}>
                <p>(If Yes, please describe how and how impactful)</p>
                {benefitItems.map((item: string) => <p>{item}</p>)}
            </div>
            <TextQuestion
                label=""
                onChange={onChange}
                removeTopPadding={true}
            />
        </>
    )
}

export default CoBenefitsDropdownQuestion;