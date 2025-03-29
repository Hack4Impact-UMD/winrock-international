import React from 'react'
import '../css-modules/NavigationButtons.css'

interface NavigationButtonsProps {
   onNext?: () => void
   onBack?: () => void
   onSaveChanges?: () => void
   onSaveAndExit?: () => void
   canGoNext?: boolean
   canGoBack?: boolean
   nextLabel?: string
   backLabel?: string
   className?: string
   showSaveOptions?: boolean
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
   onNext,
   onBack,
   onSaveChanges,
   onSaveAndExit,
   canGoNext = true,
   canGoBack = true,
   nextLabel = 'Next',
   backLabel = 'Back',
   className = '',
   showSaveOptions = true,
}) => {
   const handleNextClick = (e: React.MouseEvent) => {
      if (onNext) {
         onNext()
      }
   }

   const handleBackClick = (e: React.MouseEvent) => {
      if (onBack) {
         onBack()
      }
   }

   const handleSaveChangesClick = (e: React.MouseEvent) => {
      if (onSaveChanges) {
         onSaveChanges()
      }
   }

   const handleSaveAndExitClick = (e: React.MouseEvent) => {
      if (onSaveAndExit) {
         onSaveAndExit()
      }
   }

   const getButtons = () => {
      const buttons = []

      if (onBack) {
         buttons.push(
            <button
               key='back'
               className='navigation-button back-button'
               onClick={handleBackClick}
               disabled={!canGoBack}
               aria-label={backLabel}
            >
               {backLabel}
            </button>
         )
      }

      if (showSaveOptions && onSaveChanges) {
         buttons.push(
            <button
               key='save-changes'
               className='navigation-button save-button'
               onClick={handleSaveChangesClick}
               aria-label='Save Changes'
            >
               Save Changes
            </button>
         )
      }

      if (showSaveOptions && onSaveAndExit) {
         buttons.push(
            <button
               key='save-exit'
               className='navigation-button save-button'
               onClick={handleSaveAndExitClick}
               aria-label='Save and Exit'
            >
               Save and Exit
            </button>
         )
      }

      if (onNext) {
         buttons.push(
            <button
               key='next'
               className='navigation-button next-button'
               onClick={handleNextClick}
               disabled={!canGoNext}
               aria-label={nextLabel}
            >
               {nextLabel}
            </button>
         )
      }

      return buttons
   }

   return <div className={`navigation-buttons ${className}`}>{getButtons()}</div>
}

export default NavigationButtons
