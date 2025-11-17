import React from 'react';
import styles from '../css-modules/NavigationButtons.module.css';

interface NavigationButtonsProps {
   onNext?: () => void;
   onBack?: () => void;
   onSave?: () => void;  // New prop for save functionality
   canGoNext?: boolean;
   canGoBack?: boolean;
   nextLabel?: string;
   backLabel?: string;
   saveLabel?: string;  // New prop for save button label
   className?: string;
   disableSubmit?: boolean;
   isLastPage?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
   onNext,
   onBack,
   onSave,  // New prop
   canGoNext = true,
   canGoBack = true,
   nextLabel = 'Next',
   backLabel = 'Back',
   saveLabel = 'Save Progress',  // New prop with default
   className = '',
   disableSubmit = false,
   isLastPage = false,
}) => {
   const handleNextClick = () => {
      if (onNext) {
         onNext();
      }
   };

   const handleBackClick = () => {
      if (onBack) {
         onBack();
      }
   };

   const handleSaveClick = () => {
      if (onSave) {
         onSave();
      }
   };

   const getButtons = () => {
      const buttons = [];

      // Back Button
      if (onBack) {
         buttons.push(
            <button
               key="back"
               className={`${styles.navigationButton} ${styles.backButton}`}
               onClick={handleBackClick}
               disabled={!canGoBack}
               aria-label={backLabel}
            >
               {backLabel}
            </button>
         );
      }

      // Save Progress Button (new)
      if (onSave) {
         buttons.push(
            <button
               key="save"
               className={`${styles.navigationButton} ${styles.saveButton}`}
               onClick={handleSaveClick}
               aria-label={saveLabel}
            >
               {saveLabel}
            </button>
         );
      }

      // Next Button (Submit Button)
      if (onNext) {
         // Only disable if it's the last page (submit) and submit is disabled
         // Always allow navigation on non-last pages
         const shouldDisable = isLastPage ? (!canGoNext || disableSubmit) : !canGoNext;
         
         buttons.push(
            <button
               key="next"
               className={`${styles.navigationButton} ${styles.nextButton}`}
               onClick={handleNextClick}
               disabled={shouldDisable}
               aria-label={nextLabel}
            >
               {nextLabel}
            </button>
         );
      }

      return buttons;
   };

   return <div className={`${styles.navigationButtons} ${className}`}>{getButtons()}</div>;
};

export default NavigationButtons;