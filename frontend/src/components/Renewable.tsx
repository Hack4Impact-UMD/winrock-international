import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Correctly import useNavigate

import Dropdown from "./Dropdown";
import LogoHeader from "./LogoHeader";
import NavigationButtons from "./NavigationButtons";
import SectionHeader from "./SectionHeader";
import TextQuestion from "./TextQuestion";
import TitleHeader from "./TitleHeader";
import ProgressBar from "./Progressbar";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import styles from "../css-modules/AgricultureForm.module.css";
import GuidanceDropdown from "./GuidanceDropdown";  

const Renewable = () => {
    const navigate = useNavigate(); // Initialize the navigate function using useNavigate()

    const [dropdownResponses, setDropdownResponses] = useState<{ [key: string]: string }>({});

    const handleSelect = (id: string, response: string) => {
        setDropdownResponses({
            ...dropdownResponses,
            [id]: response
        });
    };

    async function saveDropdowns() {
        for (const dropdownId in dropdownResponses) {
            await setDoc(doc(db, "ag-form-testing", dropdownId), {
                id: dropdownId,
                response: dropdownResponses[dropdownId]
            });
        }
    }
    const goToNextPage = () => {
        // Navigate to Page 2 when the "Next" button is clicked
        navigate('/page2');
    };

    return (
        <div className={styles.formContainer}>
            <LogoHeader />
            <TitleHeader
                title="Renewable Energy Project Proposal Form"
                description="Please focus on the top 80% of Energy Sources used linked to volume supplied to Nestlé. If you haven't done any Renewable Electricity/Energy Intervention, please list total energy usage in kWh linked to Nestlé supply per site."
            />
            <ProgressBar currentPage={1} totalPages={2} pageLabels={["Proposal Form (Page 1)", "Proposal Form (Page 2)"]} />
            <GuidanceDropdown />
            <div className={styles.section}>
                <SectionHeader label="Generic Information" />
                <div className={styles.questionscontainer}>
                    <TextQuestion
                        name="1. Parent Vendor Name"
                        response=""
                    />
                    <TextQuestion
                        name="2. Vendor Code"
                        response=""
                    />
                    <TextQuestion
                        name="3. Vendor Site SAP Name"
                        response=""
                    />
                    <Dropdown
                        id="spendCategory"
                        question="4. Spend Category"
                        options={["Ingredients", "Commodities", "Packaging", "Logistics"]}
                        onSelect={(selected: string) => handleSelect("spendCategory", selected)}
                    />
                    <Dropdown
                        id="level2Category"
                        question="5. Level 2 Category"
                        options={["Amino-acids", "Cereals & Grains", "Flexibles", "Warehouse Services"]}
                        onSelect={(selected: string) => handleSelect("level2Category", selected)}
                    />
                    <TextQuestion
                        name="6. Vendor Site Country"
                        response=""
                    />
                    <TextQuestion
                        name="7. Vendor Site City"
                        response=""
                    />
                    <Dropdown
                        id="projectType"
                        question="8. Project Type"
                        options={["Project A", "Project B", "Project C"]}
                        onSelect={(selected: string) => handleSelect("projectType", selected)}
                    />
                    <TextQuestion
                        name="Please describe specific project activities."
                        response=""
                    />
                    <TextQuestion
                        name="9. Project Implementation Year"
                        response=""
                    />
                    <Dropdown
                        id="evidenceImpact"
                        question="10. How do you plan to evidence the project impact?"
                        options={["Project implementation partner (2nd/3rd party)", "Electronic metering tool", "Other (please describe)"]}
                        onSelect={(selected: string) => handleSelect("evidenceImpact", selected)}
                    />
                    <TextQuestion
                        name="If other, please describe."
                        response=""
                    />
                    <TextQuestion
                        name="11. Volume of Material - Delivered to Nestlé in 2022 (Tons = Metric Tons)"
                        response=""
                    />
                </div>
            </div>

            {/* Energy Consumption: Before Intervention */}
            <div className={styles.section}>
                <SectionHeader label="Energy Consumption: Before Intervention" />
                <div className={styles.questionscontainer}>
                    <Dropdown
                        id="sourceEnergyBefore"
                        question="12. Source of Energy"
                        options={["Coal", "Natural Gas", "Electricity grid"]}
                        onSelect={(selected: string) => handleSelect("sourceEnergyBefore", selected)}
                    />
                    <TextQuestion
                        name="13. Energy Consumption (KWh/year) - estimate for Nestlé share only"
                        response=""
                        className={styles.redText} // Added red text class
                    />
                    <TextQuestion
                        name="14. Emission Factor of Energy BEFORE Intervention (kgCO2 per KWh)"
                        response=""
                        className={styles.redText} // Added red text class
                    />
                </div>
            </div>

            {/* Energy Consumption: After Intervention */}
            <div className={styles.section}>
                <SectionHeader label="Energy Consumption: After Intervention is Completed" />
                <div className={styles.questionscontainer}>
                    <Dropdown
                        id="sourceEnergyAfter"
                        question="15. Source of Energy"
                        options={["Biogas / green gas  - grid (external)", "Solar", "Renewable Electricity Certificate"]}
                        onSelect={(selected: string) => handleSelect("sourceEnergyAfter", selected)}
                    />
                    <TextQuestion
                        name="16. Energy Consumption 2 (KWh/year) - estimate for Nestlé share only"
                        response=""
                        className={styles.redText} // Added red text class
                    />
                    <TextQuestion
                        name="17. Emission Factor of Energy AFTER Intervention (kgCO2 per KWh)"
                        response=""
                        className={styles.redText} // Added red text class
                    />
                </div>
            </div>

            {/* Comments/ Remarks */}
            <div className={styles.section}>
                <SectionHeader label="Comments/ Remarks" />
                <div className={styles.questionscontainer}>
                    <TextQuestion
                        name="18. Source of Emission Factor (Please refer to your answer from Questions 14 and 17 - Energy Consumption before and after intervention)"
                        response=""
                    />
                </div>
            </div>

            {/* Impact Section - New Addition */}
            <div className={styles.section}>
                <SectionHeader label="Impact" />
                <div className={styles.questionscontainer}>
                    <Dropdown
                        id="sourceEnergyImpact"
                        question="19. Source of Energy"
                        options={["Biogas / green gas  - grid (external)", "Solar", "Renewable Electricity Certificate"]}
                        onSelect={(selected: string) => handleSelect("sourceEnergyImpact", selected)}
                    />
                    <TextQuestion
                        name="20. Impact Reduction On GHG Emission After Intervention - Attribute to Nestlé only (tonsCO2e) based on an annualized impact"
                        response=""
                        className={styles.redText} // Added red text class
                    />
                    <TextQuestion
                        name="21. Impact Timing"
                        response=""
                    />
                </div>
            </div>
            <NavigationButtons onSaveChanges={saveDropdowns} onSaveAndExit={saveDropdowns} onNext={goToNextPage} />

        </div>
    );
};

export default Renewable;
