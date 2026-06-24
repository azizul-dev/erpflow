import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* Main Page Layout Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar Component */}
        <Navbar
          toggleSidebar={toggleSidebar}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Dashboard Main Router Outlet */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 md:p-8">
          <Outlet context={{ toggleSidebar, sidebarCollapsed, toggleCollapse }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
