import { useNavigate } from "react-router-dom";
import winrockLogo from '../../../assets/winrock-international-logo.png';
import projectsIcon from '../../../assets/projects-icon.svg';
import notificationIcon from '../../../assets/notification-icon.svg';
import styles from '../css-modules/Sidebar.module.css';
import { getAuth, signOut } from "firebase/auth";

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
          onClick={() => navigate("/dashboard/admin/projects")}
        >
          <img src={projectsIcon} alt="Projects" />
          Projects
        </button>
        <button
          className={`${styles.headerNavButton} ${currentTab === 'notification-center' ? styles.active : ''}`}
          onClick={() => navigate("/dashboard/admin/notification-center")}
        >
          <img src={notificationIcon} alt="Notification Center" />
          Notification Center
        </button>
        <button
          className={`${styles.logoutButton}`}
          onClick={async () => {
            const auth = getAuth(); // Get the Firebase Auth instance
            try {
              await signOut(auth); // Sign out the user
              sessionStorage.removeItem("loggedIn");
              sessionStorage.removeItem("userEmail");
              navigate('/auth/login', { replace: true }); // Redirect to login page after logout
            } catch (error) {
              console.error("Error logging out:", error); // Handle errors
            }
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Sidebar;