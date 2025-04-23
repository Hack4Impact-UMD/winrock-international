import React, { useState, useRef, useEffect } from 'react';
import styles from '../css-modules/RowCustomSelect.module.css'
import ColorText from './ColorText';

type StatusType = 
  | 'On Track'
  | 'At Risk'
  | 'Paused'
  | 'Completed'
  | 'Completed (except for risk)';

type AnalysisStageType =
  | 'Risk & Co-benefit Assessment'
  | 'GHG Assessment Analysis'
  | 'Confirming Final Requirements'
  | 'Clarifying Initial Project Information'
  | 'Complete, and Excluded';

interface RowCustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  variant: 'status' | 'analysis';
}

const RowCustomSelect: React.FC<RowCustomSelectProps> = ({ value, options, onChange, variant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div 
        className={styles.selectHeader}
        onClick={handleOpen}
      >
        <ColorText
          text={value}
          category={value as StatusType | AnalysisStageType}
          variant={variant}
        />
        <svg 
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`} 
          width="12" 
          height="7" 
          viewBox="0 0 12 7" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0.768639 1.073L5.75239 5.93113C5.83993 6.01646 5.95733 6.06421 6.07958 6.06421C6.20182 6.06421 6.31923 6.01646 6.40676 5.93113L11.3924 1.073C11.4332 1.03326 11.4657 0.985737 11.4878 0.933245C11.51 0.880753 11.5214 0.824355 11.5214 0.76738C11.5214 0.710404 11.51 0.654006 11.4878 0.601514C11.4657 0.549022 11.4332 0.501501 11.3924 0.461754C11.3087 0.379977 11.1963 0.334193 11.0793 0.334193C10.9622 0.334193 10.8499 0.379977 10.7661 0.461754L6.07958 5.03019L1.39395 0.461754C1.31028 0.380257 1.1981 0.334651 1.0813 0.334651C0.964494 0.334651 0.852309 0.380257 0.768639 0.461754C0.727817 0.501501 0.695371 0.549022 0.673217 0.601514C0.651063 0.654006 0.639648 0.710404 0.639648 0.76738C0.639648 0.824355 0.651063 0.880753 0.673217 0.933245C0.695371 0.985737 0.727817 1.03326 0.768639 1.073Z" 
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      {isOpen && (
        <div 
          className={styles.optionsContainer}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <ColorText
                text={option}
                category={option as StatusType | AnalysisStageType}
                variant={variant}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RowCustomSelect; 