import { useState } from 'react';
import { useAuth } from '../../contexts';
import Sidebar from './Sidebar';
// import Header from './Header/index';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* <Header toggleSidebar={toggleSidebar} /> */}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        className={`
          fixed top-16 bottom-0 z-40 
          lg:left-0 lg:translate-x-0 lg:block
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'left-0' : '-translate-x-full'}
          ${isSidebarCollapsed ? 'lg:w-24' : 'lg:w-72'}
        `}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'}`}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 