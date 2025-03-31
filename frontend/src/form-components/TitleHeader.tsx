import React from 'react';

interface TitleHeaderProps {
  title: string;
  description?: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, description }) => {
  const styles = {
    titleHeader: {
      padding: '15px 20px',
      backgroundColor: 'white',
    },
    formTitle: {
      fontSize: '22px',
      fontWeight: 600,
      margin: 0,
      color: '#333',
    },
    formDescription: {
      fontSize: '14px',
      margin: '8px 0 0 0',
      color: '#666',
      lineHeight: 1.4,
    }
  };

  return (
    <div style={styles.titleHeader}>
      <h1 style={styles.formTitle}>{title}</h1>
      {description && <p style={styles.formDescription}>{description}</p>}
    </div>
  );
};

export default TitleHeader;