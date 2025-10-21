import { useNavigate } from "react-router-dom";
import winrockLogo from '../../../assets/winrock-international-logo.png';
import projectsIcon from '../../../assets/projects-icon.svg';
import notificationIcon from '../../../assets/notification-icon.svg';
import accountSettingsIcon from '../../../assets/account-settings-icon.svg';
import styles from '../css-modules/Sidebar.module.css';

interface SidebarProps {
  currentTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab }) => {
    const navigate = useNavigate()

    return (
        <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
        <div className={styles.headerNavContainer}>
          <button 
            className={`${styles.headerNavButton} ${currentTab === 'projects' ? styles.active : ''}`}
            onClick={() => navigate("/dashboard/supplier/projects")}
          >
            <img src={projectsIcon} alt="Projects" />
            Projects
          </button>
          <button 
            className={`${styles.headerNavButton} ${currentTab === 'notification-center' ? styles.active : ''}`}
            onClick={() => navigate("/dashboard/supplier/notification-center")}
          >
            <img src={notificationIcon} alt="Notification Center" />
            Notification Center
          </button>
          <button 
            className={`${styles.headerNavButton} ${currentTab === 'account-settings' ? styles.active : ''}`}
            onClick={() => navigate("/dashboard/supplier/account-settings")}
          >
            <img src={accountSettingsIcon} alt="Account Settings" />
            Account Settings
          </button>
        </div>
      </header>
    );
}

export default Sidebar;