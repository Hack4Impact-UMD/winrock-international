import React from 'react';

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 11V1M8 11L4 7M8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ProjectFiles: React.FC = () => {
  const files = [
    { name: 'Project Proposal Form' },
    { name: 'Risk and Co-Benefit Form' },
    { name: 'GHG Assessment' }
  ];

  const handleFileClick = (fileName: string) => {
    // Placeholder - do nothing for now
    console.log(`Clicked on ${fileName}`);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    background: 'transparent',
    padding: '20px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
    padding: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#6b7280',
    margin: 0,
    padding: 0,
  };

  const fileListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
  };

  const fileButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    width: '100%',
    textAlign: 'left',
  };

  const fileNameStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#1f2937',
    flex: 1,
  };

  const downloadIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1f2937',
    marginLeft: '12px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Files</h2>
      <p style={subtitleStyle}>Download Current Version</p>
      <div style={fileListStyle}>
        {files.map((file, index) => (
          <button
            key={index}
            style={fileButtonStyle}
            onClick={() => handleFileClick(file.name)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            <span style={fileNameStyle}>{file.name}</span>
            <span style={downloadIconStyle}>
              <DownloadIcon />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectFiles;

