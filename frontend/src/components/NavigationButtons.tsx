import React from 'react';
import './NavigationButtons.css';

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  canGoNext?: boolean;
  canGoBack?: boolean;
  nextLabel?: string;
  backLabel?: string;
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onBack,
  canGoNext = true,
  canGoBack = true,
  nextLabel = 'Next',
  backLabel = 'Back',
  className = '',
}) => {
  const handleNextClick = (e: React.MouseEvent) => {
    if (onNext) {
      onNext();
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className={`navigation-buttons ${className}`}>
      {onBack && (
        <button
          className="navigation-button back-button"
          onClick={handleBackClick}
          disabled={!canGoBack}
          aria-label={backLabel}
        >
          {backLabel}
        </button>
      )}
      
      {onNext && (
        <button
          className="navigation-button next-button"
          onClick={handleNextClick}
          disabled={!canGoNext}
          aria-label={nextLabel}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons; 