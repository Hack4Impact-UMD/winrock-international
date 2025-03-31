import { useState } from 'react'
import LogoHeader from '../components/LogoHeader'
import TitleHeader from '../components/TitleHeader'
import ProgressBar from '../components/Progressbar'
import NavigationButtons from '../components/NavigationButtons'
import SectionHeader from '../components/SectionHeader'
import Dropdown from '../components/Dropdown'
import TextQuestion from '../components/TextQuestion'
import RisksFormConfirmationPage from '../components/RisksFormConfirmationPage'
import '../css-modules/ForestryRisksForm.css'

function ForestryRisksForm() {
   const [currentPage, setCurrentPage] = useState(1)
   const [isSubmitted, setIsSubmitted] = useState(false)
   const totalPages = 3

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
      return <RisksFormConfirmationPage />
   }

   return (
      <div className='forestryRisksForm'>
         <LogoHeader />
         <TitleHeader
            title='Risks and Co-Benefit Disclosure Form'
            description='Some spiel about what this form is about and just to provide some further information about whats happening'
         />
         <ProgressBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageLabels={['Risk Form (Page 1)', 'Risk Form (Page 2)', 'Co-benefit form']}
         />

         {/* Render different pages based on currentPage state */}
         {currentPage === 1 && <PageOne handleSelect={handleSelect} />}

         {currentPage === 2 && <PageTwo handleSelect={handleSelect} />}

         {currentPage === 3 && <CoBenefitForm handleSelect={handleSelect} />}

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
         <Dropdown
            id={'risk_assessment'}
            question={
               'Has the project completed a risk assessment following an approved standard? If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('risk_assessment', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if a mitigation plan is in place. If not applicable, please justify.'
            }
            id={'risk_assessment_details'}
            response={''}
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

const CoBenefitForm = ({ handleSelect }) => {
   return (
      <>
         <SectionHeader label='Project Water Co-Benefits​' />
         <Dropdown
            id={'safeguards'}
            question={'Is it expected that the project activities will improve?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('safeguards', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'safeguards_details'}
            response={''}
         />
         <SectionHeader label='Project Water Co-Benefits​' />
         <Dropdown
            id={'safeguards'}
            question={'Is it expected that the project activities will improve?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('safeguards', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'safeguards_details'}
            response={''}
         />
         <SectionHeader label='Project Water Co-Benefits​' />
         <Dropdown
            id={'safeguards'}
            question={'Is it expected that the project activities will improve?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('safeguards', value)}
         />
         <TextQuestion
            name={'(If yes, please describe how and how impactful)'}
            id={'safeguards_details'}
            response={''}
         />
      </>
   )
}

export default ForestryRisksForm
