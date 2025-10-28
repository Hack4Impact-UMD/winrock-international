import { useEffect, useState } from 'react';
import styles from '../../css-modules/DropdownQuestion.module.css';
import chevron from '../../../assets/chevron-up-svgrepo-com.svg';
import Popup from '../Popup';

interface DropdownQuestionProps {
   label: string
   options: string[]
   controlledValue: string;
   onSelect: (selected: string) => void
   required?: boolean
   disabled?: boolean
   popup?: {
      guidance: string;
      example: string;
   };
}

const DropdownQuestion = ({
   label,
   options,
   controlledValue,
   onSelect,
   required = false,
   disabled = false,
   popup
}: DropdownQuestionProps) => {
   const [showDropdown, setShowDropdown] = useState<boolean>(false)
   const [selectedOption, setSelectedOption] = useState<string>(controlledValue)
   const [isValid, setIsValid] = useState(true)

   useEffect(() => {
      setSelectedOption(controlledValue)
   }, [controlledValue]);

   const toggleDropdownQuestion = () => {
      if (!disabled) {
         setShowDropdown(true)
      }
   }

   const selectOption = (option: string) => {
      setIsValid(true)

      setSelectedOption(option)
      setShowDropdown(false)
      onSelect(option)
   }

   // Allow the user to backspace to clear a dropdown
   // This is important for non-required dropdown questions
   const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Backspace') {
         setSelectedOption('')
      }
   }

   function validate() {
      if (required && !selectedOption) {
         setIsValid(false)
      }
   }

   return (
      <div className={styles.dropdownQuestion}>
         <div className={styles.labelRow}>
            {popup && (
               <Popup guidance={popup.guidance} example={popup.example} />
            )}
            <h3 className={`${styles.label} ${required ? styles.required : ''}`}>{label}</h3>
         </div>
         <div className={styles.dropdownContainer}>
            <button
               className={`${styles.dropdownButton} ${isValid ? styles.validDropdownButton : styles.invalidDropdownButton
                  } ${disabled ? styles.disabledDropdownButton : ''}`}
               onMouseDown={toggleDropdownQuestion}
               onBlur={() => {
                  setShowDropdown(false) // clicking off the dropdown closes it
                  validate()
               }}
               onKeyDown={handleKeyDown}
               disabled={disabled}
            >
               <p>{selectedOption || 'Select an option'}</p>
               <img
                  src={chevron}
                  className={styles.chevron}
                  style={{ rotate: showDropdown ? '0deg' : '180deg' }}
               ></img>
            </button>
            {showDropdown && (
               <div className={styles.dropdownMenu}>
                  {options.map(option => (
                     <div
                        key={option}
                        className={`${styles.dropdownItem} ${selectedOption === option ? styles.selectedDropdownItem : ''
                           }`}
                        onMouseDown={() => selectOption(option)}
                     >
                        {option}
                     </div>
                  ))}
               </div>
            )}{' '}
         </div>
      </div>
   )
}

export default DropdownQuestion