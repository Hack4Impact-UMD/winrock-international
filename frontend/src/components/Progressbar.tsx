import React from 'react'
import '../css-modules/ProgressBar.css'

interface ProgressBarProps {
   currentPage: number
   totalPages: number
   pageLabels: string[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({
   currentPage,
   totalPages,
   pageLabels,
}) => {
   // Use provided pageLabels or default to the ones defined above
   // Ensure we have the right number of labels
   const labels =
      pageLabels.length === totalPages
         ? pageLabels
         : Array(totalPages)
              .fill('')
              .map((_, i) => pageLabels[i] || `Page ${i + 1}`)

   return (
      <div className='progress-container'>
         <div className='progress-steps'>
            {/* Progress bars */}
            <div className='progress-bars'>
               {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  let barClass = 'progress-bar'

                  if (pageNumber < currentPage) {
                     barClass += ' progress-bar-completed'
                  } else if (pageNumber === currentPage) {
                     barClass += ' progress-bar-current'
                  } else {
                     barClass += ' progress-bar-upcoming'
                  }

                  return <div key={`bar-${pageNumber}`} className={barClass} />
               })}
            </div>

            {/* Labels below bars */}
            <div className='progress-labels'>
               {labels.map((label, index) => (
                  <div key={`label-${index + 1}`} className='progress-label'>
                     {label}
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default ProgressBar
