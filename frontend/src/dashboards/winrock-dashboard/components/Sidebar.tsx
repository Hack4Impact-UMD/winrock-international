import React from "react";
import styles from "../css-modules/Sidebar.module.css";
import winrockLogo from "../../../assets/winrock-international-logo.png";

interface SidebarProps {
  activeSection?: "Projects" | "Notification Center" | "Account Settings";
  onNavigate?: (section: string) => void;
}

const ProjectsIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="#205493" strokeWidth="2.5"/>
    <rect x="17" y="3" width="8" height="8" rx="2" stroke="#205493" strokeWidth="2.5"/>
    <rect x="3" y="17" width="8" height="8" rx="2" stroke="#205493" strokeWidth="2.5"/>
    <rect x="17" y="17" width="8" height="8" rx="2" stroke="#205493" strokeWidth="2.5"/>
  </svg>
);

const NotificationIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 20V12C7 8.68629 9.68629 6 13 6C16.3137 6 19 8.68629 19 12V20" stroke="#205493" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M5 20H21" stroke="#205493" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M11 22C11 23.1046 11.8954 24 13 24C14.1046 24 15 23.1046 15 22" stroke="#205493" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SettingsIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 18.5C16.4853 18.5 18.5 16.4853 18.5 14C18.5 11.5147 16.4853 9.5 14 9.5C11.5147 9.5 9.5 11.5147 9.5 14C9.5 16.4853 11.5147 18.5 14 18.5Z" stroke="#205493" strokeWidth="2.5"/>
    <path d="M23.5 14C23.5 13.3627 23.4373 12.7367 23.3167 12.1307L25.1167 10.6167C25.3667 10.4067 25.4373 10.0367 25.2667 9.73667L23.2667 6.26333C23.096 5.96333 22.736 5.86333 22.436 6.03333L20.36 7.21667C19.736 6.73667 19.036 6.33667 18.2667 6.03667L17.96 3.61333C17.92 3.27333 17.62 3 17.2667 3H10.7333C10.38 3 10.08 3.27333 10.04 3.61333L9.73333 6.03667C8.96333 6.33667 8.26333 6.73667 7.64 7.21667L5.56333 6.03333C5.26333 5.86333 4.90333 5.96333 4.73333 6.26333L2.73333 9.73667C2.56267 10.0367 2.63333 10.4067 2.88333 10.6167L4.68333 12.1307C4.56267 12.7367 4.5 13.3627 4.5 14C4.5 14.6373 4.56267 15.2633 4.68333 15.8693L2.88333 17.3833C2.63333 17.5933 2.56267 17.9633 2.73333 18.2633L4.73333 21.7367C4.90333 22.0367 5.26333 22.1367 5.56333 21.9667L7.64 20.7833C8.26333 21.2633 8.96333 21.6633 9.73333 21.9633L10.04 24.3867C10.08 24.7267 10.38 25 10.7333 25H17.2667C17.62 25 17.92 24.7267 17.96 24.3867L18.2667 21.9633C19.036 21.6633 19.736 21.2633 20.36 20.7833L22.436 21.9667C22.736 22.1367 23.096 22.0367 23.2667 21.7367L25.2667 18.2633C25.4373 17.9633 25.3667 17.5933 25.1167 17.3833L23.3167 15.8693C23.4373 15.2633 23.5 14.6373 23.5 14Z" stroke="#205493" strokeWidth="2.5"/>
  </svg>
);

const navLinks = [
  { label: "Projects", icon: <ProjectsIcon /> },
  { label: "Notification Center", icon: <NotificationIcon /> },
  { label: "Account Settings", icon: <SettingsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection = "Projects", onNavigate }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
      </div>
      <nav className={styles.navLinks}>
        {navLinks.map((link) => (
          <button
            key={link.label}
            className={`${styles.navLink} ${activeSection === link.label ? styles.active : ""}`}
            onClick={() => onNavigate && onNavigate(link.label)}
          >
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.linkLabel}>{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 