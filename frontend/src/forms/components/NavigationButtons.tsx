import React from 'react';
import styles from '../css-modules/NavigationButtons.module.css';

interface NavigationButtonsProps {
   onNext?: () => void;
   onBack?: () => void;
   onSaveChanges?: () => void;
   onSaveAndExit?: () => void;
   canGoNext?: boolean;
   canGoBack?: boolean;
   nextLabel?: string;
   backLabel?: string;
   className?: string;
   showSaveOptions?: boolean;
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

   const handleSaveChangesClick = () => {
      if (onSaveChanges) {
         onSaveChanges();
      }
   };

   const handleSaveAndExitClick = () => {
      if (onSaveAndExit) {
         onSaveAndExit();
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

      // Save Changes Button
      if (showSaveOptions && onSaveChanges) {
         buttons.push(
            <button
               key="save-changes"
               className={`${styles.navigationButton} ${styles.saveButton}`}
               onClick={handleSaveChangesClick}
               aria-label="Save Changes"
            >
               Save Changes
            </button>
         );
      }

      // Save and Exit Button
      if (showSaveOptions && onSaveAndExit) {
         buttons.push(
            <button
               key="save-exit"
               className={`${styles.navigationButton} ${styles.saveButton}`}
               onClick={handleSaveAndExitClick}
               aria-label="Save and Exit"
            >
               Save and Exit
            </button>
         );
      }

      // Next Button (Submit Button)
      if (onNext) {
         buttons.push(
            <button
               key="next"
               className={`${styles.navigationButton} ${styles.nextButton}`}
               onClick={handleNextClick}
               disabled={!canGoNext}
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