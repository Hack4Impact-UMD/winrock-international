import React from 'react';
import styles from '../../../css-modules/ColorText.module.css';

interface ColorTextProps {
  text: string;
  backgroundColor: string;
  textColor: string;
}

const ColorText: React.FC<ColorTextProps> = ({ 
  text, 
  backgroundColor, 
  textColor
}) => {
  // Set the custom colors
  const customStyle = {
    backgroundColor: backgroundColor,
    color: textColor
  };
  
  return (
    <span className={styles.colorText} style={customStyle}>
      {text}
    </span>
  );
};

export default ColorText;
