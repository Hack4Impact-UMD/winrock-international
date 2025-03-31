import { useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../src/firebaseConfig.js";

import LogoHeader from "../components/LogoHeader.js";
import TitleHeader from "../components/TitleHeader.js";
import ProgressBar from "../components/ProgressBar.js";
import SectionHeader from "../components/SectionHeader.js";
import TextBox from "../components/TextBox.js";
import Dropdown from "../components/Dropdown.js";
import NavigationButtons from "../components/NavigationButtons.js";

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
    const collectionID = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
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
        impactTiming: '',
    });

    const [displayImpactEvidenceTextbox, setDisplayImpactEvidenceTextbox] = useState(false);
 
    // Used to change the submissionObj's fields dynamically
    function handleChange(field: keyof RenewableProposalFormData, value: string) {
        setSubmissionObj((prev: RenewableProposalFormData) => ({
            ...prev,
            [field]: value
        }));
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;
  
    /**
     * Save a new renewableProjectProposal document with the user-inputted
     * fields into the renewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
        } catch (error) {
            console.error("Error submitting renewableProjectProposal", error);
        }
    }
  
     const saveChanges = () => {
        console.log('Changes saved');
     }
  
     const saveAndExit = () => {
        console.log('Changes saved and exiting');
     }

    return (
        <div className="form renewable-proposal-form">
            <LogoHeader />
            <TitleHeader
                title="Renewable Energy Project Proposal Form"
                description="This is an intake form for renewable energy and energy reduction projects to support Nestlé's
                             goal of achieving Net Zero GHG emissions by 2050."
            />

            {/* TODO: Fix the display for 1 page, or split this form into more pages. */}
            <ProgressBar
                currentPage={currentPage}
                totalPages={totalPages}
            />

            <SectionHeader label="Generic Information" />

            {/* TODO: Add an ID field to TextBox.tsx later? */}
            <TextBox
                className="required"
                title="Parent Vendor Name"
                onChange={(value) => handleChange("parentVendorName", value)}
            />

            <TextBox
                title="Vendor Code"
                onChange={(value) => handleChange("vendorCode", value)}
            />

            <TextBox
                title="Vendor Site SAP Name"
                onChange={(value) => handleChange("vendorSiteSAPName", value)}
            />

            {/* TODO: This question is required;
                add a className field to Dropdown.tsx later? */}
            <Dropdown
                id="TBD"
                question="Spend Category"
                options={["Ingredients", "Commodities", "Packaging", "Logistics"]}
                onSelect={(value) => handleChange("spendCategory", value)}
            />

            {/* TODO: This question is required;
                add a className field to Dropdown.tsx later? */}
            <Dropdown
                id="TBD"
                question="Level 2 Category"
                options={["Amino Acids", "Cereals & Grains", "Flexibles", "Warehousing Services"]}
                onSelect={(value) => handleChange("level2Category", value)}
            />

            <TextBox
                className="required"
                title="Vendor Site Country"
                onChange={(value) => handleChange("vendorSiteCountry", value)}
            />

            {/* This was a Dropdown in the Excel form, but we changed it
                to a TextBox because we don't know the vendor cities. */}
            <TextBox
                className="required"
                title="Vendor Site City"
                onChange={(value) => handleChange("vendorSiteCity", value)}
            />

            <TextBox
                title="Project Type"
                onChange={(value) => handleChange("projectType", value)}
            />

            <TextBox
                title="Project Description"
                onChange={(value) => handleChange("projectDescription", value)}
            />

            <TextBox
                title="Project Implementation Year"
                onChange={(value) => handleChange("projectImplementationYear", value)}
            />

            <Dropdown
                id="TBD"
                question="How do you plan to evidence the project impact?"
                options={["Project implementation partner (2nd/3rd party)", "Electronic metering tool", "Other (please describe)"]}
                onSelect={(value) => {
                    if (value === "Other (please describe)") {
                        handleChange("impactEvidence", "");
                        setDisplayImpactEvidenceTextbox(true);
                    } else {
                        handleChange("impactEvidence", value);
                        setDisplayImpactEvidenceTextbox(false);
                    }
                }}
            />
            {displayImpactEvidenceTextbox &&
                <TextBox
                    title=""
                    onChange={(value) => handleChange("impactEvidence", value)}
                />}

            <TextBox
                title="Please share any comments/remarks on the change in the source of energy (see below sections)"
                onChange={(value) => handleChange("emissionFactor", value)}
            />

            <TextBox
                className="required"
                title="Volume of Material (Metric Tons) Delivered to Nestlé in 2022"
                onChange={(value) => handleChange("volumeDelivered", value)}
            />

            <SectionHeader label="Energy Consumption: Before Intervention" />

            {/* TODO: This question is required;
                add a className field to Dropdown.tsx later? */}
            <Dropdown
                id="TBD"
                question="Source of Energy (BEFORE Intervention)"
                options={["Coal", "Natural Gas", "Electricity Grid"]}
                onSelect={(value) => handleChange("beforeSourceOfEnergy", value)}
            />

            <TextBox
                className="required"
                title="Share an energy consumption (KWh/year) estimate for Nestlé only (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEnergyConsumption", value))}
            />

            <TextBox
                title="Emission Factor of Energy (kgCO2/KwH) (BEFORE intervention)"
                onChange={((value) => handleChange("beforeEmissionFactor", value))}
            />

            <SectionHeader label="Energy Consumption: After Intervention is Completed" />

            {/* TODO: This question is not required;
                add a className field to Dropdown.tsx later? */}
            <Dropdown
                id="TBD"
                question="Source of Energy (AFTER Intervention)"
                options={["Biogas/Green Gas - Grid (external)", "Solar", "Renewable Electricity Certificate"]}
                onSelect={(value) => handleChange("afterSourceOfEnergy", value)}
            />

            <TextBox
                title="Share an energy consumption (KWh/year) estimate for Nestlé only (AFTER Intervention)"
                onChange={(value) => handleChange("afterEmissionFactor", value)}
            />

            <TextBox
                title="Emission Factor of Energy (kgCO2/KwH) (AFTER intervention)"
                onChange={(value) => handleChange("afterEmissionFactor", value)}
            />

            {/* TODO: This should be calculated using the formula from the Excel form,
                with overwriting enabled. */}
            <TextBox
                title="Impact reduction on GHG emission (tonsCO2e) after intervention attributed to Nestlé only based on annualized impact"
                onChange={(value) => handleChange("impactReduction", value)}
            />

            {/* TODO: This should be calculated using the formula from the Excel form,
                with overwriting disabled. */}
            <TextBox
                title="Impact Timing"
                onChange={(value) => handleChange("impactTiming", value)}
            />

            <NavigationButtons
                className='renewable-proposal-form-navigation'
                onNext={() => {
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                    } else {
                        handleSubmit();
                    }
                }}
                onBack={() => {if (currentPage > 1) setCurrentPage(currentPage - 1)}}
                onSaveChanges={saveChanges}
                onSaveAndExit={saveAndExit}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            />
        </div>
    );
}

export default RenewableProposalForm;