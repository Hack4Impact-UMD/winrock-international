import { useState } from 'react'
import * as firestore from "firebase/firestore"
import { db } from "../../testFirebaseConfig.js"
import FormField from "../FormField.js"

import LogoHeader from '../../components/headers/LogoHeader.js'
import TitleHeader from '../../components/headers/TitleHeader.js'
import ProgressBar from '../../components/ProgressBar.js'
import NavigationButtons from '../../components/NavigationButtons.js'
import SectionHeader from '../../components/headers/SectionHeader.js'
import RisksDropdownQuestion from '../../components/questions/RisksDropdownQuestion.js'
import CoBenefitsDropdownQuestion from '../../components/questions/CoBenefitsDropdownQuestion.js'
import ConfirmationPage from '../ConfirmationPage.js'
import Error from '../../components/Error.js'

interface ForestryRisksFormData {
   // Risk Assessment
   riskAssessment: FormField;
   riskAssessmentDetails: FormField;

   // Climate Change Adaptation
   climateChangeAdaptation: FormField;
   climateChangeAdaptationDetails: FormField;

   // Sustainable Use and Management of Natural Resources
   environmentalRiskAssessment: FormField;
   environmentalRiskAssessmentDetails: FormField;
   businessContinuity: FormField;
   businessContinuityDetails: FormField;
   forestryManagementPlan: FormField;
   forestryManagementPlanDetails: FormField;
   rawMaterialCompliance: FormField;
   rawMaterialComplianceDetails: FormField;

   // Pollution and Waste Control
   pollutionAvoidance: FormField;
   pollutionAvoidanceDetails: FormField;
   wasteMonitoring: FormField;
   wasteMonitoringDetails: FormField;

   // Transition to a Circular Economy​​
   circularEconomy: FormField;
   circularEconomyDetails: FormField;

   // Protection and Restoration of Biodiversity and Ecosystems​
   biodiversityImpact: FormField;
   biodiversityImpactDetails: FormField;
   landDisturbance: FormField;
   landDisturbanceDetails: FormField;
   invasiveSpecies: FormField;
   invasiveSpeciesDetails: FormField;
   soilErosion: FormField;
   soilErosionDetails: FormField;

   // Human and Labor Rights
   protectionHumanRights: FormField;
   protectionHumanRightsDetails: FormField;
   formalDeclarations: FormField;
   formalDeclarationsDetails: FormField;
   stakeholderHealthSafety: FormField;
   stakeholderHealthSafetyDetails: FormField;

   // Community Impacts
   indigenousPeople: FormField;
   indigenousPeopleDetails: FormField;
   reduceStakeholderRisk: FormField;
   reduceStakeholderRiskDetails: FormField;
   smallHolders: FormField;
   smallHoldersDetails: FormField;
   designedToInvest: FormField;
   designedToInvestDetails: FormField;
   effortsToMaintainEngagements: FormField;
   effortsToMaintainEngagementsDetails: FormField;
   negativeCommunityImpacts: FormField;
   negativeCommunityImpactsDetails: FormField;

   // Safeguards
   effectiveSafeguards: FormField;
   effectiveSafeguardsDetails: FormField;

   // Project Water Co-Benefits​
   waterCoBenefits: FormField;
   waterCoBenefitsDetails: FormField;

   // Project Biodiversity and Environmental Co-Benefits
   biodiversityEnvironmentalCoBenefits: FormField;
   biodiversityEnvironmentalCoBenefitsDetails: FormField;

   // Project Community/Farmer Co-Benefits
   communityFarmerCoBenefits: FormField;
   communityFarmerCoBenefitsDetails: FormField;
}

function ForestryRisksForm() {
   const title = "Forestry Risks and Co-Benefit Form"
   const [currentPage, setCurrentPage] = useState(1)
   const totalPages = 3

   const collectionID = "forestry-risks-form"
   const collectionRef = firestore.collection(db, collectionID)
   const [submissionObj, setSubmissionObj] = useState<ForestryRisksFormData>({
      riskAssessment: new FormField('', true),
      riskAssessmentDetails: new FormField('', true),
      climateChangeAdaptation: new FormField('', true),
      climateChangeAdaptationDetails: new FormField('', true),
      environmentalRiskAssessment: new FormField('', true),
      environmentalRiskAssessmentDetails: new FormField('', true),
      businessContinuity: new FormField('', true),
      businessContinuityDetails: new FormField('', true),
      forestryManagementPlan: new FormField('', true),
      forestryManagementPlanDetails: new FormField('', true),
      rawMaterialCompliance: new FormField('', true),
      rawMaterialComplianceDetails: new FormField('', true),
      pollutionAvoidance: new FormField('', true),
      pollutionAvoidanceDetails: new FormField('', true),
      wasteMonitoring: new FormField('', true),
      wasteMonitoringDetails: new FormField('', true),
      circularEconomy: new FormField('', true),
      circularEconomyDetails: new FormField('', true),
      biodiversityImpact: new FormField('', true),
      biodiversityImpactDetails: new FormField('', true),
      landDisturbance: new FormField('', true),
      landDisturbanceDetails: new FormField('', true),
      invasiveSpecies: new FormField('', true),
      invasiveSpeciesDetails: new FormField('', true),
      soilErosion: new FormField('', true),
      soilErosionDetails: new FormField('', true),
      protectionHumanRights: new FormField('', true),
      protectionHumanRightsDetails: new FormField('', true),
      formalDeclarations: new FormField('', true),
      formalDeclarationsDetails: new FormField('', true),
      stakeholderHealthSafety: new FormField('', true),
      stakeholderHealthSafetyDetails: new FormField('', true),
      indigenousPeople: new FormField('', true),
      indigenousPeopleDetails: new FormField('', true),
      reduceStakeholderRisk: new FormField('', true),
      reduceStakeholderRiskDetails: new FormField('', true),
      smallHolders: new FormField('', true),
      smallHoldersDetails: new FormField('', true),
      designedToInvest: new FormField('', true),
      designedToInvestDetails: new FormField('', true),
      effortsToMaintainEngagements: new FormField('', true),
      effortsToMaintainEngagementsDetails: new FormField('', true),
      negativeCommunityImpacts: new FormField('', true),
      negativeCommunityImpactsDetails: new FormField('', true),
      effectiveSafeguards: new FormField('', true),
      effectiveSafeguardsDetails: new FormField('', true),
      waterCoBenefits: new FormField('', true),
      waterCoBenefitsDetails: new FormField('', false),
      biodiversityEnvironmentalCoBenefits: new FormField('', true),
      biodiversityEnvironmentalCoBenefitsDetails: new FormField('', false),
      communityFarmerCoBenefits: new FormField('', true),
      communityFarmerCoBenefitsDetails: new FormField('', false)
   })

   // Used to change the submissionObj's fields dynamically
   function handleChange(field: keyof ForestryRisksFormData, value: string) {
      const isRequired = submissionObj[field]!.isRequired
      setSubmissionObj((prev: ForestryRisksFormData) => ({
         ...prev,
         [field]: new FormField(value, isRequired)
      }))
   }

   const [isSubmitted, setIsSubmitted] = useState(false)
   const [error, setError] = useState('')

   /**
    * Insert a new ForestryRisksForm submission with the user-inputted
    * fields into the ForestryRisksForm collection.
   */
   async function handleSubmit() {
      for (const [_, v] of Object.entries(submissionObj)) {
         if (v.isRequired && v.value === '') {
             setError("Cannot submit: You have not completed one or more sections in the form")
             return
         }
      }

      try {
         await firestore.addDoc(collectionRef, submissionObj) // addDoc() auto-generates an ID for the submission
         setIsSubmitted(true)
      } catch (error) {
         console.error("Error submitting ForestryRisksForm", error)
      }
   }

   const saveChanges = () => {
      console.log('Changes saved')
   }

   const saveAndExit = () => {
      console.log('Changes saved and exiting')
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
                   setCurrentPage(currentPage + 1)
                   window.scroll(0, 0)
               } else {
                   handleSubmit()
               }
            }}
            onBack={() => {
                  if (currentPage > 1) {
                     setCurrentPage(currentPage - 1)
                     window.scroll(0, 0)
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
   handleChange: (field: keyof ForestryRisksFormData, value: string) => void;
}

const PageOne = ({ handleChange }: PageProps) => {
   return (
      <>
         <SectionHeader label='Risk Assessment' />

         <RisksDropdownQuestion
            label='Has the project completed a risk assessment following an approved standard? If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities?'
            onSelect={(value: string) => handleChange('riskAssessment', value)}
            onChange={(value: string) => handleChange('riskAssessmentDetails', value)}
         />

         <SectionHeader label='Climate Change Adaptation' />

         <RisksDropdownQuestion
            label='Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            onSelect={(value: string) => handleChange('climateChangeAdaptation', value)}
            onChange={(value: string) => handleChange('climateChangeAdaptationDetails', value)}
         />

         <SectionHeader label='Sustainable Use and Management of Natural Resources​' />

         <RisksDropdownQuestion
            label='Has the project completed an Environmental Risk Assessment?'
            onSelect={(value: string) => handleChange('environmentalRiskAssessment', value)}
            onChange={(value: string) => handleChange('environmentalRiskAssessmentDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            onSelect={(value: string) => handleChange('businessContinuity', value)}
            onChange={(value: string) => handleChange('businessContinuityDetails', value)}
         />

         <RisksDropdownQuestion
            label='Is there a forestry resource management plan in place (with regards to fire management, protection against deforestation, illegal logging and land conversion)?'
            onSelect={(value: string) => handleChange('forestryManagementPlan', value)}
            onChange={(value: string) => handleChange('forestryManagementPlanDetails', value)}
         />

         <RisksDropdownQuestion
            label='Does the project ensure that any raw material production (such as timber) adheres to the relevant legislation of the country of production, as well as forest-related regulations?'
            onSelect={(value: string) => handleChange('rawMaterialCompliance', value)}
            onChange={(value: string) => handleChange('rawMaterialComplianceDetails', value)}
         />

         <SectionHeader label='Pollution and Waste Control' />

         <RisksDropdownQuestion
            label='Has the project been designed to avoid pollution release into the environment, such as pesticide use reduction and management?'
            onSelect={(value: string) => handleChange('pollutionAvoidance', value)}
            onChange={(value: string) => handleChange('pollutionAvoidanceDetails', value)}
         />

         <RisksDropdownQuestion
            label='Is there active monitoring or regulatory inspections regarding waste streams generated by the project operations or systems?'
            onSelect={(value: string) => handleChange('wasteMonitoring', value)}
            onChange={(value: string) => handleChange('wasteMonitoringDetails', value)}
         />
      </>
   )
}

const PageTwo = ({ handleChange }: PageProps) => {
   return (
      <>
         <SectionHeader label='Transition to a Circular Economy' />

         <RisksDropdownQuestion
            label='Has the project has been designed to not negatively impact the transition to a circular economy?​'
            onSelect={(value: string) => handleChange('circularEconomy', value)}
            onChange={(value: string) => handleChange('circularEconomyDetails', value)}
         />

         <SectionHeader label='Protection and Restoration of Biodiversity and Ecosystems​​​' />

         <RisksDropdownQuestion
            label='Has the project been designed to not negatively impact biodiversity and habitats?​'
            onSelect={(value: string) => handleChange('biodiversityImpact', value)}
            onChange={(value: string) => handleChange('biodiversityImpactDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has this project been designed to avoid any displacement or disturbance of natural land features?​'
            onSelect={(value: string) => handleChange('landDisturbance', value)}
            onChange={(value: string) => handleChange('landDisturbanceDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has this project been designed to avoid the introduction of ecosystem invasive species?​'
            onSelect={(value: string) => handleChange('invasiveSpecies', value)}
            onChange={(value: string) => handleChange('invasiveSpeciesDetails', value)}
         />

         <RisksDropdownQuestion
            label='Does this project deploy practices that avoid soil erosion and protects land integrity?​'
            onSelect={(value: string) => handleChange('soilErosion', value)}
            onChange={(value: string) => handleChange('soilErosionDetails', value)}
         />

         <SectionHeader label = 'Human and Labor Rights' />

         <RisksDropdownQuestion
            label={'Does this project align with Nestle\'s "Responsible Sourcing Core Requirements" framework for the protection of Human Rights?'}
            onSelect={(value: string) => handleChange('protectionHumanRights', value)}
            onChange={(value: string) => handleChange('protectionHumanRightsDetails', value)}
         />

         <RisksDropdownQuestion
            label='Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed interventions?'
            onSelect={(value: string) => handleChange('formalDeclarations', value)}
            onChange={(value: string) => handleChange('formalDeclarationsDetails', value)}
         />

         <RisksDropdownQuestion
            label='Are there assurances for stakeholder health and safety in place?'
            onSelect={(value: string) => handleChange('stakeholderHealthSafety', value)}
            onChange={(value: string) => handleChange('stakeholderHealthSafetyDetails', value)}
         />

         <SectionHeader label = 'Community Impacts'/>

         <RisksDropdownQuestion
            label='Has this project been designed to respect and comply with applicable laws and human rights (statutory and/or customary)  regarding the acquisition, leasing and/or land use change of lands and natural resources of Indigenous peoples and local communities that are impacted or potentially impacted?'
            onSelect={(value: string) => handleChange('indigenousPeople', value)}
            onChange={(value: string) => handleChange('indigenousPeopleDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has the project been designed to reduce the risk to stakeholder livelihoods (fair payments, incentives)?'
            onSelect={(value: string) => handleChange('reduceStakeholderRisk', value)}
            onChange={(value: string) => handleChange('reduceStakeholderRiskDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has this project been designed to involve and include small holders?'
            onSelect={(value: string) => handleChange('smallHolders', value)}
            onChange={(value: string) => handleChange('smallHoldersDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has this project been designed to invest in the capacity building of the involved stakeholders through training?'
            onSelect={(value: string) => handleChange('designedToInvest', value)}
            onChange={(value: string) => handleChange('designedToInvestDetails', value)}
         />

         <RisksDropdownQuestion
            label='Is there effort to maintain ongoing engagements and participation of the community and involved farmers with regards to this project, including mechanisms to consider grievances?'
            onSelect={(value: string) => handleChange('effortsToMaintainEngagements', value)}
            onChange={(value: string) => handleChange('effortsToMaintainEngagementsDetails', value)}
         />

         <RisksDropdownQuestion
            label='Has this project been designed to minimize other potentially negative community impacts?​'
            onSelect={(value: string) => handleChange('negativeCommunityImpacts', value)}
            onChange={(value: string) => handleChange('negativeCommunityImpactsDetails', value)}
         />

         <SectionHeader label = 'Safeguards' />

         <RisksDropdownQuestion
            label='Have effective safeguards been incorporated in the to design phase?'
            onSelect={(value: string) => handleChange('effectiveSafeguards', value)}
            onChange={(value: string) => handleChange('negativeCommunityImpactsDetails', value)}
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
            onSelect={(value: string) => handleChange('waterCoBenefits', value)}
            onChange={(value: string) => handleChange('waterCoBenefitsDetails', value)}
         />

         <SectionHeader
            label="Project Biodiversity and Environmental Co-Benefits​"
            description="Enter information in this section that sheds light onto the project's potential co-benefits related to nature."
         />

         <CoBenefitsDropdownQuestion
            label='Is it expected that the project activities will improve overall species richness and diversity, threatened species, threatened or rare ecosystems, air quality, or soil erosion?​'
            benefitItems={[
               "overall species richness and diversity?",
               "threatened species?",
               "threatened or rare ecosystems?",
               "air quality?",
               "soil erosion?"
             ]}
            onSelect={(value: string) => handleChange('biodiversityEnvironmentalCoBenefits', value)}
            onChange={(value: string) => handleChange('biodiversityEnvironmentalCoBenefitsDetails', value)}
         />

         <SectionHeader label='Project Community/Farmer Co-Benefits​' />

         <CoBenefitsDropdownQuestion
            label="Is it expected that the project activities will improve?"
            benefitItems={[
               "farmer livelihoods or income generated?",
               "farmer adaptation to climate change?",
               "local livelihoods or increased income generated?",
               "community resilience to climate change?",
               "community adaptation to climate change?"
            ]}
            onSelect={(value: string) => handleChange('communityFarmerCoBenefits', value)}
            onChange={(value: string) => handleChange('communityFarmerCoBenefitsDetails', value)}
         />
      </>
   )
}

export default ForestryRisksForm