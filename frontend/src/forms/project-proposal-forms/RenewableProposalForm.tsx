import { useState, useEffect, useRef } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom"; // Correctly import useNavigate

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
    emissionFactor: FormField;
    volumeDelivered: FormField;
    beforeSourceOfEnergy: FormField;
    beforeEnergyConsumption: FormField;
    beforeEmissionFactor: FormField;
    afterSourceOfEnergy: FormField;
    afterEnergyConsumption: FormField;
    afterEmissionFactor: FormField;
    impactReduction: FormField;
    impactTiming: FormField;
}

const RenewableProposalForm = () => {
    const navigate = useNavigate();
    const title = "Renewable Energy Project Proposal Form";
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const collectionID = "project-proposal-form";
    const collectionRef = firestore.collection(db, collectionID);
    const answersRef = useRef<RenewableProposalFormData>(/* initial state */);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
  
    // Helper functions
    const handleChange = (field: keyof RenewableProposalFormData, value: string) => {
        const isRequired = answersRef.current[field]!.isRequired;
        answersRef.current = {
            ...answersRef.current,
            [field]: new FormField(value, isRequired),
        };
    };

    const computeImpactReduction = () => {
        if (
            answersRef.current.afterEnergyConsumption.value === '' ||
            answersRef.current.beforeEmissionFactor.value === '' ||
            answersRef.current.afterEmissionFactor.value === ''
        ) {
            return; // Exit the function if any required field is empty
        }
    
        // Perform the impact reduction calculation
        const afterEnergyConsumption = parseFloat(answersRef.current.afterEnergyConsumption.value);
        const beforeEmissionFactor = parseFloat(answersRef.current.beforeEmissionFactor.value);
        const afterEmissionFactor = parseFloat(answersRef.current.afterEmissionFactor.value);
    
        const impactReduction = ((afterEnergyConsumption * (beforeEmissionFactor - afterEmissionFactor)) / 1000).toFixed(2);
    
        // Update the state with the calculated value
        handleChange("impactReduction", impactReduction);
    };

    const computeImpactTiming = () => {
        if (answersRef.current.projectImplementationYear.value === '') {
            return; // Exit the function if the project implementation year is empty
        }
    
        const projectYear = parseInt(answersRef.current.projectImplementationYear.value, 10);
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 5;  // For example, the minimum year for the timing
    
        let impactTiming: string;
    
        // Determine the impact timing based on the project year
        if (projectYear < minYear) {
            impactTiming = "Before Nestlé Baseline"; // If the project year is earlier than the minimum year
        } else if (projectYear > currentYear) {
            impactTiming = `Potential Reduction - ${currentYear + 1} Onwards`; // If the project year is in the future
        } else {
            impactTiming = `Reduction - ${minYear}-${currentYear}`; // If the project year is within the range
        }
    
        // Update the state with the calculated impact timing
        handleChange("impactTiming", impactTiming);
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

    // Navigate to Confirmation Page
    if (isSubmitted) {
        return <ConfirmationPage formName={title} />;
    }

    return (
        <>
            <LogoHeader />
            
            <TitleHeader title={title} description="This is an intake form for renewable energy and energy reduction projects to support Nestlé's goal of achieving Net Zero GHG emissions by 2050." />
            <ProgressBar currentPage={currentPage} totalPages={totalPages} pageLabels={["Proposal Form (Page 1/1)"]} />
            <GuidanceDropdown></GuidanceDropdown>
            <SectionHeader label="Generic Information" />

            {/* Form Fields */}
            <TextQuestion label="Parent Vendor Name" controlledValue={answersRef.current.parentVendorName.value} onChange={(value) => handleChange("parentVendorName", value)} required={true} size="small" />
            <TextQuestion label="Vendor Code" controlledValue={answersRef.current.vendorCode.value} onChange={(value) => handleChange("vendorCode", value)} size="small" />
            <TextQuestion label="Vendor Site SAP Name" controlledValue={answersRef.current.vendorSiteSAPName.value} onChange={(value) => handleChange("vendorSiteSAPName", value)} size="small" />

            <DropdownQuestion label="Spend Category" options={["Ingredients", "Commodities", "Packaging", "Logistics"]} controlledValue={answersRef.current.spendCategory.value} onSelect={(value: string) => handleChange("spendCategory", value)} required={true} />
            <DropdownQuestion label="Level 2 Category" options={["Amino Acids", "Cereals & Grains", "Flexibles", "Warehousing Services"]} controlledValue={answersRef.current.level2Category.value} onSelect={(value: string) => handleChange("level2Category", value)} required={true} />
            <TextQuestion label="Vendor Site Country" controlledValue={answersRef.current.vendorSiteCountry.value} onChange={(value) => handleChange("vendorSiteCountry", value)} required={true} size="small" />
            <TextQuestion label="Vendor Site City" controlledValue={answersRef.current.vendorSiteCity.value} onChange={(value) => handleChange("vendorSiteCity", value)} required={true} size="small" />

            {/* Energy Consumption Sections */}
            <SectionHeader label="Energy Consumption: Before Intervention" />
            <DropdownQuestion label="Source of Energy" options={["Coal", "Natural Gas", "Electricity Grid"]} controlledValue={answersRef.current.beforeSourceOfEnergy.value} onSelect={(value) => handleChange("beforeSourceOfEnergy", value)} required={true} />
            <TextQuestion label="Energy Consumption (KWh/year) - Before Intervention" controlledValue={answersRef.current.beforeEnergyConsumption.value} onChange={(value) => handleChange("beforeEnergyConsumption", value)} required={true} size="small" />
            <TextQuestion label="Emission Factor of Energy (kgCO2/KWh) - Before Intervention" controlledValue={answersRef.current.beforeEmissionFactor.value} onChange={(value) => handleChange("beforeEmissionFactor", value)} size="small" />

            <SectionHeader label="Energy Consumption: After Intervention" />
            <DropdownQuestion label="Source of Energy" options={["Biogas/Green Gas", "Solar", "Renewable Electricity Certificate"]} controlledValue={answersRef.current.afterSourceOfEnergy.value} onSelect={(value) => handleChange("afterSourceOfEnergy", value)} />
            <TextQuestion label="Energy Consumption (KWh/year) - After Intervention" controlledValue={answersRef.current.afterEnergyConsumption.value} onChange={(value) => handleChange("afterEnergyConsumption", value)} size="small" />
            <TextQuestion label="Emission Factor of Energy (kgCO2/KWh) - After Intervention" controlledValue={answersRef.current.afterEmissionFactor.value} onChange={(value) => handleChange("afterEmissionFactor", value)} size="small" />

            {/* Impact and Timing */}
            <TextQuestion label="Impact Timing" controlledValue={answersRef.current.impactTiming.value} disableOverwrite={true} />

            {/* Navigation Buttons */}
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
                        setCurrentPage(currentPage - 1);
                        window.scroll(0, 0);
                    }
                }}
                onSaveChanges={() => console.log("Changes saved")}
                onSaveAndExit={() => console.log("Changes saved and exiting")}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            />

            <Error message={error} />
        </>
    );
};

export default RenewableProposalForm;
