import React from 'react';

interface DropdownProps {
  id: string;
  label?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  placeholder = 'Select an option',
  options = [],
  required = false,
  onChange
}) => {
  const styles = {
    dropdownContainer: {
      marginBottom: '15px',
    },
    dropdownLabel: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
    },
    selectWrapper: {
      position: 'relative' as 'relative',
    },
    dropdownSelect: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'white',
      appearance: 'none' as 'none',
    }
  };

  // Custom dropdown arrow using a pseudo-element
  const selectArrowStyle = {
    position: 'absolute' as 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #333',
    pointerEvents: 'none' as 'none',
  };

  return (
    <div style={styles.dropdownContainer}>
      {label && <label htmlFor={id} style={styles.dropdownLabel}>{label}</label>}
      <div style={styles.selectWrapper}>
        <select
          id={id}
          style={styles.dropdownSelect}
          required={required}
          onChange={onChange}
          defaultValue=""
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div style={selectArrowStyle}></div>
      </div>
    </div>
  );
};

export default Dropdown;