import { useState } from 'react'
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

import LogoHeader from '../../components/headers/LogoHeader.js'
import TitleHeader from '../../components/headers/TitleHeader.js'
import ProgressBar from '../../components/ProgressBar.js'
import NavigationButtons from '../../components/NavigationButtons.js'
import SectionHeader from '../../components/headers/SectionHeader.js'
import Dropdown from '../../components/questions/DropdownQuestion.js'
import TextQuestion from '../../components/questions/TextQuestion.js'
import RCBDropdownQuestion from '../../components/questions/RCBDropdownQuestion.js';
import ConfirmationPage from '../ConfirmationPage.js'

interface ForestryRisksFormData {

}

function ForestryRisksForm() {
   const title = "Forestry Risks and Co-Benefit Disclosure Form";
   const [currentPage, setCurrentPage] = useState(1)
   const [isSubmitted, setIsSubmitted] = useState(false)
   const totalPages = 4

   const nextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1)
      } else if (currentPage === totalPages) {
         handleSubmit()
      }
   }

   const handleSubmit = () => {
      console.log('Form submitted!')
      setIsSubmitted(true)
   }

   const prevPage = () => {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1)
      }
   }

   const saveChanges = () => {
      console.log('Changes saved')
   }

   const saveAndExit = () => {
      console.log('Changes saved and exiting')
   }

   // Function to handle dropdown selections
   const handleSelect = (id, value) => {
      console.log(`Selected ${value} for question ${id}`)
      // Implement your state management here
   }

   if (isSubmitted) {
      return <ConfirmationPage formName={title}/>
   }

   return (
      <div className='forestryRiskForm'>
         <LogoHeader />
         <TitleHeader
            title={title}
            description='Some spiel about what this form is about and just to provide some further information about whats happening'
         />
         <ProgressBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageLabels={['Risk Form (Page 1)', 'Risk Form (Page 2)', 'Risk Form (Page 3)', 'Co-benefit Form']}
         />

         {/* Render different pages based on currentPage state */}
         {currentPage === 1 && <PageOne handleSelect={handleSelect} />}

         {currentPage === 2 && <PageTwo handleSelect={handleSelect} />}
         
         {currentPage === 3 && <PageThree handleSelect={handleSelect} />}

         {currentPage === 4 && <CoBenefitForm handleSelect={handleSelect} />}

         <NavigationButtons
            onNext={nextPage}
            onBack={currentPage > 1 ? prevPage : undefined}
            onSaveChanges={saveChanges}
            onSaveAndExit={saveAndExit}
            canGoNext={true}
            canGoBack={currentPage > 1}
            nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            backLabel='Back'
            className='form-navigation'
            showSaveOptions={true}
         />
      </div>
   )
}

const PageOne = ({ handleSelect }) => {
   return (
      <>
         <SectionHeader label='Risk Assessment' />
         <RCBDropdownQuestion
            label="Has the project completed a risk assessment following an approved standard? If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities?"
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('risk_assessment', value)}
            onChange={()}
         />

         <SectionHeader label='Climate Change Adaptation' />
         <Dropdown
            id={'climate_change_adaptation'}
            question={
               'Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('climate_change_adaptation', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'climate_change_adaptation_details'}
            response={''}
         />

         <SectionHeader label='Sustainable Use and Management of Natural Resources​' />
         <Dropdown
            id={'environmental_risk_assessment'}
            question={'Has the project completed an Environmental Risk Assessment?'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('environmental_risk_assessment', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'environmental_risk_assessment_details'}
            response={''}
         />

         <Dropdown
            id={'business_continuity'}
            question={
               'Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('business_continuity', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'business_continuity_details'}
            response={''}
         />

         <Dropdown
            id={'forestry_management_plan'}
            question={
               'Is there a forestry resource management plan in place (with regards to fire management, protection against deforestation, illegal logging and land conversion)?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('forestry_management_plan', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'forestry_management_plan_details'}
            response={''}
         />

         <Dropdown
            id={'raw_material_compliance'}
            question={
               'Does the project ensure that any raw material production (such as timber) adheres to the relevant legislation of the country of production, as well as forest-related regulations?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('raw_material_compliance', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'raw_material_compliance_details'}
            response={''}
         />
      </>
   )
}

const PageTwo = ({ handleSelect }) => {
   return (
      <>
         <SectionHeader label='Polution and Waste Control​' />
         <Dropdown
            id={'pollution_avoidance'}
            question={
               'Has the project been designed to avoid pollution release into the environment, such as pesticide use reduction and management?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('pollution_avoidance', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'pollution_avoidance_details'}
            response={''}
         />

         <Dropdown
            id={'waste_monitoring'}
            question={
               'Is there active monitoring or regulatory inspections regarding waste streams generated by the project operations or systems?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('waste_monitoring', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'waste_monitoring_details'}
            response={''}
         />

         <SectionHeader label='Transition to a Circular Economy​​' />
         <Dropdown
            id={'circular_economy'}
            question={
               'Has the project has been designed to not negatively impact the transition to a circular economy?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('circular_economy', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'circular_economy_details'}
            response={''}
         />

         <SectionHeader label='Protection and Restoration of Biodiversity and Ecosystems​​​' />
         <Dropdown
            id={'biodiversity_impact'}
            question={
               'Has the project been designed to not negatively impact biodiversity and habitats?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('biodiversity_impact', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'biodiversity_impact_details'}
            response={''}
         />

         <Dropdown
            id={'land_disturbance'}
            question={
               'Has this project been designed to avoid any displacement or disturbance of natural land features?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('land_disturbance', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'land_disturbance_details'}
            response={''}
         />

         <Dropdown
            id={'invasive_species'}
            question={
               'Has this project been designed to avoid the introduction of ecosystem invasive species?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('invasive_species', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'invasive_species_details'}
            response={''}
         />

         <Dropdown
            id={'soil_erosion'}
            question={
               'Does this project deploy practices that avoid soil erosion and protects land integrity?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('soil_erosion', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'soil_erosion_details'}
            response={''}
         />
      </>
   )
}

const PageThree = ({ handleSelect }) => {
   return (
      <>
         <SectionHeader label = 'Human and Labor Rights' />
         <Dropdown 
            id = {"protection_human_rights"}
            question={
               'Does this project align with Nestle\'s "Responsible Sourcing Core Requirements" framework for the protection of Human Rights? '
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('protection_human_rights', value)}
            documentLink={'https://www.nestle.com/sites/default/files/asset-library/documents/library/documents/suppliers/nestle-responsible-sourcing-standard-english.pdf'}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'protection_human_rights_details'}
            response={''}
         />

         <Dropdown 
            id = {"formal_declarations"}
            question={
               'Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed interventions?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('formal_declarations', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'formal_declarations_deatils'}
            response={''}
         /> 

         <Dropdown 
            id = {"stakeholder_health_safety"}
            question={
               'Are there assurances for stakeholder health and safety in place?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('stakeholder_health_safety', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'stakeholder_health_safety_details'}
            response={''}
         />

         <SectionHeader label = 'Community Impacts'/>
         <Dropdown 
            id = {"indigenous_people"}
            question={
               'Has this project been designed to respect and comply with applicable laws and human rights (statutory and/or customary)  regarding the acquisition, leasing and/or land use change of lands and natural resources of Indigenous peoples and local communities that are impacted or potentially impacted?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('indigenous_people', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'indigenous_people_details'}
            response={''}
         />
         
         <Dropdown 
            id = {"reduce_stakeholder_risk"}
            question={
               'Has the project been designed to reduce the risk to stakeholder livelihoods (fair payments, incentives)?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('reduce_stakeholder_risk', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'reduce_stakeholder_risk_details'}
            response={''}
         />

         <Dropdown 
            id = {"small_holders"}
            question={
               'Has this project been designed to involve and include small holders?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('small_holders', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'small_holders_details'}
            response={''}
         />

         <Dropdown 
            id = {"designed_to_invest"}
            question={
               'Has this project been designed to invest in the capacity building of the involved stakeholders through training?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('designed_to_invest', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'designed_to_invest_details'}
            response={''}
         />

         <Dropdown 
            id = {"efforts_to_maintain_engagements"}
            question={
               'Is there effort to maintain ongoing engagements and participation of the community and involved farmers with regards to this project, including mechanisms to consider grievances?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('efforts_to_maintain_engagements', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'efforts_to_maintain_engagements_details'}
            response={''}
         />

         <Dropdown 
            id = {"negative_community_impacts"}
            question={
               'Has this project been designed to minimize other potentially negative community impacts?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('negative_community_impacts', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'negative_community_impacts_details'}
            response={''}
         />

         <SectionHeader label = 'Safeguards' />
         <Dropdown 
            id = {"effective_safeguards"}
            question={
               'Have effective safeguards been incorporated in the to design phase? ​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('effective_safeguards', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'effective_safeguards_details'}
            response={''}
         />


      </>
   )
}

const CoBenefitForm = ({ handleSelect }) => {
   return (
      <>
         <SectionHeader label='Project Water Co-Benefits​' />
         <Dropdown
            id={'water-co-benefits'}
            question={'Is it expected that the project activities will improve resilience to potential water scarcity, water quality (urface or ground water), or water availability in the local community?'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('water-co-benefits', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'water-co-benefits_details'}
            response={''}
         />
         <SectionHeader label='Project Biodiversity and Environmental Co-Benefits​' />
         <Dropdown
            id={'biodiversity_environmental_co_benefits'}
            question={'Is it expected that the project activities will improve overall species richness and diversity, threatened species, threatened or rare ecosystems, air quality, or soil erosion?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('biodiversity_environmental_co_benefits', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'biodiversity_environmental_co_benefits_details'}
            response={''}
         />
         <SectionHeader label='Project Community/Farmer Co-Benefits​' />
         <Dropdown
            id={'community_farmer_co_benefits'}
            question={'Is it expected that the project activities will improve farmer livelihoods or income generated, farmer resilience to climate change, farmer adaptation to climate change, local livelihoods or increased income generated, community resilience to climate change, orcommunity adaptation to climate change?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('community_farmer_co_benefits', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'community_farmer_co_benefits_details'}
            response={''}
         />
      </>
   )
}

export default ForestryRisksForm