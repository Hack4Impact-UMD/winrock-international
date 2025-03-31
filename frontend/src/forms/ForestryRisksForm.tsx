import { useState } from 'react'
import LogoHeader from '../components/LogoHeader'
import TitleHeader from '../components/TitleHeader'
import ProgressBar from '../components/Progressbar'
import NavigationButtons from '../components/NavigationButtons'
import SectionHeader from '../components/SectionHeader'
import Dropdown, { DropdownProps } from '../components/Dropdown'
import TextQuestion from '../components/TextQuestion'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import '../css-modules/ForestryRisksForm.css'

function ForestryRisksForm() {
   const [currentPage, setCurrentPage] = useState(1)
   const totalPages = 3
   const [dropdowns, setDropdowns] = useState<DropdownProps[]>([])

   const [selectedValues, setSelectedValues] = useState<{ [key: string]: string | null }>(
      {}
   )

   // Update function that dynamically updates the selected value for each dropdown
   const handleSelect = (dropdownId: string, value: string) => {
      setSelectedValues(prevValues => ({
         ...prevValues,
         [dropdownId]: value,
      }))
   }

   async function submitDropdownValues(values: { [key: string]: string | null }) {
      for (const dropdownId in values) {
         console.log(dropdownId, values[dropdownId])
         await setDoc(doc(db, 'ag-form-testing', dropdownId), {
            response: values[dropdownId],
         })
      }
   }

   const nextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1)
      } else if (currentPage === totalPages) {
         handleSubmit()
      }
   }

   // Handle form submission
   const handleSubmit = () => {
      console.log('Form submitted!')
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

   return (
      <div className='forestryRisksForm'>
         <LogoHeader />
         <TitleHeader
            title='Risk and Co-Benefit Form'
            description='Some spiel about what this form is about and just to provide some further information about what’s happening?'
         />
         <ProgressBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageLabels={['Risk Form (Page 1)', 'Risk Form (Page 2)', 'Co-benefit form']}
         />
         <SectionHeader label='Risk Assessment' />

         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project completed a risk assessment following an approved standard? If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Climate Change Adaptation' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Sustainable Use and Management of Natural Resources​' />
         <Dropdown
            id={'sdfsdf'}
            question={'Has the project completed an Environmental Risk Assessment?'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <Dropdown
            id={'sdfsdf'}
            question={
               'Is there a forestry resource management plan in place (with regards to fire management, protection against deforestation, illegal logging and land conversion)?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <Dropdown
            id={'sdfsdf'}
            question={
               'Does the project ensure that any raw material production (such as timber) adheres to the relevant legislation of the country of production, as well as forest-related regulations?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Polution and Waste Control​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project been designed to avoid pollution release into the environment, such as pesticide use reduction and management?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Is there active monitoring or regulatory inspections regarding waste streams generated by the project operations or systems?'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Transition to a Circular Economy​​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project has been designed to not negatively impact the transition to a circular economy?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Protection and Restoration of Biodiversity and Ecosystems​​​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project been designed to not negatively impact biodiversity and habitats?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to avoid any displacement or disturbance of natural land features?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to avoid the introduction of ecosystem invasive species?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Does this project deploy practices that avoid soil erosion and protects land integrity?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Human and Labor Rights​​​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Does this project align with Nestle\'s "Responsible Sourcing Core Requirements" framework for the protection of Human Rights? ​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
            documentLink={
               'https://www.nestle.com/sites/default/files/asset-library/documents/library/documents/suppliers/nestle-responsible-sourcing-standard-english.pdf'
            }
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed interventions?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={'Are there assurances for stakeholder health and safety in place?​'}
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Community Impacts​​​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to respect and comply with applicable laws and human rights (statutory and/or customary)  regarding the acquisition, leasing and/or land use change of lands and natural resources of Indigenous peoples and local communities that are impacted or potentially impacted? ​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has the project been designed to reduce the risk to stakeholder livelihoods (fair payments, incentives)?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to involve and include small holders?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to invest in the capacity building of the involved stakeholders through training?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Is there effort to maintain ongoing engagements and participation of the community and involved farmers with regards to this project, including mechanisms to consider grievances?​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Has this project been designed to minimize other potentially negative community impacts?​​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <SectionHeader label='Safeguards​​​' />
         <Dropdown
            id={'sdfsdf'}
            question={
               'Have effective safeguards been incorporated in the to design phase?  ​'
            }
            options={['Yes', 'No', 'Not Applicable']}
            onSelect={value => handleSelect('sdfsdf', value)}
         />
         <TextQuestion
            name={
               'Please provide details including if  a mitigation plan is in place. If not applicable, please justify. '
            }
            id={'sdfsdf'}
            response={''}
         />

         <NavigationButtons
            onNext={nextPage} // Always provide the nextPage function
            onBack={currentPage > 1 ? prevPage : undefined}
            onSaveChanges={saveChanges}
            onSaveAndExit={saveAndExit}
            canGoNext={true} // Always enable the next/submit button
            canGoBack={currentPage > 1}
            nextLabel={currentPage === totalPages ? 'Submit' : 'Next'}
            backLabel='Back'
            className='form-navigation'
            showSaveOptions={true}
         />
      </div>
   )
}

export default ForestryRisksForm
