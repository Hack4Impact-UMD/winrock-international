import { useState } from "react";
import NotificationList from "./NotificationList";
import Sidebar from "../components/Sidebar";
import styles from "../css-modules/NotificationCenter.module.css";

export type NotificationTab = "Unread" | "Read" | "All";

const NotificationCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"Projects" | "Notification Center" | "Account Settings">("Notification Center");
  const [selectedTab, setSelectedTab] = useState<NotificationTab>("Unread");

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      <Sidebar activeSection={activeSection} onNavigate={(section) => setActiveSection(section as "Projects" | "Notification Center" | "Account Settings")} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f4f5f7' }}>
        {activeSection === "Notification Center" && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
            <div style={{ background: '#fff', boxShadow: '0 1px 0 #e5e7eb' }}>
              <h1 className={styles.title}>Notification Center</h1>
              <NotificationList tab={selectedTab} />
            </div>
            <div style={{ flex: 1, background: '#f4f5f7' }} />
          </div>
        )}
        {/* You can add other sections here for Projects/Account Settings if needed */}
      </div>
    </div>
  );
};

export default NotificationCenter;