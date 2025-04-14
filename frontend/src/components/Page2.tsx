// Page2.tsx
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

const Page2 = () => {
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
                <SectionHeader label="Evidentiary Documentation Checklist" />
                
                <p>
                    This checklist represents information that will need to be gathered over the course of the project validation process. ***This information does not necessarily need to be provided by suppliers when the project form is initially submitted to your procurement manager. Filling out the "Project Submission Form" tab will be enough to trigger the commencement of the project validation process.***
When suppliers fill out this checklist, the documentation can be attached on a separate tab, provided as a link in column I of this spreadsheet, or emailed along with this spreadsheet workbook. The following table provides a checklist of documents that will help our Technical Advisor evaluate the project. If you have any questions about the documents listed below, please refer to Nestlé's Renewable Energy FAQ, which is linked in the Guidance tab of this workbook.
                </p>
            </div>
        </div>
    );
};

export default Page2;
