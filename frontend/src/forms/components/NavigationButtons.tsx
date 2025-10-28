import React from 'react';
import styles from '../css-modules/NavigationButtons.module.css';

interface NavigationButtonsProps {
   onNext?: () => void;
   onBack?: () => void;
   canGoNext?: boolean;
   canGoBack?: boolean;
   nextLabel?: string;
   backLabel?: string;
   className?: string;
   disableSubmit?: boolean;
   isLastPage?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
   onNext,
   onBack,
   canGoNext = true,
   canGoBack = true,
   nextLabel = 'Next',
   backLabel = 'Back',
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