import { useState } from "react";
import { useNavigate } from "react-router-dom";
import winrockLogo from '../../../assets/winrock-international-logo.png';
import projectsIcon from '../../../assets/projects-icon.svg';
import notificationIcon from '../../../assets/notification-icon.svg';
import accountSettingsIcon from '../../../assets/account-settings-icon.svg';
import styles from '../css-modules/WinrockDashboard.module.css';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const [activeNavButton, setActiveNavButton] = useState('Projects');

    return (
        <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
        <div className={styles.headerNavContainer}>
          <button 
            className={`${styles.headerNavButton} ${activeNavButton === 'Projects' ? styles.active : ''}`}
            onClick={() => {
                setActiveNavButton('Projects')
                navigate("/projects")
            }}
          >
            <img src={projectsIcon} alt="Projects" />
            Projects
          </button>
          <button 
            className={`${styles.headerNavButton} ${activeNavButton === 'Notification Center' ? styles.active : ''}`}
            onClick={() => {
                setActiveNavButton('Notification Center')
                navigate("/notification-center")
            }}
          >
            <img src={notificationIcon} alt="Notification Center" />
            Notification Center
          </button>
          <button 
            className={`${styles.headerNavButton} ${activeNavButton === 'Account Settings' ? styles.active : ''}`}
            onClick={() => {
                setActiveNavButton('Account Settings')
                navigate("/account-settings");
            }}
          >
            <img src={accountSettingsIcon} alt="Account Settings" />
            Account Settings
          </button>
        </div>
      </header>
    );
}

export default Sidebar;