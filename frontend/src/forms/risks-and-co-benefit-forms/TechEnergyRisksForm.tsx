import { useState } from 'react'
import * as firestore from "firebase/firestore";
import { db } from "../../testFirebaseConfig.js";
import FormField from "../FormField.js";

import LogoHeader from '../../components/headers/LogoHeader.js';
import TitleHeader from '../../components/headers/TitleHeader.js';
import ProgressBar from '../../components/ProgressBar.js';
import NavigationButtons from '../../components/NavigationButtons.js';
import SectionHeader from '../../components/headers/SectionHeader.js';
import RisksDropdownQuestion from '../../components/questions/RisksDropdownQuestion.js';
import CoBenefitsDropdownQuestion from '../../components/questions/CoBenefitsDropdownQuestion.js';
import ConfirmationPage from '../ConfirmationPage.js';
import Error from '../../components/Error.js';

interface TechEnergyRisksFormData {
  // Risk Assessment
  riskAssessment: FormField;
  riskAssessmentDetails: FormField;

  // Climate Change Adaptation
  climateChange: FormField;
  climateChangeDetails: FormField;

  // Technology Risks
  technologyRisk: FormField;
  technologyRiskDetails: FormField;
  scalableTechnology: FormField;
  scalableTechnologyDetails: FormField;

  // Sustainable Use and Protection of Water Resources
  waterManagement: FormField;
  waterManagementDetails: FormField;

  // Pollution & Waste Control
  pollutionPrevention: FormField;
  pollutionPreventionDetails: FormField;
  wasteMonitoring: FormField;
  wasteMonitoringDetails: FormField;

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
  negativeImpacts: FormField;
  negativeImpactsDetails: FormField;

  // Safeguards
  effectiveSafeguards: FormField;
  effectiveSafeguardsDetails: FormField;

  // Project Water Co-Benefits
  waterBenefits: FormField;
  waterBenefitsDetails: FormField;

  // Project Biodiversity and Environmental Co-Benefits
  biodiversityBenefits: FormField;
  biodiversityBenefitsDetails: FormField;

  // Project Community/Farmer Co-Benefits
  communityBenefits: FormField;
  communityBenefitsDetails: FormField;
}

function TechEnergyRisksForm() {
  const title = "Tech & Energy Risks and Co-Benefit Form";
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const collectionID = "tech-energy-risks-form";
  const collectionRef = firestore.collection(db, collectionID);
  const [answers, setAnswers] = useState<TechEnergyRisksFormData>({
    riskAssessment: new FormField('', true),
    riskAssessmentDetails: new FormField('', true),
    climateChange: new FormField('', true),
    climateChangeDetails: new FormField('', true),
    technologyRisk: new FormField('', true),
    technologyRiskDetails: new FormField('', true),
    scalableTechnology: new FormField('', true),
    scalableTechnologyDetails: new FormField('', true),
    waterManagement: new FormField('', true),
    waterManagementDetails: new FormField('', true),
    pollutionPrevention: new FormField('', true),
    pollutionPreventionDetails: new FormField('', true),
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
    negativeImpacts: new FormField('', true),
    negativeImpactsDetails: new FormField('', true),
    effectiveSafeguards: new FormField('', true),
    effectiveSafeguardsDetails: new FormField('', true),
    waterBenefits: new FormField('', true),
    waterBenefitsDetails: new FormField('', false),
    biodiversityBenefits: new FormField('', true),
    biodiversityBenefitsDetails: new FormField('', false),
    communityBenefits: new FormField('', true),
    communityBenefitsDetails: new FormField('', false)
  })

  // Used to change the answers dynamically
  function handleChange(field: keyof TechEnergyRisksFormData, value: string) {
    const isRequired = answers[field]!.isRequired;
    setAnswers((prev: TechEnergyRisksFormData) => ({
       ...prev,
       [field]: new FormField(value, isRequired)
    }))
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  /**
  * Insert a new TechEnergyRisksForm submission with the user-inputted
  * fields into the TechEnergyRisksForm collection.
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
      submissionObj[field] = answers[field as keyof TechEnergyRisksFormData]!.value;
    });

    try {
      await firestore.addDoc(collectionRef, submissionObj); // addDoc() auto-generates an ID for the submission
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting TechEnergyRisksForm", error);
    }
  }

  const saveChanges = () => {
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
        description='Some spiel about what this form is about and just to provide some further information about whats happening'
      />
      <ProgressBar
        currentPage={currentPage}
        totalPages={totalPages}
        pageLabels={['Risk Form (Page 1)', 'Risk Form (Page 2)', 'Co-benefit Form']}
      />

      {/* Render different pages based on currentPage state */}
      {currentPage === 1 && <PageOne handleChange={handleChange} />}

      {currentPage === 2 && <PageTwo handleChange={handleChange} />}

      {currentPage === 3 && <PageThree handleChange={handleChange} />}

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
  )
}

interface PageProps {
  handleChange: (field: keyof TechEnergyRisksFormData, value: string) => void;
}

const PageOne = ({ handleChange }: PageProps) => {
  return (
    <>
      <SectionHeader label="Risk Assessment" />

      <RisksDropdownQuestion
        label="Has the project completed a risk assessment following an approved standard?"
        onSelect={(value: string) => handleChange('riskAssessment', value)}
        onChange={(value: string) => handleChange('riskAssessmentDetails', value)}
      />
      
      <SectionHeader label="Climate Change Adaptation" />

      <RisksDropdownQuestion
        label="Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?"
        onSelect={(value: string) => handleChange('climateChange', value)}
        onChange={(value: string) => handleChange('climateChangeDetails', value)}
      />
      
      <SectionHeader label="Technology Risks" />

      <RisksDropdownQuestion
        label="Has the project been designed or the technology type selected to minimize technology risk (operational, failure avoidance, system lifetime, technology maturity)?"
        onSelect={(value: string) => handleChange('technologyRisk', value)}
        onChange={(value: string) => handleChange('technologyRiskDetails', value)}
      />

      <RisksDropdownQuestion
        label="Has the project been designed with a solution or technology that can be scalable and replicable?"
        onSelect={(value: string) => handleChange('scalableTechnology', value)}
        onChange={(value: string) => handleChange('scalableTechnologyDetails', value)}
      />
      
      <SectionHeader label="Sustainable Use and Protection of Water Resources" />

      <RisksDropdownQuestion
        label="Has the project been designed with a solution or technology that can be scalable and replicable?"
        onSelect={(value: string) => handleChange('waterManagement', value)}
        onChange={(value: string) => handleChange('waterManagementDetails', value)}
      />
      
      <SectionHeader label="Pollution & Waste Control" />

      <RisksDropdownQuestion
        label="Has the project been designed to avoid pollution release into the environment, such as wastewater and air pollution?"
        onSelect={(value: string) => handleChange('pollutionPrevention', value)}
        onChange={(value: string) => handleChange('pollutionPreventionDetails', value)}
      />

      <RisksDropdownQuestion
        label="Is there active monitoring or regulatory inspections regarding waste streams generated by the project operations or systems?"
        onSelect={(value: string) => handleChange('wasteMonitoring', value)}
        onChange={(value: string) => handleChange('wasteMonitoringDetails', value)}
      />
    </>
  )
}

const PageTwo = ({ handleChange }: PageProps) => {
  return (
    <>
      <SectionHeader label="Transition to a Circular Economy" />

      <RisksDropdownQuestion
        label="Has the project been designed to not negatively impact the transition to a circular economy? Is there utilization of by-products or recycled elements before, during or after the intervention?"
        onSelect={(value: string) => handleChange('circularEconomy', value)}
        onChange={(value: string) => handleChange('circularEconomyDetails', value)}
      />
      
      <SectionHeader label="Protection and Restoration of Biodiversity and Ecosystems" />

      <RisksDropdownQuestion
        label="Has the project been designed to not negatively impact biodiversity and habitats?"
        onSelect={(value: string) => handleChange('biodiversityImpact', value)}
        onChange={(value: string) => handleChange('biodiversityImpactDetails', value)}
      />

      <RisksDropdownQuestion
        label="Has the project been designed to avoid any displacement or disturbance of natural land features?"
        onSelect={(value: string) => handleChange('landFeatures', value)}
        onChange={(value: string) => handleChange('landFeaturesDetails', value)}
      />
      
      <SectionHeader label="Human and Labor Rights" />

      <RisksDropdownQuestion
        label="Does this project align with Nestlé's 'Responsible Sourcing Core Requirements' framework for the protection of Human Rights? (Link to Document)"
        onSelect={(value: string) => handleChange('responsibleSourcing', value)}
        onChange={(value: string) => handleChange('responsibleSourcingDetails', value)}
      />

      <RisksDropdownQuestion
        label="Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed interventions?"
        onSelect={(value: string) => handleChange('laborFrameworks', value)}
        onChange={(value: string) => handleChange('laborFrameworksDetails', value)}
      />

      <RisksDropdownQuestion
        label="Are there assurances for farmer health and safety in place?"
        onSelect={(value: string) => handleChange('farmerHealth', value)}
        onChange={(value: string) => handleChange('farmerHealthDetails', value)}
      />
      
      <SectionHeader label="Community Impacts" />

      <RisksDropdownQuestion
        label="Is there effort to maintain ongoing engagements and participation of the community with regards to this project, including mechanisms to consider grievances?"
        onSelect={(value: string) => handleChange('communityEngagement', value)}
        onChange={(value: string) => handleChange('communityEngagementDetails', value)}
      />

      <RisksDropdownQuestion
        label="Has this project been designed to minimize other potentially negative community impacts?"
        onSelect={(value: string) => handleChange('negativeImpacts', value)}
        onChange={(value: string) => handleChange('negativeImpactsDetails', value)}
      />

      <SectionHeader label="Safeguards" />

      <RisksDropdownQuestion
        label="Have effective safeguards been incorporated in the to design phase?"
        onSelect={(value: string) => handleChange('effectiveSafeguards', value)}
        onChange={(value: string) => handleChange('effectiveSafeguardsDetails', value)}
      />
    </>
  )
}

const PageThree = ({ handleChange }: PageProps) => {
  return (
    <>
      <SectionHeader
        label="Project Water Co-Benefits"
        description="Enter information in this section that sheds light onto the project's potential co-benefits related to water quality or quantity."
      />
      
      <CoBenefitsDropdownQuestion
        label="Is it expected that the project activities will improve?"
        benefitItems={[
          "resilience to potential water scarcity?",
          "water quality?",
          "Surface or ground water?",
          "water availability in the local community?"
        ]}
        onSelect={(value: string) => handleChange('waterBenefits', value)}
        onChange={(value: string) => handleChange('waterBenefitsDetails', value)}
      />
      
      <SectionHeader
        label="Project Biodiversity and Environmental Co-Benefits"
        description="Enter information in this section that sheds light onto the project's potential co-benefits related to nature."
      />

      <CoBenefitsDropdownQuestion
        label="Is it expected that the project activities will improve?"
        benefitItems={[
          "overall species richness and diversity?",
          "threatened species?",
          "threatened or rare ecosystems?",
          "air quality?",
          "soil erosion?"
        ]}
        onSelect={(value: string) => handleChange('biodiversityBenefits', value)}
        onChange={(value: string) => handleChange('biodiversityBenefitsDetails', value)}
      />

      <SectionHeader label="Project Community/Farmer Co-Benefits" />

      <CoBenefitsDropdownQuestion
        label="Is it expected that the project activities will improve?"
        benefitItems={[
          "farmer livelihoods or income generated?",
          "farmer adaptation to climate change?",
          "local livelihoods or increased income generated?",
          "community resilience to climate change?",
          "community adaptation to climate change?"
        ]}
        onSelect={(value: string) => handleChange('communityBenefits', value)}
        onChange={(value: string) => handleChange('communityBenefitsDetails', value)}
      />
    </>
  )
}

export default TechEnergyRisksForm;