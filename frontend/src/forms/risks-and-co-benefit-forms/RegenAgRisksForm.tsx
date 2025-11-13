import { RefObject, useRef, useState } from 'react'
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import FormField from "../FormField.js";

import LogoHeader from '../components/headers/LogoHeader.js';
import TitleHeader from '../components/headers/TitleHeader.js';
import ProgressBar from '../components/ProgressBar.js';
import NavigationButtons from '../components/NavigationButtons.js';
import SectionHeader from '../components/headers/SectionHeader.js';
import RisksDropdownQuestion from '../components/questions/RisksDropdownQuestion.js';
import ConfirmationPage from '../ConfirmationPage.js';
import Error from '../components/Error.js';
import FormLock from '../components/FormLock.js';
import { useParams } from 'react-router-dom';

interface TechEnergyRisksFormData {
    // Risk Assessment
    riskAssessment: FormField;
    riskAssessmentDetails: FormField;

    // Sustainable Use and Protection of Water Resources
    climateChange: FormField;
    climateChangeDetails: FormField;

    waterManagement: FormField;
    waterManagementDetails: FormField;

    waterMinimize: FormField;
    waterMinimizeDetails: FormField;

    waterPollution: FormField;
    waterPollutionDetails: FormField;

    // Pollution & Waste Control
    pollutionPrevention: FormField;
    pollutionPreventionDetails: FormField;
    wasteMonitoring: FormField;
    wasteMonitoringDetails: FormField;
    agroChemicalSafety: FormField;
    agroChemicalSafetyDetails: FormField;

    // Transition to a Circular Economy
    circularEconomy: FormField;
    circularEconomyDetails: FormField;

    // Protection and Restoration of Biodiversity and Ecosystems
    biodiversityImpact: FormField;
    biodiversityImpactDetails: FormField;
    landFeatures: FormField;
    landFeaturesDetails: FormField;

    // Human and Labor Rights
    responsibleSourcing: FormField;
    responsibleSourcingDetails: FormField;
    laborFrameworks: FormField;
    laborFrameworksDetails: FormField;
    farmerHealth: FormField;
    farmerHealthDetails: FormField;

    // Community Impacts
    communityEngagement: FormField;
    communityEngagementDetails: FormField;
    smallHolders: FormField;
    smallHoldersDetails: FormField;
    capacityBuilding: FormField;
    capacityBuildingDetails: FormField;
    ongoingEngagement: FormField;
    ongoingEngagementDetails: FormField;
    negativeImpacts: FormField;
    negativeImpactsDetails: FormField;


    // Safeguards
    effectiveSafeguards: FormField;
    effectiveSafeguardsDetails: FormField;
}

function RegenAgRisksForm() {
    const title = "Regenerative Agriculture Risks & Co-Benefits Form";

    // TODO: Lock flag - set to true to prevent form editing

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;

    const collectionID = "regenerative-agriculture-risks";
    const collectionRef = firestore.collection(db, collectionID);
    const answersRef = useRef<TechEnergyRisksFormData>({
        riskAssessment: new FormField('', true),
        riskAssessmentDetails: new FormField('', true),
        climateChange: new FormField('', true),
        climateChangeDetails: new FormField('', true),
        waterManagement: new FormField('', true),
        waterManagementDetails: new FormField('', true),
        waterMinimize: new FormField('', true),
        waterMinimizeDetails: new FormField('', true),
        waterPollution: new FormField('', true),
        waterPollutionDetails: new FormField('', true),
        pollutionPrevention: new FormField('', true),
        pollutionPreventionDetails: new FormField('', true),
        agroChemicalSafety: new FormField('', true),
        agroChemicalSafetyDetails: new FormField('', true),
        wasteMonitoring: new FormField('', true),
        wasteMonitoringDetails: new FormField('', true),
        circularEconomy: new FormField('', true),
        circularEconomyDetails: new FormField('', true),
        biodiversityImpact: new FormField('', true),
        biodiversityImpactDetails: new FormField('', true),
        landFeatures: new FormField('', true),
        landFeaturesDetails: new FormField('', true),
        responsibleSourcing: new FormField('', true),
        responsibleSourcingDetails: new FormField('', true),
        laborFrameworks: new FormField('', true),
        laborFrameworksDetails: new FormField('', true),
        farmerHealth: new FormField('', true),
        farmerHealthDetails: new FormField('', true),
        communityEngagement: new FormField('', true),
        communityEngagementDetails: new FormField('', true),
        smallHolders: new FormField('', true),
        smallHoldersDetails: new FormField('', true),
        capacityBuilding: new FormField('', true),
        capacityBuildingDetails: new FormField('', true),
        ongoingEngagement: new FormField('', true),
        ongoingEngagementDetails: new FormField('', true),
        negativeImpacts: new FormField('', true),
        negativeImpactsDetails: new FormField('', true),
        effectiveSafeguards: new FormField('', true),
        effectiveSafeguardsDetails: new FormField('', true),
    })

    // Used to change the answersRef's fields dynamically
    function handleChange(field: keyof TechEnergyRisksFormData, value: string) {
        if (isLocked) {
            handleLockedAction();
            return;
        }

        const isRequired = answersRef.current[field]!.isRequired;
        answersRef.current = {
            ...answersRef.current,
            [field]: new FormField(value, isRequired)
        }
        // Auto-save whenever form changes
        saveChanges();
    }

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Initialize form lock
    const { projectName } = useParams();
    const { handleLockedAction, LockedPopup, isLocked } = FormLock({
        projectName: projectName!
    });

    /**
    * Insert a new TechEnergyRisksForm submission with the user-inputted
    * fields into the TechEnergyRisksForm collection.
    */
    async function handleSubmit() {
        for (const [_, v] of Object.entries(answersRef.current)) {
            if (v.isRequired && v.value === '') {
                setError("Cannot submit: You have not completed one or more sections in the form");
                return;
            }
        }

        // Convert the answersRef into a submission object
        const submissionObj: Record<string, string> = {}
        Object.keys(answersRef.current).forEach((field) => {
            submissionObj[field] = answersRef.current[field as keyof TechEnergyRisksFormData]!.value;
        });

        try {
            await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting TechEnergyRisksForm", error);
            setError("Server error. Please try again later.");
        }
    }

    const saveChanges = () => {
        // TODO: Implement save functionality
        console.log('Changes saved');
    }


    if (isSubmitted) {
        return <ConfirmationPage formName={title} />
    }

    return (
        <>
            <LogoHeader />
            <TitleHeader
                title={title}
                description='Some spiel about what this form is about and just to provide some further information about whats happening'
            />
            <ProgressBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageLabels={['Risk Form (Page 1)', 'Risk Form (Page 2)', 'Co-benefit Form']}
            />

            {/* Render different pages based on currentPage state */}
            {currentPage === 1 &&
                <PageOne
                    handleChange={handleChange}
                    answersRef={answersRef}
                    locked={isLocked}
                />}
            {currentPage === 2 &&
                <PageTwo
                    handleChange={handleChange}
                    answersRef={answersRef}
                    locked={isLocked}
                />}

            <NavigationButtons
                onNext={() => {
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scroll(0, 0);
                    } else {
                        // Only check for lock when trying to submit
                        if (isLocked) {
                            handleLockedAction();
                            return;
                        }
                        handleSubmit();
                    }
                }}
                onBack={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        window.scroll(0, 0);
                    }
                }}
                canGoBack={currentPage > 1}
                nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
                disableSubmit={isLocked}
                isLastPage={currentPage === totalPages}
            />

            <Error message={error} />

            {/* Locked Form Popup */}
            {LockedPopup}
        </>
    )
}

interface PageProps {
    answersRef: RefObject<TechEnergyRisksFormData>;
    handleChange: (field: keyof TechEnergyRisksFormData, value: string) => void;
    locked: boolean;
}

const PageOne = ({ answersRef, handleChange, locked }: PageProps) => {
    return (
        <>
            <SectionHeader label="Risk Assessment" />

            <RisksDropdownQuestion
                label="Has the project completed a risk assessment following an approved standard?"
                controlledValues={[answersRef.current.riskAssessment.value,
                answersRef.current.riskAssessmentDetails.value]}
                onSelect={(value: string) => handleChange('riskAssessment', value)}
                onChange={(value: string) => handleChange('riskAssessmentDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Climate Change Adaptation" />

            <RisksDropdownQuestion
                label="Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?"
                controlledValues={[answersRef.current.climateChange.value,
                answersRef.current.climateChangeDetails.value]}
                onSelect={(value: string) => handleChange('climateChange', value)}
                onChange={(value: string) => handleChange('climateChangeDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Sustainable Use and Protection of Water Resources" />

            <RisksDropdownQuestion
                label="Is there a water use and protection management plan in place to reduce local water body degradation risk and ensure compliance with local regulations?"
                controlledValues={[answersRef.current.waterManagement.value,
                answersRef.current.waterManagementDetails.value]}
                onSelect={(value: string) => handleChange('waterManagement', value)}
                onChange={(value: string) => handleChange('waterManagementDetails', value)}
                disabled={locked}
            />

            <RisksDropdownQuestion
                label="Has the  project been designed to minimize water use?"
                controlledValues={[answersRef.current.waterMinimize.value,
                answersRef.current.waterMinimizeDetails.value]}
                onSelect={(value: string) => handleChange('waterMinimize', value)}
                onChange={(value: string) => handleChange('waterMinimizeDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Has the project been designed to minimize water pollution?"
                controlledValues={[answersRef.current.waterPollution.value,
                answersRef.current.waterPollutionDetails.value]}
                onSelect={(value: string) => handleChange('waterPollution', value)}
                onChange={(value: string) => handleChange('waterPollutionDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Pollution & Waste Control" />

            <RisksDropdownQuestion
                label="Has the  project been designed to avoid pollution release into the environment, such as fertilizer run-off and air pollution?"
                controlledValues={[answersRef.current.pollutionPrevention.value,
                answersRef.current.pollutionPreventionDetails.value]}
                onSelect={(value: string) => handleChange('pollutionPrevention', value)}
                onChange={(value: string) => handleChange('pollutionPreventionDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Is there  active monitoring or regulatory inspections regarding waste streams generated  by the project operations or systems?"
                controlledValues={[answersRef.current.wasteMonitoring.value,
                answersRef.current.wasteMonitoringDetails.value]}
                onSelect={(value: string) => handleChange('wasteMonitoring', value)}
                onChange={(value: string) => handleChange('wasteMonitoringDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Do all agrochemicals such as pesticides and fertilizers, if applicable, adhere to  regulatory safety standards regarding hazardous materials and chemicals  handling, storage and application?"
                controlledValues={[answersRef.current.agroChemicalSafety.value,
                answersRef.current.agroChemicalSafetyDetails.value]}
                onSelect={(value: string) => handleChange('agroChemicalSafety', value)}
                onChange={(value: string) => handleChange('agroChemicalSafetyDetails', value)}
                disabled={locked}
            />
        </>
    )
}

const PageTwo = ({ answersRef, handleChange, locked }: PageProps) => {
    return (
        <>
            <SectionHeader label="Transition to a Circular Economy" />

            <RisksDropdownQuestion
                label="Has the  project been designed to not negatively impact the transition to a  circular economy? (is there utilization of by-products or recycled elements  before, during or after the intervention?)"
                controlledValues={[answersRef.current.circularEconomy.value,
                answersRef.current.circularEconomyDetails.value]}
                onSelect={(value: string) => handleChange('circularEconomy', value)}
                onChange={(value: string) => handleChange('circularEconomyDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Protection and Restoration of Biodiversity and Ecosystems" />

            <RisksDropdownQuestion
                label="Has the project been designed to not negatively impact biodiversity and habitats?"
                controlledValues={[answersRef.current.biodiversityImpact.value,
                answersRef.current.biodiversityImpactDetails.value]}
                onSelect={(value: string) => handleChange('biodiversityImpact', value)}
                onChange={(value: string) => handleChange('biodiversityImpactDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Does this project deploy practices that avoid soil erosion and protects land integrity?"
                controlledValues={[answersRef.current.landFeatures.value,
                answersRef.current.landFeaturesDetails.value]}
                onSelect={(value: string) => handleChange('landFeatures', value)}
                onChange={(value: string) => handleChange('landFeaturesDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Human and Labor Rights" />

            <RisksDropdownQuestion
                label="Does this project align with Nestle's 'Responsible Sourcing Core Requirements' framework for the protection of Human Rights? Link to Document"
                controlledValues={[answersRef.current.responsibleSourcing.value,
                answersRef.current.responsibleSourcingDetails.value]}
                onSelect={(value: string) => handleChange('responsibleSourcing', value)}
                onChange={(value: string) => handleChange('responsibleSourcingDetails', value)}
                disabled={locked}
            />

            <RisksDropdownQuestion
                label="Are there formal declarations, accountability frameworks and/or third party  inspections that ensure that no forced or child labor is involved in the proposed interventions?"
                controlledValues={[answersRef.current.laborFrameworks.value,
                answersRef.current.laborFrameworksDetails.value]}
                onSelect={(value: string) => handleChange('laborFrameworks', value)}
                onChange={(value: string) => handleChange('laborFrameworksDetails', value)}
                disabled={locked}
            />

            <RisksDropdownQuestion
                label="Are there assurances for farmer health and safety in place (including safety management plans and procedures, access to personal protective equipment, etc)?"
                controlledValues={[answersRef.current.farmerHealth.value,
                answersRef.current.farmerHealthDetails.value]}
                onSelect={(value: string) => handleChange('farmerHealth', value)}
                onChange={(value: string) => handleChange('farmerHealthDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Community Impacts" />

            <RisksDropdownQuestion
                label="Has the project been designed to reduce the risk to farmer livelihoods  (fair payments, incentives)?"
                controlledValues={[answersRef.current.communityEngagement.value,
                answersRef.current.communityEngagementDetails.value]}
                onSelect={(value: string) => handleChange('communityEngagement', value)}
                onChange={(value: string) => handleChange('communityEngagementDetails', value)}
                disabled={locked}
            />

            <RisksDropdownQuestion
                label="Has this project been designed to involve and include small holders?"
                controlledValues={[answersRef.current.smallHolders.value,
                answersRef.current.smallHoldersDetails.value]}
                onSelect={(value: string) => handleChange('smallHolders', value)}
                onChange={(value: string) => handleChange('smallHoldersDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Has this project been designed to invest in the capacity building of the involved  farmers through training?"
                controlledValues={[answersRef.current.capacityBuilding.value,
                answersRef.current.capacityBuildingDetails.value]}
                onSelect={(value: string) => handleChange('capacityBuilding', value)}
                onChange={(value: string) => handleChange('capacityBuildingDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Is there effort to maintain ongoing engagements and participation of the community and  involved farmers with regards to this project, including mechanisms to  consider grievances?"
                controlledValues={[answersRef.current.ongoingEngagement.value,
                answersRef.current.ongoingEngagementDetails.value]}
                onSelect={(value: string) => handleChange('ongoingEngagement', value)}
                onChange={(value: string) => handleChange('ongoingEngagementDetails', value)}
                disabled={locked}
            />
            <RisksDropdownQuestion
                label="Has this project been designed to minimize other potentially negative community impacts?"
                controlledValues={[answersRef.current.negativeImpacts.value,
                answersRef.current.negativeImpactsDetails.value]}
                onSelect={(value: string) => handleChange('negativeImpacts', value)}
                onChange={(value: string) => handleChange('negativeImpactsDetails', value)}
                disabled={locked}
            />

            <SectionHeader label="Safeguards" />

            <RisksDropdownQuestion
                label="Have effective safeguards been incorporated in the to design phase?"
                controlledValues={[answersRef.current.effectiveSafeguards.value,
                answersRef.current.effectiveSafeguardsDetails.value]}
                onSelect={(value: string) => handleChange('effectiveSafeguards', value)}
                onChange={(value: string) => handleChange('effectiveSafeguardsDetails', value)}
                disabled={locked}
            />
        </>
    )
}

export default RegenAgRisksForm;