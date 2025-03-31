import React from 'react'
import '../css-modules/ProgressBar.module.css'

interface ProgressBarProps {
   currentPage: number
   totalPages: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
   // Create an array to represent the steps
   const steps = Array.from({ length: totalPages }, (_, i) => i + 1)

   return (
      <div className='progress-container'>
         <div className='progress-steps'>
            {/* Line connecting the steps */}
            <div className='progress-line' />

            {/* Green line showing progress */}
            <div
               className='progress-line-completed'
               style={{ width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }}
            />

            {/* Step circles */}
            {steps.map(step => (
               <div
                  key={step}
                  className='progress-step'
                  style={{ backgroundColor: step <= currentPage ? '#31AB48' : '#C1C7CE' }}
               >
                  {step < currentPage ? (
                     // Checkmark svg
                     <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                     >
                        <path
                           d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'
                           fill='white'
                        />
                     </svg>
                  ) : step === currentPage ? (
                     <div className='progress-step-current-indicator'></div>
                  ) : null}
               </div>
            ))}
         </div>
      </div>
   )
}

export default ProgressBar