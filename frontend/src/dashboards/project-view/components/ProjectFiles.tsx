import React, { useState, useEffect, useCallback } from 'react';
import { getAllProjectFiles } from '../ProjectViewUtils';
import AddFileLinkModal from './AddFileLinkModal';

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 11V1M8 11L4 7M8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/>
  </svg>
);

interface ProjectFilesProps {
  projectId: string;
}

interface ProjectFile {
  fileName: string;
  filePath: string;
  projectId: string;
  id: string;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);

  const loadFiles = useCallback(async () => {
    const result = await getAllProjectFiles(projectId);
    if (result.success) {
      setFiles(result.data as ProjectFile[]);
    }
  }, [projectId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileAdded = () => {
    loadFiles();
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

  const uploadButtonTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#005293',
    marginRight: '8px',
  };

  const downloadIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1f2937',
    marginLeft: '12px',
  };

  const uploadButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    background: '#ffffff',
    border: '1.35px solid #005293',
    color: '#005293',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Files</h2>
      <button
        style={uploadButtonStyle}
        onClick={() => setShowModal(true)}
      >
        <span style={uploadButtonTitleStyle}>Upload</span> 
        <span style={{ fill: "#005293" }}><UploadIcon /></span>
      </button>
      <p style={subtitleStyle}>Download Current Version</p>
      <div style={fileListStyle}>
        {files.length === 0 ? (
          <p style={{ ...subtitleStyle, marginTop: '1rem' }}>No files yet. Click Upload to add a file link.</p>
        ) : (
          files.map((file: ProjectFile) => (
            <a
              key={file.id}
              href={file.filePath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...fileButtonStyle,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <span style={fileNameStyle}>{file.fileName}</span>
              <span style={downloadIconStyle}>
                <DownloadIcon />
              </span>
            </a>
          ))
        )}
      </div>
      {showModal && (
        <AddFileLinkModal
          onClose={() => setShowModal(false)}
          projectId={projectId}
          onFileAdded={handleFileAdded}
        />
      )}
    </div>
  );
};

export default ProjectFiles;


