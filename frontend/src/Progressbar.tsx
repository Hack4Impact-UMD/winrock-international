import React from 'react'

interface ProgressBarProps {
   currentPage: number
   totalPages: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
   // Calculate progress based on current page and total pages in form
   // e.g., if on page 4 of 5, progress should be 3/5 = 60%
   const progress = Math.min(Math.max(((currentPage - 1) / totalPages) * 100, 0), 100)

   return (
      <>
         <div
            style={{
               height: `40px`,
               width: '100%',
               backgroundColor: '#C1C7CE',
            }}
         >
            <div
               style={{
                  height: '40%',
                  width: `${progress}%`,
                  backgroundColor: '#55AC2E',
               }}
            />
         </div>
      </>
   )
}

export default ProgressBar
