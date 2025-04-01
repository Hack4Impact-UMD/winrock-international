import styles from '../css-modules/ProgressBar.module.css'

interface ProgressBarProps {
   currentPage: number
   totalPages: number
   pageLabels: string[]
}

function ProgressBar({ currentPage, totalPages, pageLabels }: ProgressBarProps) {
   // Use provided pageLabels or default to the ones defined above
   // Ensure we have the right number of labels
   const labels =
      pageLabels.length === totalPages
         ? pageLabels
         : Array(totalPages)
              .fill('')
              .map((_, i) => pageLabels[i] || `Page ${i + 1}`)

   return (
      <div className={styles.progressBarContainer}>
         <div className={styles.progressSteps}>
            {/* Progress bars */}
            <div className={styles.progressBars}>
               {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  let barClass = styles.progressBar

                  if (pageNumber < currentPage) {
                     barClass += ` ${styles.progressBarCompleted}`
                  } else if (pageNumber === currentPage) {
                     barClass += ` ${styles.progressBarCurrent}`
                  } else {
                     barClass += ` ${styles.progressBarUpcoming}`
                  }

                  return <div key={`bar-${pageNumber}`} className={barClass} />
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
   )
}

export default ProgressBar