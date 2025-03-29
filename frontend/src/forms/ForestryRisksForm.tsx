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
   const totalPages = 4
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
         <ProgressBar currentPage={currentPage} totalPages={totalPages} />
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
            response={'sdfsdf'}
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
            response={'sdfsdf'}
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
