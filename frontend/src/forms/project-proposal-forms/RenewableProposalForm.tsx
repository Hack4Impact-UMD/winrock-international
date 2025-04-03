import { useState, useEffect } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../testFirebaseConfig.js";
import FormField from "../FormField.js";

import LogoHeader from "../../components/headers/LogoHeader.js";
import TitleHeader from "../../components/headers/TitleHeader.js";
import ProgressBar from "../../components/ProgressBar.js";
import SectionHeader from "../../components/headers/SectionHeader.js";
import TextQuestion from "../../components/questions/TextQuestion.js";
import DropdownQuestion from "../../components/questions/DropdownQuestion.js";
import NavigationButtons from "../../components/NavigationButtons.js";
import ConfirmationPage from "../ConfirmationPage.js";
import Error from "../../components/Error.js";

interface RenewableProposalFormData {
    // Generic Information
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
    emissionFactor: FormField;
    volumeDelivered: FormField;

    // Energy Consumption: Before Intervention
    beforeSourceOfEnergy: FormField;
    beforeEnergyConsumption: FormField;
    beforeEmissionFactor: FormField;

    // Energy Consumption: After Intervention is Completed
    afterSourceOfEnergy: FormField;
    afterEnergyConsumption: FormField;
    afterEmissionFactor: FormField;

    // Calculations
    impactReduction: FormField;
    impactTiming: FormField;
}

function RenewableProposalForm() {
    const title = "Renewable Energy Project Proposal Form"
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const collectionID = "renewable-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const [answers, setAnswers] = useState<RenewableProposalFormData>({
        parentVendorName: new FormField('', true),
        vendorCode: new FormField('', false),
        vendorSiteSAPName: new FormField('', false),
        spendCategory: new FormField('', true),
        level2Category: new FormField('', true),
        vendorSiteCountry: new FormField('', true),
        vendorSiteCity: new FormField('', true),
        projectType: new FormField('', false),
        projectDescription: new FormField('', false),
        projectImplementationYear: new FormField('', false),
        impactEvidence: new FormField('', false),
        emissionFactor: new FormField('', false),
        volumeDelivered: new FormField('', true),
        beforeSourceOfEnergy: new FormField('', true),
        beforeEnergyConsumption: new FormField('', true),
        beforeEmissionFactor: new FormField('', false),
        afterSourceOfEnergy: new FormField('', false),
        afterEnergyConsumption: new FormField('', false),
        afterEmissionFactor: new FormField('', false),
        impactReduction: new FormField('', false),
        impactTiming: new FormField('', false)
    });

    // Used for when the "other" option is selected in the impact evidence question
    const [displayImpactEvidenceTextQuestion, setDisplayImpactEvidenceTextQuestion] = useState(false);

    useEffect(() => {
        computeImpactReduction();
    }, [answers.afterEnergyConsumption, answers.beforeEmissionFactor, answers.afterEmissionFactor]);

    useEffect(() => {
        computeImpactTiming();
    }, [answers.projectImplementationYear]);

    /**
     * Sets impactReduction to the impact reduction after
     * intervention based on the annualized impact given
     * in the form.
     * 
     */
    function computeImpactReduction(): void {
        if (answers.afterEnergyConsumption.value === '' || answers.beforeEmissionFactor.value === ''
            || answers.afterEmissionFactor.value === '') {
            return;
        }

        const impactReduction =
            (parseInt(answers.afterEnergyConsumption.value)
            * (parseFloat(answers.beforeEmissionFactor.value) - parseFloat(answers.afterEmissionFactor.value))
            / 1000.0).toString();
        
        handleChange("impactReduction", impactReduction);
    }

    /**
     * Sets impactTiming to a string corresponding to the project
     * implementation's timing.
     */
    function computeImpactTiming(): void {
        if (answers.projectImplementationYear.value === '') {
            return;
        }

        const maxReductionYear = new Date().getFullYear();
        const minReductionYear = maxReductionYear - 5;
        const year = parseInt(answers.projectImplementationYear.value);
        
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
 
    // Used to change the answers fields dynamically
    function handleChange(field: keyof RenewableProposalFormData, value: string) {
        const isRequired = answers[field]!.isRequired;
        setAnswers((prev: RenewableProposalFormData) => ({
            ...prev,
            [field]: new FormField(value, isRequired)
        }));
    };

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
  
    /**
     * Insert a new RenewableProjectProposal document with the user-inputted
     * fields into the RenewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        for (const [_, v] of Object.entries(answers)) {
            if (v.isRequired && v.value === '') {
                setError("Cannot submit: You have not completed one or more sections in the form");
                return;
            }
        }
        
        // Convert the answers into a submission object
        const submissionObj: Record<string, string> = {}
        Object.keys(answers).forEach((field) => {
            submissionObj[field] = answers[field as keyof RenewableProposalFormData]!.value;
        });

        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting RenewableProjectProposal", error);
            setError("Server error. Please try again later.");
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
                size="small"
            />

            <TextQuestion
                label="Vendor Code"
                onChange={(value) => handleChange("vendorCode", value)}
                size="small"
            />

            <TextQuestion
                label="Vendor Site SAP Name"
                onChange={(value) => handleChange("vendorSiteSAPName", value)}
                size="small"
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
                size="small"
            />

            {/* This was a DropdownQuestion in the Excel form, but we changed it
                to a TextQuestion because we don't know the vendor cities. */}
            <TextQuestion
                label="Vendor Site City"
                required={true}
                onChange={(value: string) => handleChange("vendorSiteCity", value)}
                size="small"
            />

            <TextQuestion
                label="Project Type"
                onChange={(value: string) => handleChange("projectType", value)}
                size="small"
            />

            <TextQuestion
                label="Project Description"
                onChange={(value: string) => handleChange("projectDescription", value)}
            />

            <TextQuestion
                label="Project Implementation Year"
                onChange={(value: string) => handleChange("projectImplementationYear", value)}
                size="small"
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
                size="small"
            />

            <SectionHeader label="Energy Consumption: Before Intervention" />

            <DropdownQuestion
                label="Source of Energy"
                options={["Coal", "Natural Gas", "Electricity Grid"]}
                onSelect={(value: string) => handleChange("beforeSourceOfEnergy", value)}
                required={true}
            />

            <TextQuestion
                label="Share an energy consumption (KWh/year) estimate for Nestlé only (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEnergyConsumption", value))}
                required={true}
                size="small"
            />

            <TextQuestion
                label="Emission Factor of Energy (kgCO2/KwH) (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEmissionFactor", value))}
                size="small"
            />

            <SectionHeader label="Energy Consumption: After Intervention is Completed" />

            <DropdownQuestion
                label="Source of Energy"
                options={["Biogas/Green Gas - Grid (external)", "Solar", "Renewable Electricity Certificate"]}
                onSelect={(value: string) => handleChange("afterSourceOfEnergy", value)}
            />

            <TextQuestion
                label="Share an energy consumption (KWh/year) estimate for Nestlé only (AFTER Intervention)"
                onChange={(value: string) => handleChange("afterEnergyConsumption", value)}
                size="small"
            />

            <TextQuestion
                label="Emission Factor of Energy (kgCO2/KwH) (AFTER intervention)"
                onChange={(value: string) => handleChange("afterEmissionFactor", value)}
                size="small"
            />

            <SectionHeader label="Comments/Remarks" />

            <TextQuestion
                label="Source of Emission Factor (Please refer to Energy Consumption before and after intervention) "
                onChange={(value: string) => handleChange("impactReduction", value)}
                defaultValue={answers.impactReduction.value}
            />


            <SectionHeader label="Impact" />
            
            <DropdownQuestion
                label="Source of Energy"
                options={["Biogas/Green Gas - Grid (external)", "Solar", "Renewable Electricity Certificate"]}
                onSelect={(value: string) => handleChange("afterSourceOfEnergy", value)}
            />

            <TextQuestion
                label="Impact Reduction On GHG EmissionAfter Intervention - Attribute to Nestle only (tonsCO2e) based on an annualized impact"
                onChange={(value: string) => handleChange("impactTiming", value)}
                defaultValue={answers.impactTiming.value}
                size="small"
            />

            <TextQuestion
                label="Impact Timing"
                onChange={(value: string) => handleChange("impactReduction", value)}
                defaultValue={answers.impactReduction.value}
                size="small"
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

            <Error message={error} />
        </>
    );
}

export default RenewableProposalForm;