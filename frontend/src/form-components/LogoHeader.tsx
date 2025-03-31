import React from 'react';

interface LogoHeaderProps {
  logoSrc?: string;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ logoSrc = '/winrock-logo.png' }) => {
  const styles = {
    logoHeader: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '15px',
      backgroundColor: 'white',
    },
    logo: {
      height: '30px',
      width: 'auto',
    }
  };

  return (
    <div style={styles.logoHeader}>
      <img src={logoSrc} alt="Winrock International Logo" style={styles.logo} />
    </div>
  );
};

export default LogoHeader;