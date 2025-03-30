import React, { useState, CSSProperties } from 'react';

// Props interface with just the essential properties
interface TextBoxProps {
  title: string;                    // The question title
  placeholder?: string;             // Placeholder text for the textarea
  onChange?: (value: string) => void; // Function to send the input value elsewhere
  className?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  title,
  placeholder = 'Type here',
  onChange,
  className = '',
}) => {
  // Track the input value
  const [value, setValue] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1rem',
      width: '100%'
    } as CSSProperties,

    title: {
      fontWeight: 600,
      fontSize: '1rem',
      marginBottom: '0.5rem'
    } as CSSProperties,

    input: {
      padding: '0.75rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
      width: '100%',
      outline: 'none',
    } as CSSProperties
  };

  return (
    <div style={styles.container} className={className}>
      {/* Question title */}
      <label style={styles.title}>{title}</label>

      {/* Text input area */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
};

export default TextBox;