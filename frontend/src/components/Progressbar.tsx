import React from 'react'
import styles from '../css-modules/ProgressBar.module.css'

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
   // Ensure correct number of labels
   const labels =
      pageLabels.length === totalPages
         ? pageLabels
         : Array(totalPages)
            .fill('')
            .map((_, i) => pageLabels[i] || `Page ${i + 1}`)

   return (
      <div className={styles.progressContainer}>
         <div className={styles.progressSteps}>
            {/* Progress bars */}
            <div className={styles.progressBars}>
               {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                     <div
                        key={`bar-${pageNumber}`}
                        className={`${styles.progressBar} 
                                    ${pageNumber < currentPage ? styles.progressBarCompleted : ''} 
                                    ${pageNumber === currentPage ? styles.progressBarCurrent : ''} 
                                    ${pageNumber > currentPage ? styles.progressBarUpcoming : ''}`}
                     />
                  )
               })}
            </div>

            {/* Labels below bars */}
            <div className={styles.progressLabels}>
               {labels.map((label, index) => (
                  <div key={`label-${index + 1}`} className={styles.progressLabel}>
                     {label}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ProgressBar;
