import { useState } from 'react'
import LogoHeader from '../components/LogoHeader'
import TitleHeader from '../components/TitleHeader'
import ProgressBar from '../components/Progressbar'
import NavigationButtons from '../components/NavigationButtons'
import SectionHeader from '../components/SectionHeader'
import '../css-modules/ForestryRisksForm.css'

function ForestryRisksForm() {
   // State to keep track of the current page
   const [currentPage, setCurrentPage] = useState(1)
   const totalPages = 4

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
