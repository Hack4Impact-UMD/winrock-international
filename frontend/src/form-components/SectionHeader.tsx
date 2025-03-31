import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const styles = {
    sectionHeader: {
      backgroundColor: '#1e5180',
      color: 'white',
      padding: '10px 20px',
      marginTop: '1px',
      borderTop: '4px solid #4CAF50',
    },
    sectionTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 600,
    }
  };

  return (
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
  );
};

export default SectionHeader;