import { useState } from 'react'
import './App.css'
import ProgressBar from './components/Progressbar'
import NavigationButtons from './components/NavigationButtons'

function App() {
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
      <div className='App'>
         <h1>Forestry Risk Assessment Form</h1>

         <ProgressBar currentPage={currentPage} totalPages={totalPages} />

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

export default App
