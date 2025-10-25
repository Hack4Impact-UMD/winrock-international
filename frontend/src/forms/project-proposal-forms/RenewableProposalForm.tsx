import { useState, useRef } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import LogoHeader from "../components/headers/LogoHeader.js";
import TitleHeader from "../components/headers/TitleHeader.js";
import ProgressBar from "../components/ProgressBar.js";
import SectionHeader from "../components/headers/SectionHeader.js";
import TextQuestion from "../components/questions/TextQuestion.js";
import DropdownQuestion from "../components/questions/DropdownQuestion.js";
import NavigationButtons from "../components/NavigationButtons.js";
import ConfirmationPage from "../ConfirmationPage.js";
import Error from "../components/Error.js";
import FormField from "../FormField.tsx";
import GuidanceDropdown from "../components/GuidanceDropdown.tsx";
import FormLock from "../components/FormLock.js";
import tableImage from '../../assets/table.png';

interface RenewableProposalFormData {
    parentVendorName: FormField;
    vendorCode: FormField;
    vendorSiteSAPName: FormField;
    spendCategory: FormField;
    level2Category: FormField;
    vendorSiteCity: FormField;
    vendorSiteCountry: FormField;
    projectType: FormField;
    projectDescription: FormField;
    projectImplementationYear: FormField;
    impactEvidence: FormField;
    volumeDelivered: FormField;
    beforeSourceOfEnergy: FormField;
    beforeEnergyConsumption: FormField;
    beforeEmissionFactor: FormField;
    afterSourceOfEnergy: FormField;
    afterEnergyConsumption: FormField;
    afterEmissionFactor: FormField;
    impactReduction: FormField;
    impactTiming: FormField;
    sourceEmissionFactor: FormField;
    sourceEnergy: FormField;
}

const RenewableProposalForm = () => {
    const title = "Renewable Energy Project Proposal Form";
    
    // TODO: Lock flag - set to true to prevent form editing
    const locked = true;
    
    const [currentPage, setCurrentPage] = useState(1); // Start on Page 1
    const totalPages = 2; // Set totalPages to 2 since we have two pages

    const collectionID = "project-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const answersRef = useRef<RenewableProposalFormData>({
        parentVendorName: new FormField('', true),
        vendorCode: new FormField('', true),
        vendorSiteSAPName: new FormField('', true),
        spendCategory: new FormField('', true),
        level2Category: new FormField('', true),
        vendorSiteCity: new FormField('', true),
        vendorSiteCountry: new FormField('', true),
        projectType: new FormField('', true),
        projectDescription: new FormField('', true),
        projectImplementationYear: new FormField('', true),
        impactEvidence: new FormField('', true),
        volumeDelivered: new FormField('', true),
        beforeSourceOfEnergy: new FormField('', true),
        beforeEnergyConsumption: new FormField('', true),
        beforeEmissionFactor: new FormField('', true),
        afterSourceOfEnergy: new FormField('', true),
        afterEnergyConsumption: new FormField('', true),
        afterEmissionFactor: new FormField('', true),
        impactReduction: new FormField('', false),
        impactTiming: new FormField('', false),
        sourceEmissionFactor: new FormField('', false),
        sourceEnergy: new FormField('', true),
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Initialize form lock
    const { handleLockedAction, LockedPopup } = FormLock({ 
        locked, 
        projectId: "Project2" // TODO: Replace with actual projectId from form data or props
    });

    // Helper functions
    const handleChange = (field: keyof RenewableProposalFormData, value: string) => {
        if (locked) {
            handleLockedAction();
            return;
        }
        
        const isRequired = answersRef.current[field]!.isRequired;
        answersRef.current = {
            ...answersRef.current,
            [field]: new FormField(value, isRequired),
        };
        // Auto-save whenever form changes
        saveChanges();
    };

    // Handling form submission
    const handleSubmit = async () => {
        for (const [_, v] of Object.entries(answersRef.current)) {
            if (v.isRequired && v.value === '') {
                setError("Cannot submit: You have not completed one or more sections in the form");
                return;
            }
        }

        const submissionObj: Record<string, string> = {};
        Object.keys(answersRef.current).forEach((field) => {
            submissionObj[field] = answersRef.current[field as keyof RenewableProposalFormData]!.value;
        });

        try {
            await firestore.addDoc(collectionRef, submissionObj);
            setIsSubmitted(true);
        } catch (error) {
            setError("Server error. Please try again later.");
        }
    };

    const saveChanges = () => {
        // TODO: Implement save functionality
        console.log('Changes saved');
    }

    // Navigate to Confirmation Page
    if (isSubmitted) {
        return <ConfirmationPage formName={title} />;
    }

    return (
        <>
            <LogoHeader />
            <TitleHeader title={title} description="Please only focus on the top 80% of Energy Sources used linked to volume supplied to Nestlé (- if your number of sites do not fit on this spreadsheet, please use multiple Excel files). If you have not done any Renewable Electricity/Energy Intervention - please list total energy usage in kWh linked to Nestlé supply per site instead (see example row 11 for one site)" />


            {/* Page 1 Content */}
            {currentPage === 1 ? (

                <div>
                    <ProgressBar currentPage={currentPage} totalPages={totalPages} pageLabels={["Proposal Form (Page 1)", "Proposal Form (Page 2)"]} />
                    <GuidanceDropdown />
                    <SectionHeader label="Generic Information" />
                    <TextQuestion label="1. Parent Vendor Name" controlledValue={answersRef.current.parentVendorName.value} onChange={(value) => handleChange("parentVendorName", value)} required={true} size="small" />
                    <TextQuestion label="2. Vendor Code" controlledValue={answersRef.current.vendorCode.value} onChange={(value) => handleChange("vendorCode", value)} size="small" />
                    <TextQuestion label="3. Vendor Site SAP Name" controlledValue={answersRef.current.vendorSiteSAPName.value} onChange={(value) => handleChange("vendorSiteSAPName", value)} size="small" />
                    <DropdownQuestion label="4. Spend Category" options={["Ingredients", "Commodities", "Packaging", "Logistics"]} controlledValue={answersRef.current.spendCategory.value} onSelect={(value: string) => handleChange("spendCategory", value)} required={true} />
                    <DropdownQuestion label="5. Level 2 Category" options={["Amino Acids", "Cereals & Grains", "Flexibles", "Warehousing Services"]} controlledValue={answersRef.current.level2Category.value} onSelect={(value: string) => handleChange("level2Category", value)} required={true} />
                    <TextQuestion label="6. Vendor Site Country" controlledValue={answersRef.current.vendorSiteCountry.value} onChange={(value) => handleChange("vendorSiteCountry", value)} required={true} size="small" />
                    <TextQuestion label="7. Vendor Site City" controlledValue={answersRef.current.vendorSiteCity.value} onChange={(value) => handleChange("vendorSiteCity", value)} required={true} size="small" />


                    <DropdownQuestion
                        label="8. Project Type"
                        options={["Project A", "Project B", "Project C"]}
                        controlledValue={answersRef.current.projectType.value}
                        onSelect={(value) => handleChange("projectType", value)}
                        required={true}
                    />

                    <TextQuestion
                        label="Please describe specific project activities."
                        controlledValue={answersRef.current.projectDescription.value}
                        onChange={(value) => handleChange("projectDescription", value)}
                        required={true}
                        size="small"
                    />

                    <TextQuestion
                        label="9. Project Implementation Year"
                        controlledValue={answersRef.current.projectImplementationYear.value}
                        onChange={(value) => handleChange("projectImplementationYear", value)}
                        required={true}
                        size="small"
                    />

                    <DropdownQuestion
                        label="10. How do you plan to evidence the project impact?"
                        options={["Project implementation partner (2nd/3rd party)", "Electronic metering tool", "Other (please describe)"]}
                        controlledValue={answersRef.current.impactEvidence.value}
                        onSelect={(value) => handleChange("impactEvidence", value)}
                        required={true}
                    />

                    <TextQuestion
                        label="If other, please describe."
                        controlledValue={answersRef.current.impactEvidence.value}
                        onChange={(value) => handleChange("impactEvidence", value)}
                        size="small"
                    />

                    <TextQuestion
                        label="11. Volume of Material - Delivered to Nestlé in 2022 (Tons = Metric Tons)"
                        controlledValue={answersRef.current.volumeDelivered.value}
                        onChange={(value) => handleChange("volumeDelivered", value)}
                        required={true}
                        size="small"
                    />

                    {/* Energy Consumption Sections */}
                    <SectionHeader label="Energy Consumption: Before Intervention" />
                    <DropdownQuestion label="12. Source of Energy" options={["Coal", "Natural Gas", "Electricity Grid"]} controlledValue={answersRef.current.beforeSourceOfEnergy.value} onSelect={(value) => handleChange("beforeSourceOfEnergy", value)} required={true} />
                    <TextQuestion label="13. Energy Consumption (KWh/year) - Before Intervention" controlledValue={answersRef.current.beforeEnergyConsumption.value} onChange={(value) => handleChange("beforeEnergyConsumption", value)} required={true} size="small" />
                    <TextQuestion label="14. Emission Factor of Energy (kgCO2/KWh) - Before Intervention" controlledValue={answersRef.current.beforeEmissionFactor.value} onChange={(value) => handleChange("beforeEmissionFactor", value)} size="small" />

                    <SectionHeader label="Energy Consumption: After Intervention is Completed" />
                    <DropdownQuestion label="15. Source of Energy" options={["Biogas/Green Gas", "Solar", "Renewable Electricity Certificate"]} controlledValue={answersRef.current.afterSourceOfEnergy.value} onSelect={(value) => handleChange("afterSourceOfEnergy", value)} />
                    <TextQuestion label="16. Energy Consumption (KWh/year) - After Intervention" controlledValue={answersRef.current.afterEnergyConsumption.value} onChange={(value) => handleChange("afterEnergyConsumption", value)} size="small" />
                    <TextQuestion label="17. Emission Factor of Energy (kgCO2/KWh) - After Intervention" controlledValue={answersRef.current.afterEmissionFactor.value} onChange={(value) => handleChange("afterEmissionFactor", value)} size="small" />

                    {/* New Questions for Page 1 */}
                    <SectionHeader label="Comments/ Remarks" />
                    <TextQuestion label="18. Source of Emission Factor" controlledValue={answersRef.current.sourceEmissionFactor.value} onChange={(value) => handleChange("sourceEmissionFactor", value)} required={true} size="small" />
                    <SectionHeader label="Impact" />
                    <DropdownQuestion label="19. Source of Energy" options={["Coal", "Natural Gas", "Electricity Grid"]} controlledValue={answersRef.current.sourceEnergy.value} onSelect={(value) => handleChange("sourceEnergy", value)} required={true} />
                    <TextQuestion label="20. Impact Reduction On GHG EmissionAfter Intervention" controlledValue={answersRef.current.impactReduction.value} onChange={(value) => handleChange("impactReduction", value)} required={true} size="small" />
                    <TextQuestion label="21. Impact Timing" controlledValue={answersRef.current.impactTiming.value} onChange={(value) => handleChange("impactTiming", value)} size="small" />

                </div>
            ) : (
                // Page 2 Content
                <div>
                    <ProgressBar currentPage={currentPage} totalPages={totalPages} pageLabels={["Proposal Form (Page 1)", "Proposal Form (Page 2)"]} />
                    <GuidanceDropdown />
                    <SectionHeader label="Evidentiary Documentation Checklist" />
                    <p style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'Neue Haas Grotesk Display Pro',
                        fontWeight: '500',
                        lineHeight: '24px',
                        letterSpacing: '0.48px',
                        wordWrap: 'break-word',
                        padding: '20px',
                        margin: '0 60px',
                    }}>
                        This checklist represents information that will need to be gathered over the course of the project validation process. ***This information does not necessarily need to be provided by suppliers when the project form is initially submitted to your procurement manager. Filling out the "Project Submission Form" tab will be enough to trigger the commencement of the project validation process.***
                        When suppliers fill out this checklist, the documentation can be attached on a separate tab, provided as a link in column I of this spreadsheet, or emailed along with this spreadsheet workbook. The following table provides a checklist of documents that will help our Technical Advisor evaluate the project. If you have any questions about the documents listed below, please refer to Nestlé's Renewable Energy FAQ, which is linked in the Guidance tab of this workbook.
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img
                            src={tableImage}
                            alt="Evidentiary Documentation Table"
                            style={{ width: '100%', maxWidth: '1200px' }}
                        />
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <NavigationButtons
                onNext={() => {
                    if (locked) {
                        handleLockedAction();
                        return;
                    }
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1); // Update page when Next is clicked
                    } else {
                        handleSubmit();
                    }
                }}
                onBack={() => {
                    if (locked) {
                        handleLockedAction();
                        return;
                    }
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1); // Update page when Back is clicked
                    }
                }}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            />

            <Error message={error} />

            {/* Locked Form Popup */}
            {LockedPopup}
        </>
    );
};

export default RenewableProposalForm;
