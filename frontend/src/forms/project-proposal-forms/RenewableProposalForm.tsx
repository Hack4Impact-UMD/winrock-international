import { useState, useEffect } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../testFirebaseConfig.js";

import LogoHeader from "../../components/headers/LogoHeader.js";
import TitleHeader from "../../components/headers/TitleHeader.js";
import ProgressBar from "../../components/ProgressBar.js";
import SectionHeader from "../../components/headers/SectionHeader.js";
import TextQuestion from "../../components/questions/TextQuestion.js";
import DropdownQuestion from "../../components/questions/DropdownQuestion.js";
import NavigationButtons from "../../components/NavigationButtons.js";
import ConfirmationPage from "../ConfirmationPage.js";

interface RenewableProposalFormData {
    // Generic Information
    parentVendorName: string;
    vendorCode: string;
    vendorSiteSAPName: string;
    spendCategory: string;
    level2Category: string;
    vendorSiteCity: string;
    vendorSiteCountry: string;
    projectType: string;
    projectDescription: string;
    projectImplementationYear: string;
    impactEvidence: string;
    emissionFactor: string;
    volumeDelivered: string;

    // Energy Consumption: Before Intervention
    beforeSourceOfEnergy: string;
    beforeEnergyConsumption: string;
    beforeEmissionFactor: string;

    // Energy Consumption: After Intervention is Completed
    afterSourceOfEnergy: string;
    afterEnergyConsumption: string;
    afterEmissionFactor: string;

    // Calculations
    impactReduction: string;
    impactTiming: string;
}

function RenewableProposalForm() {
    const title = "Renewable Energy Project Proposal Form"
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const collectionID = "renewable-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const [submissionObj, setSubmissionObj] = useState<RenewableProposalFormData>({
        parentVendorName: '',
        vendorCode: '',
        vendorSiteSAPName: '',
        spendCategory: '',
        level2Category: '',
        vendorSiteCountry: '',
        vendorSiteCity: '',
        projectType: '',
        projectDescription: '',
        projectImplementationYear: '',
        impactEvidence: '',
        emissionFactor: '',
        volumeDelivered: '',
        beforeSourceOfEnergy: '',
        beforeEnergyConsumption: '',
        beforeEmissionFactor: '',
        afterSourceOfEnergy: '',
        afterEnergyConsumption: '',
        afterEmissionFactor: '',
        impactReduction: '',
        impactTiming: ''
    });

    // Used for when the "other" option is selected in the impact evidence question
    const [displayImpactEvidenceTextQuestion, setDisplayImpactEvidenceTextQuestion] = useState(false);

    useEffect(() => {
        computeImpactReduction();
    }, [submissionObj.afterEnergyConsumption, submissionObj.beforeEmissionFactor, submissionObj.afterEmissionFactor]);

    useEffect(() => {
        computeImpactTiming();
    }, [submissionObj.projectImplementationYear]);

    /**
     * Sets impactReduction to the impact reduction after
     * intervention based on the annualized impact given
     * in the form.
     * 
     */
    function computeImpactReduction(): void {
        if (submissionObj.afterEnergyConsumption === '' || submissionObj.beforeEmissionFactor === ''
            || submissionObj.afterEmissionFactor === '') {
            return;
        }

        const impactReduction =
            (parseInt(submissionObj.afterEnergyConsumption)
            * (parseFloat(submissionObj.beforeEmissionFactor) - parseFloat(submissionObj.afterEmissionFactor))
            / 1000.0).toString();
        
        handleChange("impactReduction", impactReduction);
    }

    /**
     * Sets impactTiming to a string corresponding to the project
     * implementation's timing.
     */
    function computeImpactTiming(): void {
        if (submissionObj.projectImplementationYear === '') {
            return;
        }

        const maxReductionYear = new Date().getFullYear();
        const minReductionYear = maxReductionYear - 5;
        const year = parseInt(submissionObj.projectImplementationYear);
        
        let impactTiming: string;
        if (year < minReductionYear) {
            impactTiming = "Before Nestlé Baseline";
        } else if (year >= maxReductionYear + 1) {
            impactTiming = `Potential Reduction - ${maxReductionYear + 1} Onwards`;
        } else {
            impactTiming = `Reduction - ${minReductionYear}-${maxReductionYear}`;
        }

        handleChange("impactTiming", impactTiming);
    }
 
    // Used to change the submissionObj's fields dynamically
    function handleChange(field: keyof RenewableProposalFormData, value: string) {
        setSubmissionObj((prev: RenewableProposalFormData) => ({
            ...prev,
            [field]: value
        }));
    };

    const [isSubmitted, setIsSubmitted] = useState(false);
  
    /**
     * Insert a new RenewableProjectProposal document with the user-inputted
     * fields into the RenewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting RenewableProjectProposal", error);
        }
    }
  
    const saveChanges = () => {
        // TODO: localStorage?
        console.log('Changes saved');
    }

    const saveAndExit = () => {
        console.log('Changes saved and exiting');
    }

    if (isSubmitted) {
        return <ConfirmationPage formName={title} />
    }

    return (
        <>
            <LogoHeader />
            <TitleHeader
                title={title}
                description="This is an intake form for renewable energy and energy reduction projects to support Nestlé's
                             goal of achieving Net Zero GHG emissions by 2050."
            />

            <ProgressBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageLabels={["Proposal Form (Page 1/1)"]}
            />

            <SectionHeader label="Generic Information" />

            <TextQuestion
                label="Parent Vendor Name"
                onChange={(value) => handleChange("parentVendorName", value)}
                required={true}
            />

            <TextQuestion
                label="Vendor Code"
                onChange={(value) => handleChange("vendorCode", value)}
            />

            <TextQuestion
                label="Vendor Site SAP Name"
                onChange={(value) => handleChange("vendorSiteSAPName", value)}
            />

            <DropdownQuestion
                label="Spend Category"
                options={["Ingredients", "Commodities", "Packaging", "Logistics"]}
                onSelect={(value: string) => handleChange("spendCategory", value)}
                required={true}
            />

            <DropdownQuestion
                label="Level 2 Category"
                options={["Amino Acids", "Cereals & Grains", "Flexibles", "Warehousing Services"]}
                onSelect={(value: string) => handleChange("level2Category", value)}
                required={true}
            />

            <TextQuestion
                label="Vendor Site Country"
                onChange={(value: string) => handleChange("vendorSiteCountry", value)}
                required={true}
            />

            {/* This was a DropdownQuestion in the Excel form, but we changed it
                to a TextQuestion because we don't know the vendor cities. */}
            <TextQuestion
                label="Vendor Site City"
                required={true}
                onChange={(value: string) => handleChange("vendorSiteCity", value)}
            />

            <TextQuestion
                label="Project Type"
                onChange={(value: string) => handleChange("projectType", value)}
            />

            <TextQuestion
                label="Project Description"
                onChange={(value: string) => handleChange("projectDescription", value)}
            />

            <TextQuestion
                label="Project Implementation Year"
                onChange={(value: string) => handleChange("projectImplementationYear", value)}
            />

            <DropdownQuestion
                label="How do you plan to evidence the project impact?"
                options={["Project implementation partner (2nd/3rd party)", "Electronic metering tool", "Other (please describe)"]}
                onSelect={(value: string) => {
                    if (value === "Other (please describe)") {
                        handleChange("impactEvidence", "");
                        setDisplayImpactEvidenceTextQuestion(true);
                    } else {
                        handleChange("impactEvidence", value);
                        setDisplayImpactEvidenceTextQuestion(false);
                    }
                }}
            />
            {displayImpactEvidenceTextQuestion &&
                <TextQuestion
                    label=""
                    onChange={(value: string) => handleChange("impactEvidence", value)}
                />}

            <TextQuestion
                label="Please share any comments/remarks on the change in the source of energy (see below sections)"
                onChange={(value: string) => handleChange("emissionFactor", value)}
            />

            <TextQuestion
                label="Volume of Material (Metric Tons) Delivered to Nestlé in 2022"
                onChange={(value: string) => handleChange("volumeDelivered", value)}
                required={true}
            />

            <SectionHeader label="Energy Consumption: Before Intervention" />

            <DropdownQuestion
                label="Source of Energy (BEFORE Intervention)"
                options={["Coal", "Natural Gas", "Electricity Grid"]}
                onSelect={(value: string) => handleChange("beforeSourceOfEnergy", value)}
                required={true}
            />

            <TextQuestion
                label="Share an energy consumption (KWh/year) estimate for Nestlé only (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEnergyConsumption", value))}
                required={true}
            />

            <TextQuestion
                label="Emission Factor of Energy (kgCO2/KwH) (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEmissionFactor", value))}
            />

            <SectionHeader label="Energy Consumption: After Intervention is Completed" />

            <DropdownQuestion
                label="Source of Energy (AFTER Intervention)"
                options={["Biogas/Green Gas - Grid (external)", "Solar", "Renewable Electricity Certificate"]}
                onSelect={(value: string) => handleChange("afterSourceOfEnergy", value)}
            />

            <TextQuestion
                label="Share an energy consumption (KWh/year) estimate for Nestlé only (AFTER Intervention)"
                onChange={(value: string) => handleChange("afterEnergyConsumption", value)}
            />

            <TextQuestion
                label="Emission Factor of Energy (kgCO2/KwH) (AFTER intervention)"
                onChange={(value: string) => handleChange("afterEmissionFactor", value)}
            />

            <SectionHeader label="Calculations (Auto-Generated)" />

            <TextQuestion
                label="Impact reduction on GHG emission (tonsCO2e) (after intervention attributed to Nestlé only based on annualized impact).
                       Uses the formula [energy consumption after] / ([emission factor before] - [emission factor after]). Feel free to overwrite
                       this field."
                onChange={(value: string) => handleChange("impactReduction", value)}
                defaultValue={submissionObj.impactReduction}
            />

            <TextQuestion
                label="Impact Timing (based on Project Implementation Year)"
                onChange={(_: string) => {}}
                defaultValue={submissionObj.impactTiming}
                disableOverwrite={true}
            />

            <NavigationButtons
                onNext={() => {
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scroll(0, 0);
                    } else {
                        handleSubmit();
                    }
                }}
                onBack={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        window.scroll(0, 0);
                    }
                }}
                onSaveChanges={saveChanges}
                onSaveAndExit={saveAndExit}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            />
        </>
    );
}

export default RenewableProposalForm;